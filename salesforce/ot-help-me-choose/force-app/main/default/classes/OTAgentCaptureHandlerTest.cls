@IsTest
private class OTAgentCaptureHandlerTest {

    static i42as__OrderEvent__e capture(Map<String, Object> data) {
        return new i42as__OrderEvent__e(i42as__Type__c = 'DATA_CAPTURE', i42as__LimioOrder__c = JSON.serialize(data));
    }

    @IsTest
    static void existingCustomerOpensCaseOnContact() {
        Account a = new Account(Name = 'Northwind Test Co');
        insert a;
        Contact ct = new Contact(LastName = 'Reyes', Email = 'jordan@northwind.test', AccountId = a.Id);
        insert ct;

        Test.startTest();
        EventBus.publish(capture(new Map<String, Object>{
            'outcomeId' => 'ot_existing_customer_case',
            'case_email' => 'jordan@northwind.test',
            'case_company' => 'unknown',
            'case_subject' => 'Walmart POs not arriving',
            'case_description' => 'Walmart 850s stopped reaching NetSuite yesterday.',
            'case_priority' => 'urgent',
            'conversationSummary' => 'Customer reports missing POs.',
            'conversationLink' => 'https://saas-dev.prod.limio.com/ai/conversations/conv-1'
        }));
        Test.getEventBus().deliver();
        Test.stopTest();

        Case c = [SELECT Subject, Priority, Origin, ContactId, AccountId, Description FROM Case WHERE SuppliedEmail = 'jordan@northwind.test'];
        System.assertEquals('OpenText Business Network: Walmart POs not arriving', c.Subject);
        System.assertEquals('High', c.Priority);
        System.assertEquals(ct.Id, c.ContactId);
        System.assertEquals(a.Id, c.AccountId);
        System.assert(c.Description.contains('conv-1'));
    }

    @IsTest
    static void qualifiedProspectBecomesLead() {
        Test.startTest();
        EventBus.publish(capture(new Map<String, Object>{
            'outcomeId' => 'ot_lead_contact_given',
            'lead_email' => 'jane@acme.test',
            'lead_name' => 'Jane Cole',
            'lead_company' => 'Acme Snacks',
            'lead_plan' => 'tg_foundation_5',
            'lead_details' => 'ERP: NetSuite; partners: Walmart, Target'
        }));
        Test.getEventBus().deliver();
        Test.stopTest();

        Lead l = [SELECT FirstName, LastName, Company, Description FROM Lead WHERE Email = 'jane@acme.test'];
        System.assertEquals('Jane', l.FirstName);
        System.assertEquals('Cole', l.LastName);
        System.assertEquals('Acme Snacks', l.Company);
        System.assert(l.Description.contains('Trading Grid Foundation 5'));
        System.assert(l.Description.contains('NetSuite'));
    }

    @IsTest
    static void otherAgentsAreIgnored() {
        Test.startTest();
        EventBus.publish(capture(new Map<String, Object>{ 'outcomeId' => 'qualified', 'email' => 'x@y.test' }));
        Test.getEventBus().deliver();
        Test.stopTest();
        System.assertEquals(0, [SELECT COUNT() FROM Lead WHERE Email = 'x@y.test']);
        System.assertEquals(0, [SELECT COUNT() FROM Case WHERE SuppliedEmail = 'x@y.test']);
    }

