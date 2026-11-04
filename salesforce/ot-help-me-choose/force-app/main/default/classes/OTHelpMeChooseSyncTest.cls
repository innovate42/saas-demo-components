@IsTest
private class OTHelpMeChooseSyncTest {

    class LimioMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            String agent = OTHelpMeChooseSync.agentId;
            if (req.getEndpoint().endsWith('/conversations?limit=50')) {
                res.setBody(JSON.serialize(new Map<String, Object>{ 'data' => new List<Object>{
                    new Map<String, Object>{ 'id' => 'conv-case', 'outcomeLabel' => 'Existing customer - case opened', 'metadata' => new Map<String, Object>{ 'agentId' => agent } },
                    new Map<String, Object>{ 'id' => 'conv-lead', 'outcomeLabel' => 'Lead - contact details given', 'metadata' => new Map<String, Object>{ 'agentId' => agent } },
                    new Map<String, Object>{ 'id' => 'conv-other', 'outcomeLabel' => 'qualified', 'metadata' => new Map<String, Object>{ 'agentId' => 'agent-other' } }
                } }));
            } else if (req.getEndpoint().endsWith('/conv-case')) {
                res.setBody(JSON.serialize(new Map<String, Object>{
                    'id' => 'conv-case',
                    'summary' => new Map<String, Object>{ 'text' => 'Missing Walmart POs.' },
                    'outcome' => new Map<String, Object>{ 'outcomeId' => 'ot_existing_customer_case', 'inputs' => new Map<String, Object>{
                        'case_email' => 'jordan@northwind.test', 'case_company' => 'Northwind', 'case_subject' => 'POs missing',
                        'case_description' => 'Walmart POs stopped.', 'case_priority' => 'urgent' } }
                }));
            } else {
                res.setBody(JSON.serialize(new Map<String, Object>{
                    'id' => 'conv-lead',
                    'outcome' => new Map<String, Object>{ 'outcomeId' => 'ot_lead_contact_given', 'inputs' => new Map<String, Object>{
                        'lead_email' => 'jane@acme.test', 'lead_name' => 'Jane Cole', 'lead_company' => 'Acme', 'lead_plan' => 'essentials_plus',
                        'lead_details' => 'No ERP; 4 partners' } }
                }));
            }
            return res;
        }
    }

    @IsTest
    static void syncsCaseAndLead() {
        Test.setMock(HttpCalloutMock.class, new LimioMock());
        Test.startTest();
        Integer synced = OTHelpMeChooseSync.run();
        Test.stopTest();

        System.assertEquals(2, synced);
        Case c = [SELECT Subject, Priority, OT_Conversation_Id__c, Description FROM Case WHERE SuppliedEmail = 'jordan@northwind.test'];
        System.assertEquals('conv-case', c.OT_Conversation_Id__c);
        System.assertEquals('High', c.Priority);
        System.assert(c.Description.contains('Missing Walmart POs.'));
        Lead l = [SELECT Company, OT_Conversation_Id__c, Description FROM Lead WHERE Email = 'jane@acme.test'];
        System.assertEquals('conv-lead', l.OT_Conversation_Id__c);
        System.assert(l.Description.contains('B2B Integration Essentials Plus'));
    }

    @IsTest
    static void alreadySyncedConversationsAreSkipped() {
        insert new Case(Subject = 'x', OT_Conversation_Id__c = 'conv-case');
        insert new Lead(LastName = 'x', Company = 'x', OT_Conversation_Id__c = 'conv-lead');
        Test.setMock(HttpCalloutMock.class, new LimioMock());
        Test.startTest();
        Integer synced = OTHelpMeChooseSync.run();
        Test.stopTest();
        System.assertEquals(0, synced);
    }

    @IsTest
    static void scheduleRegistersTwelveJobs() {
        Test.setMock(HttpCalloutMock.class, new LimioMock());
        Test.startTest();
        OTHelpMeChooseSyncSchedule.scheduleEveryFiveMinutes();
        Test.stopTest();
        System.assertEquals(12, [SELECT COUNT() FROM CronTrigger WHERE CronJobDetail.Name LIKE 'OT help me choose sync%']);
    }

    @IsTest
    static void scheduledRunEnqueuesSync() {
        Test.setMock(HttpCalloutMock.class, new LimioMock());
        Test.startTest();
        new OTHelpMeChooseSyncSchedule().execute(null);
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM Case WHERE OT_Conversation_Id__c = 'conv-case']);
    }
}
