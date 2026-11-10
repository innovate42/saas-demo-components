/**
 * Turns a quote built by the buyer on the OpenText store (/ot-quote, component
 * ot-quote-builder) into Salesforce records the account team can work from:
 * Account, Contact, Opportunity and a Limio quote (i42as__Limio_Quote__c), plus
 * a Task for the opportunity owner.
 *
 * The store sends a Limio `data_capture` order. Limio's Salesforce plugin
 * publishes it as an i42as__OrderEvent__e with Type DATA_CAPTURE and the
 * order's data block in i42as__LimioOrder__c, recognised here by
 * form = "ot_quote_request". OTOrderEventTrigger routes those events here.
 *
 * The event only carries catalog paths and quantities (the field holds 32k
 * characters), so the quote lines are rebuilt from Limio's published catalog
 * over the `limio` named credential. Callouts are not allowed in a trigger, so
 * the work runs in this Queueable.
 *
 * The Limio quote needs an Opportunity, and its contact comes from the
 * opportunity's ContactId, which is why the request creates all four records
 * rather than a Lead.
 *
 * Idempotent on the quote reference (Opportunity.OT_Quote_Ref__c).
 */
public without sharing class OTQuoteRequestHandler implements Queueable, Database.AllowsCallouts {

    public static final String FORM = 'ot_quote_request';
    static final String LEAD_SOURCE = 'OT Quote Builder';
    static final String STAGE = 'Proposal/Price Quote';

    final List<String> payloads;

    public OTQuoteRequestHandler(List<String> payloads) {
        this.payloads = payloads;
    }

    // ---------------------------------------------------------------- routing

    public static Boolean isQuoteRequest(i42as__OrderEvent__e e) {
        String raw = rawOf(e);
        return String.isNotBlank(raw) && raw.contains('"' + FORM + '"');
    }

    public static void handle(List<i42as__OrderEvent__e> events) {
        List<String> raws = new List<String>();
        for (i42as__OrderEvent__e e : events) {
            raws.add(rawOf(e));
        }
        if (!raws.isEmpty()) {
            System.enqueueJob(new OTQuoteRequestHandler(raws));
        }
    }

    static String rawOf(i42as__OrderEvent__e e) {
        return String.isNotBlank(e.i42as__LimioOrder__c) ? e.i42as__LimioOrder__c : e.i42as__orderJson__c;
    }

    public void execute(QueueableContext ctx) {
        for (String raw : payloads) {
            try {
                process(dataOf(raw));
            } catch (Exception ex) {
                System.debug(LoggingLevel.ERROR, 'OT quote request failed: ' + ex.getMessage() + ' ' + ex.getStackTraceString());
            }
        }
    }

    // ---------------------------------------------------------------- work

    public class Result {
        public Id accountId;
        public Id contactId;
        public Id opportunityId;
        public Id quoteId;
    }

    @TestVisible
    static Map<String, Object> dataOf(String raw) {
        Map<String, Object> root = (Map<String, Object>) JSON.deserializeUntyped(raw);
        // The plugin sends the order's data block; accept the whole order too.
        if (!root.containsKey('form') && root.get('data') instanceof Map<String, Object>) {
            return (Map<String, Object>) root.get('data');
        }
        return root;
    }

    public static Result process(Map<String, Object> d) {
        if (str(d, 'form') != FORM) {
            return null;
        }
        String ref = str(d, 'quote_ref');
        Result r = new Result();

        if (ref != null) {
            List<Opportunity> existing = [SELECT Id, AccountId, ContactId FROM Opportunity WHERE OT_Quote_Ref__c = :ref LIMIT 1];
            if (!existing.isEmpty()) {
                r.opportunityId = existing[0].Id;
                r.accountId = existing[0].AccountId;
                r.contactId = existing[0].ContactId;
                return r;
            }
        }

        // Catalog callouts first: Apex refuses a callout after DML in the same transaction.
        String orderPayload = JSON.serialize(buildLines(d.get('lines')));

        Map<String, Object> contact = asMap(d.get('contact'));
        Map<String, Object> company = asMap(d.get('company'));
        Map<String, Object> needs = asMap(d.get('needs'));
        Map<String, Object> billingAddress = asMap(d.get('billing_address'));
        Map<String, Object> estimate = asMap(d.get('estimate'));

        String email = firstNonNull(str(contact, 'email'), str(d, 'email'));
        String companyName = firstNonNull(str(company, 'name'), str(d, 'companyName'), 'Unknown company');
        Id ownerId = ownerId();

        // Contact by email first: its Account is the customer's.
        Contact con;
        if (email != null) {
            List<Contact> found = [SELECT Id, AccountId FROM Contact WHERE Email = :email ORDER BY CreatedDate DESC LIMIT 1];
            if (!found.isEmpty() && found[0].AccountId != null) {
                con = found[0];
            }
        }

        Account acc;
        if (con != null) {
            acc = new Account(Id = con.AccountId);
        } else {
            List<Account> found = [SELECT Id FROM Account WHERE Name = :companyName ORDER BY CreatedDate DESC LIMIT 1];
            if (!found.isEmpty()) {
                acc = found[0];
            } else {
                acc = new Account(
                    Name = companyName.left(255),
                    Website = str(company, 'website'),
                    Description = joinLines(new List<String>{
                        label('Industry', str(company, 'industry')),
                        label('Employees', str(company, 'employees')),
                        label('Tax ID', str(company, 'tax_id'))
                    })
                );
                if (ownerId != null) {
                    acc.OwnerId = ownerId;
                }
                setBillingAddress(acc, billingAddress, str(company, 'country'));
                insert acc;
            }
        }
        r.accountId = acc.Id;

        if (con == null) {
            con = new Contact(
                AccountId = acc.Id,
                FirstName = str(contact, 'first_name'),
                LastName = firstNonNull(str(contact, 'last_name'), 'Unknown'),
                Email = email,
                Phone = str(contact, 'phone'),
                Title = str(contact, 'job_title'),
                LeadSource = LEAD_SOURCE
            );
            if (ownerId != null) {
                con.OwnerId = ownerId;
            }
            insert con;
        }
        r.contactId = con.Id;

        Integer partners = intOf(needs.get('trading_partners'));
        Decimal annual = decOf(estimate.get('annual'));
        Decimal oneTime = decOf(estimate.get('one_time'));
        String currencyCode = firstNonNull(str(d, 'currency'), str(estimate, 'currency'), 'USD');
        Date startDate = dateOf(str(needs, 'start_date'));

        Opportunity opp = new Opportunity(
            AccountId = acc.Id,
            ContactId = con.Id,
            Name = (companyName + ' – Trading Grid Enterprise quote ' + (ref == null ? '' : ref)).trim().left(120),
            StageName = STAGE,
            CloseDate = Date.today().addDays(30),
            LeadSource = LEAD_SOURCE,
            Amount = annual == null ? null : annual + (oneTime == null ? 0 : oneTime),
            OT_Quote_Ref__c = ref,
            OT_Product__c = firstNonNull(str(needs, 'product'), 'Trading Grid Enterprise'),
            OT_ERP__c = str(needs, 'erp'),
            OT_Partner_Count__c = partners,
            OT_Region__c = str(needs, 'region'),
            OT_Data_Centre__c = str(needs, 'data_centre'),
            OT_Order_Currency__c = currencyCode.left(3),
            OT_Sales_Channel__c = 'Online quote',
            OT_Trading_Partners__c = str(needs, 'key_partners'),
            Description = describe(d, needs, estimate, currencyCode)
        );
        if (ownerId != null) {
            opp.OwnerId = ownerId;
        }
        insert opp;
        r.opportunityId = opp.Id;

        i42as__Limio_Quote__c q = new i42as__Limio_Quote__c(
            i42as__Opportunity__c = opp.Id,
            i42as__Status__c = 'In Progress',
            i42as__Approval_Status__c = 'Needed',
            i42as__Amount__c = opp.Amount,
            i42as__Offers_Purchase_Country__c = countryCode(firstNonNull(str(billingAddress, 'country'), str(company, 'country'))),
            i42as__Order_Start_Date__c = startDate,
            i42as__Bill_To_Account__c = acc.Id,
            i42as__Sold_To_Account__c = acc.Id,
            i42as__Bill_To_Contact__c = con.Id,
            i42as__Sold_To_Contact__c = con.Id,
            i42as__Order_Payload__c = orderPayload
        );
        if (ownerId != null) {
            q.OwnerId = ownerId;
        }
        insert q;
        r.quoteId = q.Id;

        Task t = new Task(
            WhatId = opp.Id,
            WhoId = con.Id,
            Subject = 'Review customer-built quote ' + (ref == null ? '' : ref),
            Description = opp.Description,
            Status = 'Not Started',
            Priority = 'High',
            ActivityDate = Date.today().addDays(1)
        );
        if (ownerId != null) {
            t.OwnerId = ownerId;
        }
        insert t;
        return r;
    }

    // ---------------------------------------------------------------- quote lines

    // One line per plan, add-ons nested under it, in the shape Limio for
    // Salesforce stores in i42as__Order_Payload__c.
    @TestVisible
    static List<Object> buildLines(Object linesObj) {
        List<Object> out = new List<Object>();
        if (!(linesObj instanceof List<Object>)) {
            return out;
        }
        for (Object o : (List<Object>) linesObj) {
            Map<String, Object> line = asMap(o);
            Map<String, Object> offer = catalogItem('offer', str(line, 'path'));
            if (offer == null) {
                continue;
            }
            List<Object> addOns = new List<Object>();
            if (line.get('addOns') instanceof List<Object>) {
                for (Object ao : (List<Object>) line.get('addOns')) {
                    Map<String, Object> a = asMap(ao);
                    Map<String, Object> item = catalogItem('add_on', str(a, 'path'));
                    if (item == null) {
                        continue;
                    }
                    addOns.add(new Map<String, Object>{
                        'addOn' => item,
                        'quantity' => Math.max(1, intOf(a.get('quantity')) == null ? 1 : intOf(a.get('quantity'))),
                        'discountPercentage' => 0,
                        'effectivePrice' => priceOf(item)
                    });
                }
            }
            out.add(new Map<String, Object>{
                'description' => 'New Subscription',
                'offer' => offer,
                'quantity' => Math.max(1, intOf(line.get('quantity')) == null ? 1 : intOf(line.get('quantity'))),
                'id' => uuid(),
                'addOns' => addOns,
                'label' => 'Add-Ons',
                'discountPercentage' => 0,
                'effectivePrice' => priceOf(offer),
                'hasOverride' => false,
                'pricingSource' => 'discount'
            });
        }
        return out;
    }

    // A published catalog item: {path, data, name, id, type, version}, the
    // same shape Limio for Salesforce embeds in a quote line.
    @TestVisible
    static Map<String, Object> catalogItem(String recordType, String path) {
        if (String.isBlank(path)) {
            return null;
        }
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:limio/api/published_catalog_items?record_type=' + recordType + '&path=' + EncodingUtil.urlEncode(path, 'UTF-8').replace('+', '%20'));
        req.setMethod('GET');
        req.setTimeout(20000);
        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            System.debug(LoggingLevel.ERROR, 'Limio catalog ' + path + ' returned ' + res.getStatusCode());
            return null;
        }
        Map<String, Object> body = asMap(JSON.deserializeUntyped(res.getBody()));
        if (!(body.get('items') instanceof List<Object>) || ((List<Object>) body.get('items')).isEmpty()) {
            return null;
        }
        return asMap(((List<Object>) body.get('items'))[0]);
    }

    static Decimal priceOf(Map<String, Object> item) {
        Map<String, Object> attributes = asMap(asMap(item.get('data')).get('attributes'));
        if (attributes.get('price__limio') instanceof List<Object>) {
            List<Object> charges = (List<Object>) attributes.get('price__limio');
            if (!charges.isEmpty()) {
                return decOf(asMap(charges[0]).get('value'));
            }
        }
        return 0;
    }

    // ---------------------------------------------------------------- helpers

    static Id ownerId() {
        try {
            String username = System.Label.OT_Record_Owner_Username;
            List<User> u = [SELECT Id FROM User WHERE Username = :username AND IsActive = true LIMIT 1];
            return u.isEmpty() ? null : u[0].Id;
        } catch (Exception e) {
            return null;
        }
    }

    static void setBillingAddress(Account acc, Map<String, Object> a, String fallbackCountry) {
        acc.BillingStreet = str(a, 'line1');
        acc.BillingCity = str(a, 'city');
        acc.BillingPostalCode = str(a, 'postcode');
        String country = countryCode(firstNonNull(str(a, 'country'), fallbackCountry));
        if (country != null) {
            acc.put('BillingCountryCode', country);
            // State picklists only accept known codes; set the US/CA ones.
            String state = str(a, 'state');
            if (state != null && state.length() == 2 && (country == 'US' || country == 'CA')) {
                acc.put('BillingStateCode', state.toUpperCase());
            }
        }
    }

    static String countryCode(String c) {
        return c == null ? null : c.trim().toUpperCase().left(2);
    }

    static String describe(Map<String, Object> d, Map<String, Object> needs, Map<String, Object> estimate, String currencyCode) {
        Map<String, Object> billing = asMap(d.get('billing_contact'));
        Map<String, Object> tech = asMap(d.get('technical_contact'));
        List<String> regions = new List<String>();
        if (needs.get('trade_regions') instanceof List<Object>) {
            for (Object o : (List<Object>) needs.get('trade_regions')) {
                regions.add(String.valueOf(o));
            }
        }
        return joinLines(new List<String>{
            'Quote built by the customer on the OpenText store (Limio).',
            label('Quote reference', str(d, 'quote_ref')),
            label('Valid until', str(d, 'valid_until')),
            label('ERP', str(needs, 'erp')),
            label('Trading partners', str(needs, 'trading_partners')),
            label('Key partners', str(needs, 'key_partners')),
            label('Document volume', str(needs, 'documents_per_month')),
            label('Trades in', regions.isEmpty() ? null : String.join(regions, ', ')),
            label('Data centre', str(needs, 'data_centre')),
            label('Commitment', str(needs, 'term_years') == null ? null : str(needs, 'term_years') + ' year(s)'),
            label('Preferred start', str(needs, 'start_date')),
            needs.get('managed_services') == true ? 'Managed services requested' : null,
            label('Annual subscription', money(estimate.get('annual'), currencyCode)),
            label('One-off', money(estimate.get('one_time'), currencyCode)),
            label('Total contract value', money(estimate.get('contract_value'), currencyCode)),
            label('Billing contact', joinNonBlank(new List<String>{ str(billing, 'name'), str(billing, 'email') }, ', ')),
            label('Technical contact', joinNonBlank(new List<String>{ str(tech, 'name'), str(tech, 'email') }, ', ')),
            d.get('po_required') == true ? label('PO required', firstNonNull(str(d, 'po_number'), 'yes')) : null,
            label('Tax exemption', str(d, 'tax_exempt')),
            label('Comments', str(d, 'comments'))
        }).left(32000);
    }

    static String money(Object v, String currencyCode) {
        Decimal n = decOf(v);
        return n == null ? null : currencyCode + ' ' + n.setScale(0).format();
    }

    static String label(String name, String value) {
        return String.isBlank(value) ? null : name + ': ' + value;
    }

    static String joinLines(List<String> parts) {
        return joinNonBlank(parts, '\n');
    }

    static String joinNonBlank(List<String> parts, String sep) {
        List<String> kept = new List<String>();
        for (String p : parts) {
            if (String.isNotBlank(p)) {
                kept.add(p);
            }
        }
        return kept.isEmpty() ? null : String.join(kept, sep);
    }

    static String uuid() {
        String h = EncodingUtil.convertToHex(Crypto.generateAesKey(128));
        return h.substring(0, 8) + '-' + h.substring(8, 12) + '-' + h.substring(12, 16) + '-' + h.substring(16, 20) + '-' + h.substring(20, 32);
    }

    static Map<String, Object> asMap(Object o) {
        return o instanceof Map<String, Object> ? (Map<String, Object>) o : new Map<String, Object>();
    }

    static String str(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return v == null || String.isBlank(String.valueOf(v)) ? null : String.valueOf(v).trim();
    }

    static String firstNonNull(String a, String b) {
        return a != null ? a : b;
    }

    static String firstNonNull(String a, String b, String c) {
        return a != null ? a : (b != null ? b : c);
    }

    static Integer intOf(Object v) {
        Decimal d = decOf(v);
        return d == null ? null : d.intValue();
    }

    static Decimal decOf(Object v) {
        if (v == null) {
            return null;
        }
        try {
            return Decimal.valueOf(String.valueOf(v));
        } catch (Exception e) {
            return null;
        }
    }

    static Date dateOf(String iso) {
        try {
            return iso == null ? null : Date.valueOf(iso);
        } catch (Exception e) {
            return null;
        }
    }
}
