@IsTest
private class OTWelcomeEmailTest {

    static i42as__ioProvisioningOrder__c order(String email, Boolean withContact) {
        Account a = new Account(Name = 'Acme Supply Co');
        insert a;
        if (withContact) {
            insert new Contact(FirstName = 'Dana', LastName = 'Ross', Email = email, AccountId = a.Id);
        }
        Opportunity o = new Opportunity(Name = 'Acme', AccountId = a.Id, StageName = 'Closed Won', CloseDate = Date.today());
        insert o;
        i42as__ioProvisioningOrder__c p = new i42as__ioProvisioningOrder__c(
            i42as__OrderReference__c = 'WELCOME0001', OT_Customer_Email__c = email, OT_Opportunity__c = o.Id,
            OT_Product__c = 'Trading Grid Foundation', OT_ERP__c = 'Oracle NetSuite', OT_ERP_Version__c = '2025.2',
            OT_Connection_Method__c = 'SFTP', OT_EDI_ID__c = 'ZZ:ACMESUPPLY', OT_Admin_Users__c = 'Dana Ross',
            OT_Data_Centre__c = 'North America', OT_Go_Live_Target__c = Date.newInstance(2026, 11, 13)
        );
        insert p;
        return p;
    }

    @IsTest
    static void onlyAmauryAddressesAreUsed() {
        System.assertEquals('amaury@limio.com', OTWelcomeEmail.safeRecipient('amaury@limio.com'));
        System.assertEquals('amaury+04111119@limio.com', OTWelcomeEmail.safeRecipient('Amaury+04111119@limio.com'));
        System.assertEquals('amaury@limio.com', OTWelcomeEmail.safeRecipient('dana@acme-supply.test'));
        System.assertEquals('amaury@limio.com', OTWelcomeEmail.safeRecipient('amaury@limio.com.evil.test'));
        System.assertEquals('amaury@limio.com', OTWelcomeEmail.safeRecipient(null));
    }

    @IsTest
    static void sendsOnceThenNeverAgain() {
        i42as__ioProvisioningOrder__c p = order('amaury+welcome@limio.com', true);
        Map<Id, String> partners = new Map<Id, String>{ p.Id => 'Walmart (448812), Target' };

        Test.startTest();
        OTWelcomeEmail.send(partners);
        Integer afterFirst = Limits.getEmailInvocations();
        OTWelcomeEmail.send(partners);
        Integer afterSecond = Limits.getEmailInvocations();
        Test.stopTest();

        System.assertEquals(1, afterFirst);
        System.assertEquals(1, afterSecond, 'a second capture must not send again');
        System.assertNotEquals(null, [SELECT OT_Welcome_Email_Sent__c FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id].OT_Welcome_Email_Sent__c);
    }

    @IsTest
    static void sendsWithoutAContact() {
        i42as__ioProvisioningOrder__c p = order('someone@acme-supply.test', false);
        Test.startTest();
        OTWelcomeEmail.send(new Map<Id, String>{ p.Id => null });
        Test.stopTest();
        System.assertNotEquals(null, [SELECT OT_Welcome_Email_Sent__c FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id].OT_Welcome_Email_Sent__c);
    }

    @IsTest
    static void checklistUsesTheCapturedAnswers() {
        i42as__ioProvisioningOrder__c p = order('amaury+list@limio.com', false);
        p = [SELECT Id, Name, i42as__OrderReference__c, OT_Customer_Email__c, OT_Opportunity__c, OT_Product__c, OT_ERP__c,
                    OT_ERP_Version__c, OT_Connection_Method__c, OT_EDI_ID__c, OT_Admin_Users__c, OT_Data_Centre__c,
                    OT_Go_Live_Target__c, OT_Welcome_Email_Sent__c
             FROM i42as__ioProvisioningOrder__c WHERE Id = :p.Id];
        String all = JSON.serialize(OTWelcomeEmail.checklist(p, 'Walmart (448812)'));
        System.assert(all.contains('Oracle NetSuite (2025.2)'), all);
        System.assert(all.contains('SFTP'), all);
        System.assert(all.contains('ZZ:ACMESUPPLY'), all);
        System.assert(all.contains('Walmart (448812)'), all);
        System.assert(all.contains('November 2026'), all);
    }
}