    // The plugin sends the data_capture order as Limio stores it: the captured
    // fields under data, no outcomeId (seen on saas-dev, 2026-11-04).
    @IsTest
    static void onboardingCaptureFillsTheProvisioningOrder() {
        Account a = new Account(Name = 'Acme Supply Co');
        insert a;
        Opportunity o = new Opportunity(Name = 'Acme', AccountId = a.Id, StageName = 'Closed Won', CloseDate = Date.today());
        insert o;
        i42as__ioProvisioningOrder__c p = new i42as__ioProvisioningOrder__c(i42as__OrderReference__c = '43PVTEST0001', OT_Customer_Email__c = 'dana@acme-supply.test', OT_Opportunity__c = o.Id);
        insert p;

        Test.startTest();
        EventBus.publish(capture(new Map<String, Object>{
            'order_type' => 'data_capture',
            'source' => 'chat',
            'data' => new Map<String, Object>{
                'order_reference' => '43PVTEST0001',
                'contact_email' => 'dana@acme-supply.test',
                'connection_method' => 'Web portal',
                'edi_interchange_id' => 'ZZ:ACMESUPPLY',
                'partners_confirmed' => 'Amazon Vendor Central (111), Costco (222)',
                'admin_users' => 'Benny - benny@acme-supply.test',
                'go_live_date' => '2026-11-11',
                'conversationSummary' => 'Ready for web portal setup.',
                'conversationLink' => 'https://saas-dev.prod.limio.com/ai/conversations/conv-onb-1'
            }
        }));
        Test.getEventBus().deliver();
        Test.stopTest();

        p = [SELECT OT_Conversation_Id__c, OT_Connection_Method__c, OT_EDI_ID__c, OT_Go_Live_Target__c, OT_Onboarding_Status__c,
                    OT_Onboarding_Summary__c, i42as__Status__c
             FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id];
        System.assertEquals('conv-onb-1', p.OT_Conversation_Id__c);
        System.assertEquals('Web portal', p.OT_Connection_Method__c);
        System.assertEquals('ZZ:ACMESUPPLY', p.OT_EDI_ID__c);
        System.assertEquals(Date.newInstance(2026, 11, 11), p.OT_Go_Live_Target__c);
        System.assertEquals('Onboarding details captured', p.OT_Onboarding_Status__c);
        System.assertEquals('InProgress', p.i42as__Status__c);
        System.assert(p.OT_Onboarding_Summary__c.contains('Costco (222)'));
        System.assertEquals(1, [SELECT COUNT() FROM Task WHERE WhatId = :o.Id]);
    }

    @IsTest
    static void onboardingFallsBackToTheEmail() {
        i42as__ioProvisioningOrder__c p = new i42as__ioProvisioningOrder__c(i42as__OrderReference__c = 'OTHERREF', OT_Customer_Email__c = 'dana@acme-supply.test');
        insert p;
        OTAgentCaptureHandler.applyOnboarding(new List<Map<String, Object>>{ new Map<String, Object>{
            'order_reference' => 'UNKNOWNREF', 'contact_email' => 'DANA@acme-supply.test', 'edi_interchange_id' => 'ZZ:X'
        } });
        System.assertEquals('ZZ:X', [SELECT OT_EDI_ID__c FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id].OT_EDI_ID__c);
    }

    @IsTest
    static void outcomeIsRecognisedWithoutOutcomeId() {
        System.assertEquals(OTAgentCaptureHandler.CASE_OUTCOME, OTAgentCaptureHandler.outcomeOf(new Map<String, Object>{ 'case_email' => 'a@b.test' }));
        System.assertEquals(OTAgentCaptureHandler.LEAD_OUTCOME, OTAgentCaptureHandler.outcomeOf(new Map<String, Object>{ 'lead_email' => 'a@b.test' }));
        System.assertEquals(OTAgentCaptureHandler.ONBOARDING_OUTCOME, OTAgentCaptureHandler.outcomeOf(new Map<String, Object>{ 'order_reference' => 'R', 'edi_interchange_id' => 'ZZ:X' }));
        System.assertEquals(null, OTAgentCaptureHandler.outcomeOf(new Map<String, Object>{ 'specialist_email' => 'a@b.test' }));
    }

    @IsTest
    static void wholeOrderPayloadIsAccepted() {
        i42as__OrderEvent__e e = capture(new Map<String, Object>{
            'order_type' => 'data_capture',
            'data' => new Map<String, Object>{ 'outcomeId' => 'ot_existing_customer_case', 'case_email' => 'a@b.test', 'case_subject' => 'Help' }
        });
        System.assertEquals('ot_existing_customer_case', OTAgentCaptureHandler.captureOf(e).get('outcomeId'));
    }
}
