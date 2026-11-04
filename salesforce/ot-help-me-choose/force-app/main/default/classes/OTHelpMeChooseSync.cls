/**
 * Pulls finished conversations of the OpenText Business Network "Help me
 * choose" assistant (a Limio AI agent on the online store) and turns them into
 * Salesforce records: a Case when an existing customer asked for one, a Lead
 * when a prospect left their email after a plan recommendation. Records are
 * keyed on OT_Conversation_Id__c, so a conversation is only ever synced once.
 *
 * Runs on a schedule (OTHelpMeChooseSyncSchedule), and on demand from the
 * "Sync help me choose" action or `OTHelpMeChooseSync.run();`.
 */
public without sharing class OTHelpMeChooseSync implements Queueable, Database.AllowsCallouts {

    // Id of the Limio agent ot-help-me-choose on saas-dev.
    @TestVisible static String agentId = 'agent-66e703b9828bd2c987c1ff7a11d347cf';
    static final String ADMIN_BASE = 'https://saas-dev.prod.limio.com/ai/conversations/';

    // ---------------------------------------------------------------- entry points

    public void execute(QueueableContext ctx) {
        run();
    }

    @InvocableMethod(label='Sync OpenText help me choose conversations' description='Pull Cases and Leads from the OpenText help me choose assistant in Limio')
    public static List<Integer> syncNow(List<String> ignored) {
        return new List<Integer>{ run() };
    }

    // ---------------------------------------------------------------- work

    static Object get(String path) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:limio' + path);
        req.setMethod('GET');
        req.setTimeout(20000);
        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new CalloutException('Limio ' + path + ' returned ' + res.getStatusCode());
        }
        return JSON.deserializeUntyped(res.getBody());
    }

    static Map<String, Object> m(Object o) {
        return o instanceof Map<String, Object> ? (Map<String, Object>) o : new Map<String, Object>();
    }

    static String s(Map<String, Object> o, String k) {
        Object v = o.get(k);
        return v == null ? null : String.valueOf(v);
    }

    public static Integer run() {
        Map<String, Object> page = m(get('/api/chat/v1/admin/conversations?limit=50'));
        List<Object> convs = page.get('data') instanceof List<Object> ? (List<Object>) page.get('data') : new List<Object>();

        Set<String> candidates = new Set<String>();
        for (Object o : convs) {
            Map<String, Object> c = m(o);
            if (s(m(c.get('metadata')), 'agentId') == agentId && c.get('outcomeLabel') != null) {
                candidates.add(s(c, 'id'));
            }
        }
        if (candidates.isEmpty()) {
            return 0;
        }
        Set<String> done = new Set<String>();
        for (Case c : [SELECT OT_Conversation_Id__c FROM Case WHERE OT_Conversation_Id__c IN :candidates]) {
            done.add(c.OT_Conversation_Id__c);
        }
        for (Lead l : [SELECT OT_Conversation_Id__c FROM Lead WHERE OT_Conversation_Id__c IN :candidates]) {
            done.add(l.OT_Conversation_Id__c);
        }

        List<Case> cases = new List<Case>();
        List<Lead> leads = new List<Lead>();
        for (String convId : candidates) {
            if (done.contains(convId)) {
                continue;
            }
            Map<String, Object> conv = m(get('/api/chat/v1/admin/conversations/' + convId));
            Map<String, Object> outcome = m(conv.get('outcome'));
            String outcomeId = s(outcome, 'outcomeId');
            Map<String, Object> data = new Map<String, Object>(m(outcome.get('inputs')));
            data.put('outcomeId', outcomeId);
            data.put('conversationSummary', s(m(conv.get('summary')), 'text'));
            data.put('conversationLink', ADMIN_BASE + convId);

            if (outcomeId == OTAgentCaptureHandler.CASE_OUTCOME && data.get('case_email') != null) {
                cases.add(OTAgentCaptureHandler.buildCase(data));
            } else if (outcomeId == OTAgentCaptureHandler.LEAD_OUTCOME && data.get('lead_email') != null) {
                leads.add(OTAgentCaptureHandler.buildLead(data));
            }
        }
        OTAgentCaptureHandler.save(cases, leads);
        return cases.size() + leads.size();
    }
}
