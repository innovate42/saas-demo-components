@IsTest
private class OTProvisioningRecapTest {

    static i42as__ioProvisioningOrder__c order() {
        Account a = new Account(Name = 'Acme Supply Co');
        insert a;
        i42as__ioProvisioningOrder__c p = new i42as__ioProvisioningOrder__c(
            i42as__OrderReference__c = 'RECAP0001', OT_Customer_Email__c = 'amaury+recap@limio.com', OT_Account__c = a.Id,
            OT_Product__c = 'B2B Integration Essentials', OT_Connection_Method__c = 'Web portal', OT_EDI_ID__c = 'ZZ:ACME',
            OT_Admin_Users__c = 'Dana Ross', OT_Go_Live_Target__c = Date.newInstance(2026, 11, 14),
            OT_Onboarding_Summary__c = 'CAPTURED BY THE ONBOARDING ASSISTANT\npartners_confirmed: Costco (333444)\n\nConversation: https://example.test/ai/conversations/conv-1'
        );
        insert p;
        return p;
    }

    @IsTest
    static void newOrdersGetTheDefaultProvisioningOwner() {
        i42as__ioProvisioningOrder__c p = order();
        Id expected = OTProvisioningOwner.defaultOwnerId();
        System.assertEquals(expected, [SELECT OT_Provisioning_Owner__c FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id].OT_Provisioning_Owner__c);
    }

    @IsTest
    static void recapIsSentToTheOwnerAndLogged() {
        i42as__ioProvisioningOrder__c p = order();
        p.OT_Provisioning_Owner__c = UserInfo.getUserId();
        update p;

        OTProvisioningRecap.Request r = new OTProvisioningRecap.Request();
        r.orderId = p.Id;
        Test.startTest();
        List<OTProvisioningRecap.Result> out = OTProvisioningRecap.send(new List<OTProvisioningRecap.Request>{ r });
        Integer emails = Limits.getEmailInvocations();
        Test.stopTest();

        System.assert(out[0].message.startsWith('Recap sent to'), out[0].message);
        System.assertEquals(1, emails);
        Task t = [SELECT Subject, TaskSubtype FROM Task WHERE WhatId = :p.Id];
        System.assert(t.Subject.contains('Ready to provision: Acme Supply Co (RECAP0001)'), t.Subject);
        System.assertEquals('Email', t.TaskSubtype);
    }

    @IsTest
    static void noOwnerNoEmail() {
        i42as__ioProvisioningOrder__c p = order();
        p.OT_Provisioning_Owner__c = null;
        update p;
        System.assert(OTProvisioningRecap.sendOne(p.Id).startsWith('Set a Provisioning Owner'));
        System.assertEquals(0, Limits.getEmailInvocations());
    }

    @IsTest
    static void partnersComeFromTheSummary() {
        System.assertEquals('Costco (333444)', OTProvisioningRecap.partners('x\npartners_confirmed: Costco (333444)\ny'));
        System.assertEquals(null, OTProvisioningRecap.partners(null));
    }
}
