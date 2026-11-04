/**
 * Turns what the OpenText Business Network "Help me choose" assistant (a Limio
 * AI agent) captures into Salesforce records. Limio's Salesforce plugin
 * publishes each agent data capture as an i42as__OrderEvent__e with
 * Type = DATA_CAPTURE and the captured fields, the AI conversation summary and
 * a link to the conversation in i42as__LimioOrder__c.
 *
 * - ot_existing_customer_case: a Case, linked to the Contact/Account by email.
 * - ot_lead_contact_given: a Lead carrying the recommended plan and the
 *   qualification answers.
 * - onboarding_captured (the ot-bn-onboarding assistant on the order
 *   confirmation page): the details go onto the provisioning order for that
 *   order reference, with a Task on its opportunity.
 *
 * The plugin's payload carries the captured fields but not the outcome id, so
 * the outcome is recognised from the fields when outcomeId is missing (only
 * OTHelpMeChooseSync adds it). Captures from other agents are ignored.
 */
public without sharing class OTAgentCaptureHandler {

    public static final String CASE_OUTCOME = 'ot_existing_customer_case';
    public static final String LEAD_OUTCOME = 'ot_lead_contact_given';
    public static final String ONBOARDING_OUTCOME = 'onboarding_captured';

    static final Map<String, String> PLAN_NAMES = new Map<String, String>{
        'essentials_starter' => 'B2B Integration Essentials Starter',
        'essentials_plus' => 'B2B Integration Essentials Plus',
        'tg_foundation_5' => 'Trading Grid Foundation 5',
        'tg_foundation_10' => 'Trading Grid Foundation 10',
        'enterprise' => 'Trading Grid Enterprise'
    };

    public static void handle(List<i42as__OrderEvent__e> events) {
        List<Case> cases = new List<Case>();
        List<Lead> leads = new List<Lead>();
        List<Map<String, Object>> onboardings = new List<Map<String, Object>>();
        for (i42as__OrderEvent__e e : events) {
            try {
                Map<String, Object> data = captureOf(e);
                String outcome = outcomeOf(data);
                if (outcome == CASE_OUTCOME) {
                    cases.add(buildCase(data));
                } else if (outcome == LEAD_OUTCOME) {
                    leads.add(buildLead(data));
                } else if (outcome == ONBOARDING_OUTCOME) {
                    onboardings.add(data);
                }
            } catch (Exception ex) {
                System.debug(LoggingLevel.ERROR, 'OT agent capture failed: ' + ex.getMessage() + ' ' + ex.getStackTraceString());
            }
        }
        save(cases, leads);
        applyOnboarding(onboardings);
    }

    @TestVisible
    static String outcomeOf(Map<String, Object> d) {
        String outcome = str(d, 'outcomeId');
        if (outcome != null) {
            return outcome;
        }
        if (str(d, 'case_email') != null) {
            return CASE_OUTCOME;
        }
        if (str(d, 'lead_email') != null) {
            return LEAD_OUTCOME;
        }
        if (str(d, 'edi_interchange_id') != null && (str(d, 'order_reference') != null || str(d, 'contact_email') != null)) {
            return ONBOARDING_OUTCOME;
        }
        return null;
    }

    // Upsert on the conversation id so the event path and OTHelpMeChooseSync
    // never create the same record twice. Upsert refuses a blank key, so
    // records without one are inserted.
    public static void save(List<Case> cases, List<Lead> leads) {
        List<Case> keyedCases = new List<Case>();
        List<Case> plainCases = new List<Case>();
        for (Case c : cases) {
            (String.isBlank(c.OT_Conversation_Id__c) ? plainCases : keyedCases).add(c);
        }
        List<Lead> keyedLeads = new List<Lead>();
        List<Lead> plainLeads = new List<Lead>();
        for (Lead l : leads) {
            (String.isBlank(l.OT_Conversation_Id__c) ? plainLeads : keyedLeads).add(l);
        }
        List<Database.UpsertResult> results = new List<Database.UpsertResult>();
        if (!keyedCases.isEmpty()) {
            results.addAll(Database.upsert(keyedCases, Case.OT_Conversation_Id__c, false));
        }
        if (!keyedLeads.isEmpty()) {
            results.addAll(Database.upsert(keyedLeads, Lead.OT_Conversation_Id__c, false));
        }
        for (Database.UpsertResult r : results) {
            if (!r.isSuccess()) {
                System.debug(LoggingLevel.ERROR, 'OT agent capture save failed: ' + r.getErrors());
            }
        }
        if (!plainCases.isEmpty()) {
            insert plainCases;
        }
        if (!plainLeads.isEmpty()) {
            insert plainLeads;
        }
    }

    // ---------------------------------------------------------------- onboarding

    // Same fields as OTOnboardingSync, which skips any provisioning order that
    // already carries the conversation id, so the two paths never double up.
    public static void applyOnboarding(List<Map<String, Object>> captures) {
        if (captures.isEmpty()) {
            return;
        }
        Set<String> refs = new Set<String>();
        Set<String> emails = new Set<String>();
        for (Map<String, Object> d : captures) {
            if (str(d, 'order_reference') != null) {
                refs.add(str(d, 'order_reference'));
            }
            if (str(d, 'contact_email') != null) {
                emails.add(str(d, 'contact_email'));
            }
        }
        Map<String, i42as__ioProvisioningOrder__c> byRef = new Map<String, i42as__ioProvisioningOrder__c>();
        Map<String, i42as__ioProvisioningOrder__c> byEmail = new Map<String, i42as__ioProvisioningOrder__c>();
        for (i42as__ioProvisioningOrder__c p : [SELECT Id, OT_Opportunity__c, i42as__OrderReference__c, OT_Customer_Email__c
                                                FROM i42as__ioProvisioningOrder__c
                                                WHERE i42as__OrderReference__c IN :refs OR OT_Customer_Email__c IN :emails
                                                ORDER BY CreatedDate DESC]) {
            if (p.i42as__OrderReference__c != null && !byRef.containsKey(p.i42as__OrderReference__c)) {
                byRef.put(p.i42as__OrderReference__c, p);
            }
            if (p.OT_Customer_Email__c != null && !byEmail.containsKey(p.OT_Customer_Email__c.toLowerCase())) {
                byEmail.put(p.OT_Customer_Email__c.toLowerCase(), p);
            }
        }

        Map<Id, i42as__ioProvisioningOrder__c> updates = new Map<Id, i42as__ioProvisioningOrder__c>();
        List<Task> tasks = new List<Task>();
        Id owner = ownerId();
        for (Map<String, Object> d : captures) {
            String email = str(d, 'contact_email');
            i42as__ioProvisioningOrder__c p = byRef.get(str(d, 'order_reference'));
            if (p == null && email != null) {
                p = byEmail.get(email.toLowerCase());
            }
            if (p == null) {
                System.debug(LoggingLevel.WARN, 'OT onboarding capture: no provisioning order for ' + str(d, 'order_reference'));
                continue;
            }

            String captured = '';
            for (String k : new List<String>{ 'order_reference', 'contact_email', 'erp_version', 'connection_method',
                                              'edi_interchange_id', 'partners_confirmed', 'admin_users', 'go_live_date' }) {
                captured += line(k, str(d, k));
            }
            String summary = str(d, 'conversationSummary');
            String link = str(d, 'conversationLink');

            p.OT_Conversation_Id__c = conversationId(d);
            p.OT_ERP_Version__c = str(d, 'erp_version') == null ? null : str(d, 'erp_version').left(120);
            p.OT_Connection_Method__c = str(d, 'connection_method') == null ? null : str(d, 'connection_method').left(80);
            p.OT_EDI_ID__c = str(d, 'edi_interchange_id').left(120);
            p.OT_Admin_Users__c = str(d, 'admin_users') == null ? null : str(d, 'admin_users').left(255);
            String goLive = str(d, 'go_live_date');
            if (goLive != null) {
                try {
                    p.OT_Go_Live_Target__c = Date.valueOf(goLive.left(10));
                } catch (Exception ignore) {
                    // free text date: it is in the summary
                }
            }
            p.OT_Onboarding_Status__c = 'Onboarding details captured';
            p.i42as__Status__c = 'InProgress';
            p.OT_Onboarding_Summary__c = ('CAPTURED BY THE ONBOARDING ASSISTANT\n' + captured
                + '\nSUMMARY\n' + (summary == null ? '' : summary)
                + '\n\nConversation: ' + (link == null ? '' : link)).left(32000);
            updates.put(p.Id, p);

            if (p.OT_Opportunity__c != null) {
                Task t = new Task(
                    WhatId = p.OT_Opportunity__c,
                    Subject = 'Onboarding details captured by the OpenText onboarding assistant',
                    Description = (captured + '\n' + (summary == null ? '' : summary) + '\n\nConversation: ' + (link == null ? '' : link)).left(32000),
                    Status = 'Completed',
                    Priority = 'Normal',
                    ActivityDate = Date.today()
                );
                if (owner != null) {
                    t.OwnerId = owner;
                }
                tasks.add(t);
            }
        }
        if (!updates.isEmpty()) {
            update updates.values();
        }
        if (!tasks.isEmpty()) {
            insert tasks;
        }
    }

    // ---------------------------------------------------------------- parse

    @TestVisible
    static Map<String, Object> captureOf(i42as__OrderEvent__e e) {
        String raw = String.isNotBlank(e.i42as__LimioOrder__c) ? e.i42as__LimioOrder__c : e.i42as__orderJson__c;
        if (String.isBlank(raw)) {
            return new Map<String, Object>();
        }
        Object parsed = JSON.deserializeUntyped(raw);
        if (!(parsed instanceof Map<String, Object>)) {
            return new Map<String, Object>();
        }
        Map<String, Object> root = (Map<String, Object>) parsed;
        // The plugin sends the order's data block; accept the whole order too.
        if (!root.containsKey('outcomeId') && root.get('data') instanceof Map<String, Object>) {
            return (Map<String, Object>) root.get('data');
        }
        return root;
    }

    static String str(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return v == null || String.isBlank(String.valueOf(v)) ? null : String.valueOf(v).trim();
    }

    // The agent sends 'unknown' rather than leaving a required field empty.
    static String known(String value) {
        return value == null || value.equalsIgnoreCase('unknown') ? null : value;
    }

    static String line(String label, String value) {
        return String.isBlank(value) ? '' : label + ': ' + value + '\n';
    }

    // The conversation id is the last segment of the admin link.
    @TestVisible
    static String conversationId(Map<String, Object> d) {
        String link = str(d, 'conversationLink');
        return link == null ? null : link.substringAfterLast('/');
    }

    static Id ownerId() {
        String username = System.Label.OT_Record_Owner_Username;
        List<User> users = [SELECT Id FROM User WHERE Username = :username AND IsActive = true LIMIT 1];
        return users.isEmpty() ? null : users[0].Id;
    }

    // ---------------------------------------------------------------- records

    public static Case buildCase(Map<String, Object> d) {
        String email = str(d, 'case_email');
        String name = known(str(d, 'case_contact_name'));
        String company = known(str(d, 'case_company'));
        String subject = str(d, 'case_subject');
        String urgent = str(d, 'case_priority');

        Case c = new Case(
            Subject = ('OpenText Business Network: ' + (subject == null ? 'support request' : subject)).left(255),
            Origin = 'Web',
            Priority = urgent == 'urgent' ? 'High' : 'Medium',
            SuppliedEmail = email,
            SuppliedName = name == null ? null : name.left(80),
            SuppliedCompany = company == null ? null : company.left(80),
            Description = ('Opened by the OpenText Business Network assistant (Limio AI agent) on the online store.\n\n'
                + 'REQUEST\n' + (str(d, 'case_description') == null ? '' : str(d, 'case_description')) + '\n\n'
                + 'CUSTOMER\n' + line('Name', name) + line('Company', company) + line('Email', email)
                + line('Subscription / order', str(d, 'subscription_reference')) + line('Priority', urgent)
                + '\nCONVERSATION SUMMARY\n' + (str(d, 'conversationSummary') == null ? '' : str(d, 'conversationSummary'))
                + '\n\nConversation: ' + (str(d, 'conversationLink') == null ? '' : str(d, 'conversationLink'))).left(32000)
        );
        c.OT_Conversation_Id__c = conversationId(d);
        if (String.isNotBlank(email)) {
            List<Contact> contacts = [SELECT Id, AccountId FROM Contact WHERE Email = :email ORDER BY CreatedDate DESC LIMIT 1];
            if (!contacts.isEmpty()) {
                c.ContactId = contacts[0].Id;
                c.AccountId = contacts[0].AccountId;
            }
        }
        Id owner = ownerId();
        if (owner != null) {
            c.OwnerId = owner;
        }
        return c;
    }

    public static Lead buildLead(Map<String, Object> d) {
        String email = str(d, 'lead_email');
        String name = known(str(d, 'lead_name'));
        String company = known(str(d, 'lead_company'));
        String planKey = str(d, 'lead_plan');
        String plan = PLAN_NAMES.containsKey(planKey) ? PLAN_NAMES.get(planKey) : planKey;

        String first = null;
        String last = name;
        if (name != null && name.contains(' ')) {
            first = name.substringBefore(' ');
            last = name.substringAfter(' ');
        }
        if (String.isBlank(last)) {
            last = email == null ? 'Unknown' : email.substringBefore('@');
        }
        if (String.isBlank(company)) {
            company = email == null ? 'Unknown' : email.substringAfter('@');
        }

        Lead l = new Lead(
            FirstName = first == null ? null : first.left(40),
            LastName = last.left(80),
            Company = company.left(255),
            Email = email,
            LeadSource = 'Web',
            Status = 'Open - Not Contacted',
            Description = ('Qualified by the OpenText Business Network assistant (Limio AI agent) on the online store.\n\n'
                + 'RECOMMENDED PLAN\n' + line('Plan', plan) 
                + '\nQUALIFICATION\n' + line('Details', str(d, 'lead_details'))
                + '\nCONVERSATION SUMMARY\n' + (str(d, 'conversationSummary') == null ? '' : str(d, 'conversationSummary'))
                + '\n\nConversation: ' + (str(d, 'conversationLink') == null ? '' : str(d, 'conversationLink'))).left(32000)
        );
        l.OT_Conversation_Id__c = conversationId(d);
        Id owner = ownerId();
        if (owner != null) {
            l.OwnerId = owner;
        }
        return l;
    }
}
