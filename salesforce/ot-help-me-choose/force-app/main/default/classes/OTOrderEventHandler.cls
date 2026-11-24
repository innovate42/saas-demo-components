/**
 * Turns Limio order events for the OpenText Business Network store into
 * Salesforce records: Account + Contact, a Closed Won Opportunity (or closes the
 * opportunity a sales rep's checkout link came from), and a provisioning order
 * with one item per step (tenant, ERP adapter, connectivity, each trading
 * partner) wired with dependencies, ready for the Trading Grid automation
 * templates.
 *
 * Non-OpenText orders on the same tenant are ignored.
 */
public without sharing class OTOrderEventHandler {

    public static void handle(List<i42as__OrderEvent__e> events) {
        for (i42as__OrderEvent__e e : events) {
            try {
                process(e);
            } catch (Exception ex) {
                System.debug(LoggingLevel.ERROR, 'OT order event failed: ' + ex.getMessage() + ' ' + ex.getStackTraceString());
            }
        }
    }

    // ---------------------------------------------------------------- parse

    @TestVisible
    static Map<String, Object> orderOf(i42as__OrderEvent__e e) {
        String raw = String.isNotBlank(e.i42as__orderJson__c) ? e.i42as__orderJson__c : e.i42as__LimioOrder__c;
        if (String.isBlank(raw)) {
            return new Map<String, Object>();
        }
        Object parsed = JSON.deserializeUntyped(raw);
        if (!(parsed instanceof Map<String, Object>)) {
            return new Map<String, Object>();
        }
        Map<String, Object> root = (Map<String, Object>) parsed;
        return root.get('order') instanceof Map<String, Object> ? (Map<String, Object>) root.get('order') : root;
    }

    static Map<String, Object> mapOf(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return v instanceof Map<String, Object> ? (Map<String, Object>) v : new Map<String, Object>();
    }

    static List<Object> listOf(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return v instanceof List<Object> ? (List<Object>) v : new List<Object>();
    }

    static String str(Map<String, Object> m, String key) {
        Object v = m == null ? null : m.get(key);
        return v == null ? null : String.valueOf(v);
    }

    static String firstNonBlank(List<String> values) {
        for (String v : values) {
            if (String.isNotBlank(v)) {
                return v;
            }
        }
        return null;
    }

    @TestVisible
    static Boolean isOpenText(Map<String, Object> order, Map<String, Object> custom, i42as__OrderEvent__e e) {
        if (custom.containsKey('OT_Product')) {
            return true;
        }
        if (String.isNotBlank(e.i42as__ProductCode__c) && e.i42as__ProductCode__c.startsWith('OT-BN')) {
            return true;
        }
        for (Object o : listOf(order, 'orderItems')) {
            String path = str(mapOf((Map<String, Object>) o, 'offer'), 'path');
            if (path != null && (path.startsWith('/offers2/OT ') || path.startsWith('/add_ons/OT '))) {
                return true;
            }
        }
        return false;
    }

    // An order that started from a sales rep's checkout link carries the record
    // the link was generated from in tracking.recordId (Limio for Salesforce):
    // either the opportunity itself or a Limio quote that points at one.
    @TestVisible
    static Id linkedOpportunity(Map<String, Object> custom, Map<String, Object> tracking) {
        for (Map<String, Object> source : new List<Map<String, Object>>{ custom, tracking }) {
            for (String k : source.keySet()) {
                Object v = source.get(k);
                if (!(v instanceof String)) {
                    continue;
                }
                String s = (String) v;
                if (s.length() != 15 && s.length() != 18) {
                    continue;
                }
                Id candidate;
                try {
                    candidate = Id.valueOf(s);
                } catch (Exception ignore) {
                    continue;
                }
                String type = candidate.getSObjectType().getDescribe().getName();
                if (type == 'Opportunity') {
                    return candidate;
                }
                if (type == 'i42as__Limio_Quote__c') {
                    List<i42as__Limio_Quote__c> q = [SELECT i42as__Opportunity__c FROM i42as__Limio_Quote__c WHERE Id = :candidate LIMIT 1];
                    if (!q.isEmpty() && q[0].i42as__Opportunity__c != null) {
                        return q[0].i42as__Opportunity__c;
                    }
                }
                if (type == 'Limio_Quote__c') {
                    List<SObject> q = Database.query('SELECT Opportunity__c FROM Limio_Quote__c WHERE Id = :candidate LIMIT 1');
                    if (!q.isEmpty() && q[0].get('Opportunity__c') != null) {
                        return (Id) q[0].get('Opportunity__c');
                    }
                }
            }
        }
        return null;
    }

    static Decimal orderValue(Map<String, Object> order, i42as__OrderEvent__e e) {
        if (e.i42as__OrderValue__c != null) {
            return e.i42as__OrderValue__c;
        }
        Decimal total = 0;
        for (Object o : listOf(order, 'orderItems')) {
            Map<String, Object> item = (Map<String, Object>) o;
            Map<String, Object> attrs = mapOf(mapOf(mapOf(item, 'offer'), 'data'), 'attributes');
            List<Object> prices = listOf(attrs, 'price__limio');
            if (!prices.isEmpty()) {
                String value = str((Map<String, Object>) prices[0], 'value');
                Decimal qty = item.get('quantity') == null ? 1 : Decimal.valueOf(String.valueOf(item.get('quantity')));
                if (String.isNotBlank(value)) {
                    total += Decimal.valueOf(value) * qty;
                }
            }
        }
        return total;
    }

    static String currencyOf(Map<String, Object> order, i42as__OrderEvent__e e) {
        String c = firstNonBlank(new List<String>{ e.i42as__OrderCurrency__c, e.i42as__Currency__c });
        if (c != null) {
            return c;
        }
        for (Object o : listOf(order, 'orderItems')) {
            Map<String, Object> attrs = mapOf(mapOf(mapOf((Map<String, Object>) o, 'offer'), 'data'), 'attributes');
            List<Object> prices = listOf(attrs, 'price__limio');
            if (!prices.isEmpty()) {
                return str((Map<String, Object>) prices[0], 'currencyCode');
            }
        }
        return null;
    }

    // --------------------------------------------------------------- process

    // Platform-event triggers run as Automated Process; give the records a real
    // owner (the username in the OT_Record_Owner_Username label) so they show up
    // in that user's views.
    static Id ownerId() {
        String username = System.Label.OT_Record_Owner_Username;
        List<User> users = [SELECT Id FROM User WHERE Username = :username AND IsActive = true LIMIT 1];
        return users.isEmpty() ? null : users[0].Id;
    }

    @TestVisible
    static void process(i42as__OrderEvent__e e) {
        Map<String, Object> order = orderOf(e);
        Map<String, Object> custom = mapOf(order, 'customFields');
        Map<String, Object> tracking = mapOf(order, 'tracking');
        if (!isOpenText(order, custom, e)) {
            return;
        }

        Map<String, Object> customer = mapOf(order, 'customerDetails');
        Map<String, Object> billing = mapOf(order, 'billingDetails');
        String email = firstNonBlank(new List<String>{ str(customer, 'email'), e.i42as__PurchaserEmail__c, e.i42as__email__c });
        String first = firstNonBlank(new List<String>{ str(customer, 'firstName'), e.i42as__PurchaserFirstName__c, e.i42as__firstName__c });
        String last = firstNonBlank(new List<String>{ str(customer, 'lastName'), e.i42as__PurchaserLastName__c, e.i42as__lastName__c, 'Customer' });
        String company = firstNonBlank(new List<String>{ str(customer, 'companyName'), str(billing, 'company'), (first == null ? '' : first + ' ') + last });
        String country = firstNonBlank(new List<String>{ str(billing, 'country'), e.i42as__PurchaserCountryCode__c, e.i42as__CountryCode__c });

        String orderType = firstNonBlank(new List<String>{ str(order, 'order_type'), e.i42as__OrderType__c, 'new' });
        Boolean isNew = orderType == 'new';
        String orderNumber = firstNonBlank(new List<String>{ e.i42as__OrderNumber__c, str(order, 'orderReference'), str(order, 'id'), e.i42as__uid__c,
            'OT-' + String.valueOf(Datetime.now().getTime()) });
        // Platform events can be redelivered: one provisioning order per Limio order.
        if (![SELECT Id FROM i42as__ioProvisioningOrder__c WHERE i42as__OrderReference__c = :orderNumber LIMIT 1].isEmpty()) {
            return;
        }
        String subscription = firstNonBlank(new List<String>{ e.i42as__SubscriptionId__c, str(mapOf(order, 'forSubscription'), 'id') });
        String product = firstNonBlank(new List<String>{ str(custom, 'OT_Product'), e.i42as__OfferDisplayName__c, e.i42as__ProductName__c, 'OpenText Business Network' });
        String erp = str(custom, 'OT_ERP');
        String region = str(custom, 'OT_Region');
        String dataCentre = str(custom, 'OT_DataCentre');
        String partnersRaw = str(custom, 'OT_TradingPartners');
        String documents = str(custom, 'OT_Documents');
        String onboarding = str(custom, 'OT_Onboarding');
        Decimal amount = orderValue(order, e);
        String currencyCode = currencyOf(order, e);

        Id owner = ownerId();

        // Account + contact
        // Limio for Salesforce files the customer under the contact's email: reuse
        // that account so the store and the sync agree on one customer.
        Account acct;
        List<Account> accts = new List<Account>();
        if (String.isNotBlank(email)) {
            for (Contact c : [SELECT AccountId, Account.Name FROM Contact WHERE Email = :email AND AccountId != null ORDER BY CreatedDate DESC LIMIT 1]) {
                accts.add(new Account(Id = c.AccountId, Name = c.Account.Name));
            }
        }
        if (accts.isEmpty()) {
            accts = [SELECT Id, Name FROM Account WHERE Name = :company ORDER BY CreatedDate DESC LIMIT 1];
        }
        if (accts.isEmpty()) {
            acct = new Account(Name = company, Description = 'Created by the OpenText Business Network store (Limio).');
            // State & country picklists are on in this org: set the ISO code, not the name
            if (owner != null) {
                acct.OwnerId = owner;
            }
            if (country != null && country.length() == 2) {
                acct.put('BillingCountryCode', country.toUpperCase());
            }
            insert acct;
        } else {
            acct = accts[0];
        }
        if (String.isNotBlank(email)) {
            List<Contact> contacts = [SELECT Id FROM Contact WHERE Email = :email AND AccountId = :acct.Id LIMIT 1];
            if (contacts.isEmpty()) {
                insert new Contact(AccountId = acct.Id, FirstName = first, LastName = last, Email = email);
            }
        }

        // Opportunity: close the rep's one if the order came from a checkout link
        Id linked = linkedOpportunity(custom, tracking);
        Opportunity opp;
        if (linked != null) {
            List<Opportunity> found = [SELECT Id, Name FROM Opportunity WHERE Id = :linked LIMIT 1];
            if (!found.isEmpty()) {
                opp = found[0];
            }
        }
        String channel = opp != null ? 'Sales-assisted checkout link' : 'Self-serve web store';
        String friendlyName = ('OpenText ' + product + ' - ' + company + (isNew ? '' : ' (plan change)')).left(120);
        // Limio for Salesforce's own order sync creates an opportunity for the same
        // order (OrderNumber__c = the last 8 characters of the reference; a new
        // order's is also named after the reference): enrich that one rather than
        // creating a duplicate. If it has not committed yet, OTOpportunityDedupe
        // folds ours into it once it has.
        Boolean ours = false;
        if (opp == null && String.isNotBlank(orderNumber)) {
            String key = OTOpportunityDedupe.keyOf(orderNumber);
            List<Opportunity> synced = [SELECT Id, Name FROM Opportunity WHERE OrderNumber__c = :key OR Name = :orderNumber ORDER BY CreatedDate ASC LIMIT 1];
            if (!synced.isEmpty()) {
                opp = synced[0];
                if (opp.Name == orderNumber || opp.Name == key) {
                    opp.Name = friendlyName;
                }
                opp.AccountId = acct.Id;
            }
        }
        if (opp == null) {
            ours = true;
            opp = new Opportunity(
                Name = friendlyName,
                AccountId = acct.Id,
                LeadSource = 'Web',
                Type = isNew ? 'New Customer' : 'Existing Customer - Upgrade'
            );
        }
        if (opp.Id == null && owner != null) {
            opp.OwnerId = owner;
        }
        opp.StageName = 'Closed Won';
        opp.CloseDate = Date.today();
        opp.Amount = amount;
        opp.OT_Product__c = product;
        opp.OT_Region__c = region;
        opp.OT_Data_Centre__c = dataCentre;
        opp.OT_ERP__c = erp;
        opp.OT_Trading_Partners__c = partnersRaw;
        opp.OT_Partner_Count__c = String.isBlank(str(custom, 'OT_PartnerCount')) ? null : Decimal.valueOf(str(custom, 'OT_PartnerCount'));
        opp.OT_Order_Currency__c = currencyCode;
        opp.OT_Limio_Order__c = orderNumber;
        opp.OT_Limio_Subscription__c = subscription;
        opp.OT_Sales_Channel__c = channel;
        opp.OT_Onboarding__c = onboarding;
        opp.Description = 'Limio ' + orderType + ' order ' + orderNumber + '. ERP: ' + erp + '. Partners: ' + partnersRaw + '. Data centre: ' + dataCentre + '.';
        upsert opp;
        if (ours) {
            OTOpportunityDedupe.afterOurs(new Set<String>{ orderNumber });
        }

        // Provisioning order + items
        i42as__ioProvisioningOrder__c prov = new i42as__ioProvisioningOrder__c(
            i42as__OrderName__c = ('OpenText ' + product + ' - ' + company).left(255),
            i42as__OrderReference__c = orderNumber,
            i42as__Source__c = 'Limio web store',
            i42as__Status__c = 'Submitted',
            i42as__ProcessStatus__c = 'Submitted',
            i42as__Context__c = JSON.serializePretty(custom),
            OT_Account__c = acct.Id,
            OT_Opportunity__c = opp.Id,
            OT_Product__c = product,
            OT_ERP__c = erp,
            OT_Region__c = region,
            OT_Data_Centre__c = dataCentre,
            OT_Customer_Email__c = email,
            OT_Go_Live_Target__c = Date.today().addDays(9),
            OT_Onboarding_Status__c = 'Waiting for onboarding assistant',
            OT_Entitlements__c = JSON.serializePretty(entitlementsOf(order))
        );
        if (owner != null) {
            prov.OwnerId = owner;
        }
        insert prov;

        List<i42as__ioProvisioningOrderItem__c> items = new List<i42as__ioProvisioningOrderItem__c>();
        i42as__ioProvisioningOrderItem__c tenant = item(prov, orderNumber, orderType, 'Tenant',
            isNew ? 'Provision Trading Grid tenant in ' + (dataCentre == null ? 'home region' : dataCentre) : 'Apply plan change to tenant', null, null, 'Submitted');
        items.add(tenant);
        i42as__ioProvisioningOrderItem__c erpItem;
        if (String.isNotBlank(erp) && !erp.startsWith('n/a')) {
            erpItem = item(prov, orderNumber, orderType, 'ERP', 'Install ' + erp + ' adapter', null, null, 'Draft');
            items.add(erpItem);
        }
        i42as__ioProvisioningOrderItem__c conn = item(prov, orderNumber, orderType, 'Connectivity', 'Configure connectivity (AS2 / SFTP / VAN)', null, null, 'Draft');
        items.add(conn);
        List<i42as__ioProvisioningOrderItem__c> partnerItems = new List<i42as__ioProvisioningOrderItem__c>();
        if (String.isNotBlank(partnersRaw)) {
            for (String p : partnersRaw.split(';')) {
                if (String.isNotBlank(p.trim())) {
                    partnerItems.add(item(prov, orderNumber, orderType, 'Trading partner', 'Onboard trading partner: ' + p.trim(), p.trim(), documents, 'Draft'));
                }
            }
        }
        items.addAll(partnerItems);
        if (onboarding == 'Guided onboarding') {
            items.add(item(prov, orderNumber, orderType, 'Services', 'Assign B2B specialist for guided onboarding', null, null, 'Submitted'));
        }
        for (Integer i = 0; i < items.size(); i++) {
            items[i].i42as__OrderReference__c = (orderNumber + '-' + (i + 1)).left(255);
        }
        insert items;
        prov.i42as__itemCount__c = items.size();
        update prov;

        List<i42as__ioProvisioningDependency__c> deps = new List<i42as__ioProvisioningDependency__c>();
        if (erpItem != null) {
            deps.add(dep(tenant, erpItem));
        }
        deps.add(dep(tenant, conn));
        for (i42as__ioProvisioningOrderItem__c p : partnerItems) {
            deps.add(dep(conn, p));
            if (erpItem != null) {
                deps.add(dep(erpItem, p));
            }
        }
        insert deps;
    }

    static i42as__ioProvisioningOrderItem__c item(i42as__ioProvisioningOrder__c prov, String orderNumber, String orderType, String typ,
            String step, String partner, String documents, String status) {
        return new i42as__ioProvisioningOrderItem__c(
            i42as__ProvisioningOrder__c = prov.Id,
            i42as__OrderReference__c = orderNumber,
            i42as__OrderType__c = orderType,
            i42as__Step__c = (typ + ': ' + (partner == null ? step : partner)).left(40),
            i42as__Status__c = status,
            i42as__OrderInfo__c = step,
            OT_Item_Type__c = typ,
            OT_Partner__c = partner == null ? null : partner.left(120),
            OT_Documents__c = documents == null ? null : documents.left(255)
        );
    }

    static i42as__ioProvisioningDependency__c dep(i42as__ioProvisioningOrderItem__c parent, i42as__ioProvisioningOrderItem__c child) {
        return new i42as__ioProvisioningDependency__c(
            i42as__parent__c = parent.Id,
            i42as__dependant__c = child.Id
        );
    }

    // The offers carry entitlements__limio; collect them so the provisioning
    // record shows exactly what the customer is entitled to.
    static List<Object> entitlementsOf(Map<String, Object> order) {
        List<Object> out = new List<Object>();
        for (Object o : listOf(order, 'orderItems')) {
            Map<String, Object> item = (Map<String, Object>) o;
            Map<String, Object> offer = mapOf(item, 'offer');
            Map<String, Object> attrs = mapOf(mapOf(offer, 'data'), 'attributes');
            Map<String, Object> row = new Map<String, Object>{
                'item' => str(offer, 'path'),
                'quantity' => item.get('quantity')
            };
            if (attrs.containsKey('entitlements__limio')) {
                row.put('entitlements', attrs.get('entitlements__limio'));
            }
            out.add(row);
        }
        return out;
    }
}