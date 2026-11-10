@IsTest
private class OTQuoteRequestHandlerTest {

    // Answers /api/published_catalog_items with one item whose path is the
    // requested one and a price that depends on whether it is the plan.
    class CatalogMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            String endpoint = req.getEndpoint();
            String path = EncodingUtil.urlDecode(endpoint.substringAfter('&path='), 'UTF-8');
            Boolean isPlan = endpoint.contains('record_type=offer');
            Map<String, Object> item = new Map<String, Object>{
                'path' => path,
                'name' => path.substringAfterLast('/'),
                'id' => 'id-' + path.length(),
                'type' => 'item',
                'version' => 'v1',
                'data' => new Map<String, Object>{
                    'path' => path,
                    'name' => path.substringAfterLast('/'),
                    'record_type' => isPlan ? 'offer' : 'add_on',
                    'attributes' => new Map<String, Object>{
                        'price__limio' => new List<Object>{
                            new Map<String, Object>{ 'name' => 'charge_1', 'value' => isPlan ? '8990.00' : '790.00', 'currencyCode' => 'USD' }
                        }
                    }
                }
            };
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody(JSON.serialize(new Map<String, Object>{ 'items' => new List<Object>{ item } }));
            return res;
        }
    }

    static String payload(String ref, String email) {
        return JSON.serialize(new Map<String, Object>{
            'form' => 'ot_quote_request',
            'quote_ref' => ref,
            'email' => email,
            'contact' => new Map<String, Object>{ 'first_name' => 'Dana', 'last_name' => 'Ross', 'email' => email, 'job_title' => 'Head of Supply Chain' },
            'company' => new Map<String, Object>{ 'name' => 'Harbor Foods Test Co', 'industry' => 'Grocery', 'country' => 'US' },
            'needs' => new Map<String, Object>{
                'product' => 'Trading Grid Enterprise',
                'erp' => 'Oracle NetSuite',
                'trading_partners' => 40,
                'key_partners' => 'Walmart, Kroger',
                'trade_regions' => new List<Object>{ 'North America' },
                'data_centre' => 'North America',
                'region' => 'NA',
                'term_years' => 3,
                'start_date' => '2026-12-10'
            },
            'billing_contact' => new Map<String, Object>{ 'name' => 'Dana Ross', 'email' => email },
            'billing_address' => new Map<String, Object>{ 'line1' => '1 Market St', 'city' => 'Chicago', 'state' => 'IL', 'postcode' => '60601', 'country' => 'US' },
            'currency' => 'USD',
            'lines' => new List<Object>{
                new Map<String, Object>{
                    'path' => '/offers2/OT Trading Grid Foundation 10 Annual USD',
                    'quantity' => 1,
                    'addOns' => new List<Object>{
                        new Map<String, Object>{ 'path' => '/add_ons/OT Extra Trading Partner Annual USD', 'quantity' => 30 }
                    }
                }
            },
            'estimate' => new Map<String, Object>{ 'annual' => 32690, 'one_time' => 0, 'contract_value' => 98070, 'term_years' => 3, 'currency' => 'USD' },
            'valid_until' => '2026-12-10'
        });
    }

    @IsTest
    static void createsAccountContactOpportunityAndQuote() {
        Test.setMock(HttpCalloutMock.class, new CatalogMock());
        Test.startTest();
        OTQuoteRequestHandler.Result r = OTQuoteRequestHandler.process(OTQuoteRequestHandler.dataOf(payload('OTQ-TEST-0001', 'dana.ross@harbor.example')));
        Test.stopTest();

        Opportunity opp = [SELECT Name, StageName, Amount, LeadSource, OT_Quote_Ref__c, OT_Partner_Count__c, OT_ERP__c, ContactId, AccountId, Description FROM Opportunity WHERE Id = :r.opportunityId];
        System.assertEquals('OTQ-TEST-0001', opp.OT_Quote_Ref__c);
        System.assertEquals('Proposal/Price Quote', opp.StageName);
        System.assertEquals(32690, opp.Amount);
        System.assertEquals(40, opp.OT_Partner_Count__c);
        System.assertEquals('Oracle NetSuite', opp.OT_ERP__c);
        System.assertEquals(r.contactId, opp.ContactId);
        System.assert(opp.Description.contains('Walmart, Kroger'));

        Account acc = [SELECT Name, BillingCity FROM Account WHERE Id = :r.accountId];
        System.assertEquals('Harbor Foods Test Co', acc.Name);
        System.assertEquals('Chicago', acc.BillingCity);

        i42as__Limio_Quote__c q = [SELECT i42as__Status__c, i42as__Approval_Status__c, i42as__Order_Payload__c, i42as__Bill_To_Contact__c FROM i42as__Limio_Quote__c WHERE Id = :r.quoteId];
        System.assertEquals('In Progress', q.i42as__Status__c);
        System.assertEquals('Needed', q.i42as__Approval_Status__c);
        System.assertEquals(r.contactId, q.i42as__Bill_To_Contact__c);
        List<Object> lines = (List<Object>) JSON.deserializeUntyped(q.i42as__Order_Payload__c);
        System.assertEquals(1, lines.size());
        Map<String, Object> line = (Map<String, Object>) lines[0];
        System.assertEquals('/offers2/OT Trading Grid Foundation 10 Annual USD', ((Map<String, Object>) line.get('offer')).get('path'));
        List<Object> addOns = (List<Object>) line.get('addOns');
        System.assertEquals(1, addOns.size());
        System.assertEquals(30, ((Map<String, Object>) addOns[0]).get('quantity'));

        System.assertEquals(1, [SELECT COUNT() FROM Task WHERE WhatId = :opp.Id]);
    }

    @IsTest
    static void sameReferenceTwiceCreatesOneQuote() {
        Test.setMock(HttpCalloutMock.class, new CatalogMock());
        Test.startTest();
        OTQuoteRequestHandler.process(OTQuoteRequestHandler.dataOf(payload('OTQ-TEST-0002', 'twice@harbor.example')));
        OTQuoteRequestHandler.process(OTQuoteRequestHandler.dataOf(payload('OTQ-TEST-0002', 'twice@harbor.example')));
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM Opportunity WHERE OT_Quote_Ref__c = 'OTQ-TEST-0002']);
        System.assertEquals(1, [SELECT COUNT() FROM Contact WHERE Email = 'twice@harbor.example']);
    }

    @IsTest
    static void existingContactKeepsItsAccount() {
        Account existing = new Account(Name = 'Existing Customer Test Co');
        insert existing;
        insert new Contact(AccountId = existing.Id, LastName = 'Known', Email = 'known@existing.example');
        Test.setMock(HttpCalloutMock.class, new CatalogMock());
        Test.startTest();
        OTQuoteRequestHandler.Result r = OTQuoteRequestHandler.process(OTQuoteRequestHandler.dataOf(payload('OTQ-TEST-0003', 'known@existing.example')));
        Test.stopTest();
        System.assertEquals(existing.Id, r.accountId);
        System.assertEquals(1, [SELECT COUNT() FROM Contact WHERE Email = 'known@existing.example']);
    }

    @IsTest
    static void platformEventIsRoutedToTheQuoteHandler() {
        Test.setMock(HttpCalloutMock.class, new CatalogMock());
        i42as__OrderEvent__e e = new i42as__OrderEvent__e(i42as__Type__c = 'DATA_CAPTURE', i42as__LimioOrder__c = payload('OTQ-TEST-0004', 'event@harbor.example'));
        System.assert(OTQuoteRequestHandler.isQuoteRequest(e));
        Test.startTest();
        EventBus.publish(e);
        Test.getEventBus().deliver();
        Test.stopTest();
        System.assertEquals(1, [SELECT COUNT() FROM i42as__Limio_Quote__c WHERE i42as__Opportunity__r.OT_Quote_Ref__c = 'OTQ-TEST-0004']);
    }

    @IsTest
    static void otherCapturesAreIgnored() {
        System.assertEquals(null, OTQuoteRequestHandler.process(new Map<String, Object>{ 'lead_email' => 'x@y.example' }));
        i42as__OrderEvent__e e = new i42as__OrderEvent__e(i42as__Type__c = 'DATA_CAPTURE', i42as__LimioOrder__c = '{"lead_email":"x@y.example"}');
        System.assert(!OTQuoteRequestHandler.isQuoteRequest(e));
    }
}
