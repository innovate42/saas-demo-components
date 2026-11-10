@IsTest
private class OTOrderEventHandlerTest {

    static String orderJson(String opportunityId) {
        Map<String, Object> custom = new Map<String, Object>{
            'OT_Product' => 'Trading Grid Foundation',
            'OT_ERP' => 'Oracle NetSuite',
            'OT_ERP_Adapter' => 'yes',
            'OT_TradingPartners' => 'Walmart; Target; Costco',
            'OT_PartnerCount' => '3',
            'OT_Documents' => '850 PO, 856 ASN, 810 Invoice',
            'OT_Region' => 'NA',
            'OT_DataCentre' => 'North America',
            'OT_Onboarding' => 'Guided onboarding'
        };
        if (opportunityId != null) {
            custom.put('opportunityId', opportunityId);
        }
        Map<String, Object> order = new Map<String, Object>{
            'order_type' => 'new',
            'customerDetails' => new Map<String, Object>{
                'firstName' => 'Dana', 'lastName' => 'Supplier', 'email' => 'dana@acme-supply.test', 'companyName' => 'Acme Supply Co'
            },
            'billingDetails' => new Map<String, Object>{ 'country' => 'US' },
            'customFields' => custom,
            'orderItems' => new List<Object>{
                new Map<String, Object>{
                    'quantity' => 1,
                    'offer' => new Map<String, Object>{
                        'path' => '/offers2/OT Trading Grid Foundation 5 Monthly USD',
                        'data' => new Map<String, Object>{ 'attributes' => new Map<String, Object>{
                            'price__limio' => new List<Object>{ new Map<String, Object>{ 'value' => '499.00', 'currencyCode' => 'USD' } },
                            'entitlements__limio' => new Map<String, Object>{ 'trading_partners' => 5 }
                        } }
                    }
                }
            }
        };
        return JSON.serialize(new Map<String, Object>{ 'order' => order });
    }

    @IsTest
    static void selfServeOrderCreatesOpportunityAndProvisioning() {
        i42as__OrderEvent__e e = new i42as__OrderEvent__e(i42as__orderJson__c = orderJson(null), i42as__OrderNumber__c = 'O-TEST-1');
        Test.startTest();
        OTOrderEventHandler.process(e);
        Test.stopTest();

        Opportunity opp = [SELECT StageName, Amount, OT_ERP__c, OT_Sales_Channel__c, OT_Order_Currency__c FROM Opportunity WHERE OT_Limio_Order__c = 'O-TEST-1'];
        System.assertEquals('Closed Won', opp.StageName);
        System.assertEquals(499, opp.Amount);
        System.assertEquals('Oracle NetSuite', opp.OT_ERP__c);
        System.assertEquals('USD', opp.OT_Order_Currency__c);
        System.assertEquals('Self-serve web store', opp.OT_Sales_Channel__c);

        i42as__ioProvisioningOrder__c prov = [SELECT Id, i42as__itemCount__c, OT_Customer_Email__c FROM i42as__ioProvisioningOrder__c WHERE OT_Opportunity__c = :opp.Id];
        // tenant + ERP + connectivity + 3 partners + guided onboarding
        System.assertEquals(7, prov.i42as__itemCount__c);
        System.assertEquals('dana@acme-supply.test', prov.OT_Customer_Email__c);
        System.assertEquals(1 + 1 + 3 * 2, [SELECT COUNT() FROM i42as__ioProvisioningDependency__c WHERE i42as__parent__r.i42as__ProvisioningOrder__c = :prov.Id]);
        System.assertEquals(1, [SELECT COUNT() FROM Contact WHERE Email = 'dana@acme-supply.test']);
    }

    @IsTest
    static void checkoutLinkOrderClosesTheRepsOpportunity() {
        Account a = new Account(Name = 'Acme Supply Co');
        insert a;
        Opportunity rep = new Opportunity(Name = 'Acme - Trading Grid', AccountId = a.Id, StageName = 'Prospecting', CloseDate = Date.today().addDays(30));
        insert rep;
        i42as__OrderEvent__e e = new i42as__OrderEvent__e(i42as__orderJson__c = orderJson(rep.Id), i42as__OrderNumber__c = 'O-TEST-2');
        Test.startTest();
        OTOrderEventHandler.process(e);
        Test.stopTest();

        Opportunity closed = [SELECT StageName, OT_Sales_Channel__c FROM Opportunity WHERE Id = :rep.Id];
        System.assertEquals('Closed Won', closed.StageName);
        System.assertEquals('Sales-assisted checkout link', closed.OT_Sales_Channel__c);
        System.assertEquals(1, [SELECT COUNT() FROM Opportunity]);
    }

    @IsTest
    static void trackingRecordIdOnAQuoteResolvesItsOpportunity() {
        Account a = new Account(Name = 'Quote Co');
        insert a;
        Opportunity rep = new Opportunity(Name = 'Quote Co - TG', AccountId = a.Id, StageName = 'Prospecting', CloseDate = Date.today());
        insert rep;
        i42as__Limio_Quote__c q = new i42as__Limio_Quote__c(i42as__Opportunity__c = rep.Id);
        Database.SaveResult sr = Database.insert(q, false);
        Map<String, Object> tracking = new Map<String, Object>{ 'recordId' => sr.isSuccess() ? (Object) q.Id : (Object) rep.Id, 'userId' => UserInfo.getUserId() };
        System.assertEquals(rep.Id, OTOrderEventHandler.linkedOpportunity(new Map<String, Object>(), tracking));
        System.assertEquals(null, OTOrderEventHandler.linkedOpportunity(new Map<String, Object>{ 'x' => 'not an id' }, new Map<String, Object>{ 'userId' => UserInfo.getUserId() }));
    }

    @IsTest
    static void limioSyncedOpportunityIsEnrichedNotDuplicated() {
        Account a = new Account(Name = 'Acme Supply Co');
        insert a;
        insert new Opportunity(Name = 'O-TEST-4', AccountId = a.Id, StageName = 'Closed Won', CloseDate = Date.today());
        Test.startTest();
        OTOrderEventHandler.process(new i42as__OrderEvent__e(i42as__orderJson__c = orderJson(null), i42as__OrderNumber__c = 'O-TEST-4'));
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM Opportunity]);
        Opportunity o = [SELECT Name, OT_ERP__c FROM Opportunity];
        System.assertEquals('OpenText Trading Grid Foundation - Acme Supply Co', o.Name);
        System.assertEquals('Oracle NetSuite', o.OT_ERP__c);
    }

    @IsTest
    static void otherTenantsOrdersAreIgnored() {
        String other = JSON.serialize(new Map<String, Object>{ 'order' => new Map<String, Object>{
            'orderItems' => new List<Object>{ new Map<String, Object>{ 'offer' => new Map<String, Object>{ 'path' => '/offers2/Something Else' } } }
        } });
        Test.startTest();
        OTOrderEventHandler.handle(new List<i42as__OrderEvent__e>{ new i42as__OrderEvent__e(i42as__orderJson__c = other) });
        OTOrderEventHandler.handle(new List<i42as__OrderEvent__e>{ new i42as__OrderEvent__e() });
        Test.stopTest();
        System.assertEquals(0, [SELECT COUNT() FROM Opportunity]);
    }

    @IsTest
    static void triggerFiresOnPublishedEvent() {
        Test.startTest();
        EventBus.publish(new i42as__OrderEvent__e(i42as__orderJson__c = orderJson(null), i42as__OrderNumber__c = 'O-TEST-3'));
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM Opportunity WHERE OT_Limio_Order__c = 'O-TEST-3']);
    }
}