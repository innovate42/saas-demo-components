@IsTest
private class OTOpportunityDedupeTest {

    static Opportunity ours(String ref, Id accountId) {
        Opportunity mine = new Opportunity(Name = 'OpenText Trading Grid Foundation - Dedupe Co', AccountId = accountId, StageName = 'Closed Won',
            CloseDate = Date.today(), OT_Limio_Order__c = ref, OT_ERP__c = 'SAP Business One', OT_Sales_Channel__c = 'Self-serve web store',
            Description = 'Limio new order ' + ref);
        insert mine;
        return mine;
    }

    static Opportunity synced(String name, String ref, Id accountId) {
        Opportunity o = new Opportunity(Name = name, AccountId = accountId, StageName = 'Closed Won', CloseDate = Date.today());
        o.put('OrderNumber__c', OTOpportunityDedupe.keyOf(ref));
        return o;
    }

    @IsTest
    static void keyIsTheLastEightCharacters() {
        System.assertEquals('DRJS2700', OTOpportunityDedupe.keyOf('7R0MDRJS2700'));
        System.assertEquals(null, OTOpportunityDedupe.keyOf(null));
    }

    @IsTest
    static void lateSyncedOpportunityAbsorbsOurs() {
        Account a = new Account(Name = 'Dedupe Co');
        insert a;
        Account storeAcct = new Account(Name = 'Dedupe Co Store', Description = 'Created by the OpenText Business Network store (Limio).');
        insert storeAcct;
        Opportunity mine = ours('7R0MDRJS2700', storeAcct.Id);
        i42as__ioProvisioningOrder__c p = new i42as__ioProvisioningOrder__c(i42as__OrderReference__c = '7R0MDRJS2700', OT_Opportunity__c = mine.Id);
        insert p;
        insert new Task(WhatId = mine.Id, Subject = 'Onboarding details captured');
        Test.startTest();
        insert synced('7R0MDRJS2700', '7R0MDRJS2700', a.Id);
        Test.stopTest();
        List<Opportunity> left = [SELECT Id, Name, OT_ERP__c, OT_Sales_Channel__c FROM Opportunity];
        System.assertEquals(1, left.size());
        System.assertEquals('OpenText Trading Grid Foundation - Dedupe Co', left[0].Name);
        System.assertEquals('SAP Business One', left[0].OT_ERP__c);
        System.assertEquals('Self-serve web store', left[0].OT_Sales_Channel__c);
        System.assertEquals(left[0].Id, [SELECT OT_Opportunity__c FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id].OT_Opportunity__c);
        System.assertEquals(left[0].Id, [SELECT WhatId FROM Task].WhatId);
        System.assertEquals(1, [SELECT COUNT() FROM Account], 'store-created account merged into the synced one');
    }

    // Same second: the sync's opportunity committed first, then ours; the job
    // queued by OTOrderEventHandler (afterOurs) pairs them.
    @IsTest
    static void oursLandingLastIsFoldedToo() {
        Account a = new Account(Name = 'Race Co');
        insert a;
        Opportunity sync = synced('1CI25J01QKNG', '1CI25J01QKNG', a.Id);
        insert sync;
        ours('1CI25J01QKNG', a.Id);
        Test.startTest();
        OTOpportunityDedupe.afterOurs(new Set<String>{ '1CI25J01QKNG' });
        Test.stopTest();
        List<Opportunity> left = [SELECT Id, Name, OT_ERP__c FROM Opportunity];
        System.assertEquals(1, left.size());
        System.assertEquals(sync.Id, left[0].Id, 'the sync opportunity (products, quote) is the one kept');
        System.assertEquals('SAP Business One', left[0].OT_ERP__c);
    }

    @IsTest
    static void planChangeKeepsTheSyncNameAndDescription() {
        Account a = new Account(Name = 'Change Co');
        insert a;
        Opportunity sync = synced('OpenText B2B Integration Essentials - Change Co', '49O7KC9MR600', a.Id);
        sync.Description = 'Essentials Plus, Extra Trading Partner';
        insert sync;
        ours('49O7KC9MR600', a.Id);
        OTOpportunityDedupe.run(new Set<String>{ 'KC9MR600' });
        Opportunity left = [SELECT Name, Description, OT_Limio_Order__c FROM Opportunity];
        System.assertEquals('OpenText B2B Integration Essentials - Change Co', left.Name);
        System.assertEquals('Essentials Plus, Extra Trading Partner', left.Description);
        System.assertEquals('49O7KC9MR600', left.OT_Limio_Order__c);
    }

    @IsTest
    static void unrelatedOpportunitiesAreUntouched() {
        Test.startTest();
        insert new Opportunity(Name = 'Just a deal', StageName = 'Prospecting', CloseDate = Date.today());
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM Opportunity]);
    }
}
