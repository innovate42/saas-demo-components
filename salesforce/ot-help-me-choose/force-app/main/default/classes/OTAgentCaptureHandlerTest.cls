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

    @IsTest
    static void wholeOrderPayloadIsAccepted() {
        i42as__OrderEvent__e e = capture(new Map<String, Object>{
            'order_type' => 'data_capture',
            'data' => new Map<String, Object>{ 'outcomeId' => 'ot_existing_customer_case', 'case_email' => 'a@b.test', 'case_subject' => 'Help' }
        });
        System.assertEquals('ot_existing_customer_case', OTAgentCaptureHandler.captureOf(e).get('outcomeId'));
    }
}
