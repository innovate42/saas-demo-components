/**
 * Limio for Salesforce's own order sync and OTOrderEventHandler both react to the
 * same order, usually in the same second, so each creates an opportunity before
 * the other has committed. Keep the sync's one (it carries the products and the
 * quote): copy the OpenText fields onto it, move the provisioning order and
 * activities, delete ours.
 *
 * The two are paired on the order: the sync stores the last 8 characters of the
 * Limio order reference in OrderNumber__c (new orders and plan changes alike),
 * ours stores the full reference in OT_Limio_Order__c.
 *
 * Both sides queue this job (the sync's opportunity from the trigger, ours from
 * OTOrderEventHandler) and the job runs after that side has committed, so
 * whichever lands last finds the pair.
 */
public without sharing class OTOpportunityDedupe implements Queueable {

    static final List<String> OT_FIELDS = new List<String>{
        'OT_Product__c', 'OT_Region__c', 'OT_Data_Centre__c', 'OT_ERP__c', 'OT_Trading_Partners__c', 'OT_Partner_Count__c',
        'OT_Order_Currency__c', 'OT_Limio_Order__c', 'OT_Limio_Subscription__c', 'OT_Sales_Channel__c', 'OT_Onboarding__c', 'Description'
    };

    static final String STORE_ACCOUNT = 'Created by the OpenText Business Network store (Limio).';

    final Set<String> keys;

    public OTOpportunityDedupe(Set<String> keys) {
        this.keys = keys;
    }

    // The sync's key for a Limio order reference
    public static String keyOf(String orderReference) {
        return String.isBlank(orderReference) ? null : orderReference.right(8);
    }

    // Opportunity trigger: a sync opportunity landed. Queue the job without
    // checking for ours first: ours may still be uncommitted.
    public static void afterInsert(List<Opportunity> inserted) {
        Set<String> found = new Set<String>();
        for (Opportunity o : inserted) {
            String k = (String) o.get('OrderNumber__c');
            if (String.isNotBlank(k)) {
                found.add(k);
            }
        }
        enqueue(found);
    }

    // OTOrderEventHandler: we had to create our own opportunity for these orders
    public static void afterOurs(Set<String> orderReferences) {
        Set<String> found = new Set<String>();
        for (String ref : orderReferences) {
            if (keyOf(ref) != null) {
                found.add(keyOf(ref));
            }
        }
        enqueue(found);
    }

    static void enqueue(Set<String> found) {
        if (found.isEmpty()) {
            return;
        }
        if (Limits.getQueueableJobs() < Limits.getLimitQueueableJobs()) {
            System.enqueueJob(new OTOpportunityDedupe(found));
        }
    }

    public void execute(QueueableContext ctx) {
        run(keys);
    }

    @TestVisible
    static void run(Set<String> keys) {
        if (keys == null || keys.isEmpty()) {
            return;
        }
        Map<String, Opportunity> synced = new Map<String, Opportunity>();
        for (Opportunity o : Database.query('SELECT Id, Name, AccountId, OrderNumber__c, ' + String.join(OT_FIELDS, ', ')
                + ' FROM Opportunity WHERE OrderNumber__c IN :keys ORDER BY CreatedDate ASC')) {
            String k = (String) o.get('OrderNumber__c');
            if (!synced.containsKey(k)) {
                synced.put(k, o);
            }
        }
        if (synced.isEmpty()) {
            return;
        }
        List<String> likes = new List<String>();
        for (String k : synced.keySet()) {
            likes.add('OT_Limio_Order__c LIKE \'%' + String.escapeSingleQuotes(k) + '\'');
        }
        List<Opportunity> ours = Database.query('SELECT Id, Name, AccountId, ' + String.join(OT_FIELDS, ', ')
            + ' FROM Opportunity WHERE OrderNumber__c = null AND (' + String.join(likes, ' OR ') + ')');
        if (ours.isEmpty()) {
            return;
        }

        Map<Id, Opportunity> toUpdate = new Map<Id, Opportunity>();
        Map<Id, Id> ourToSynced = new Map<Id, Id>();
        Map<Id, Id> ourAccountToSynced = new Map<Id, Id>();
        for (Opportunity mine : ours) {
            String ref = mine.OT_Limio_Order__c;
            Opportunity keep = synced.get(keyOf(ref));
            if (keep == null || keep.Id == mine.Id) {
                continue;
            }
            // A new order's sync opportunity is named after the order reference:
            // give it our readable name. A plan change keeps the sync's name.
            if (keep.Name == ref || keep.Name == keyOf(ref)) {
                keep.Name = mine.Name;
            }
            for (String f : OT_FIELDS) {
                // the sync's own description (what was bought) wins over ours
                if (f == 'Description' && String.isNotBlank(keep.Description)) {
                    continue;
                }
                if (mine.get(f) != null) {
                    keep.put(f, mine.get(f));
                }
            }
            toUpdate.put(keep.Id, keep);
            ourToSynced.put(mine.Id, keep.Id);
            if (mine.AccountId != null && keep.AccountId != null && mine.AccountId != keep.AccountId) {
                ourAccountToSynced.put(mine.AccountId, keep.AccountId);
            }
        }
        if (ourToSynced.isEmpty()) {
            return;
        }
        update toUpdate.values();

        List<i42as__ioProvisioningOrder__c> provs = [SELECT Id, OT_Opportunity__c FROM i42as__ioProvisioningOrder__c WHERE OT_Opportunity__c IN :ourToSynced.keySet()];
        for (i42as__ioProvisioningOrder__c p : provs) {
            p.OT_Opportunity__c = ourToSynced.get(p.OT_Opportunity__c);
            Id acct = toUpdate.get(p.OT_Opportunity__c).AccountId;
            if (acct != null) {
                p.OT_Account__c = acct;
            }
        }
        update provs;
        List<Task> tasks = [SELECT Id, WhatId FROM Task WHERE WhatId IN :ourToSynced.keySet()];
        for (Task t : tasks) {
            t.WhatId = ourToSynced.get(t.WhatId);
        }
        update tasks;
        delete [SELECT Id FROM Opportunity WHERE Id IN :ourToSynced.keySet()];

        // Fold the account the store created into the one the sync created
        // (only accounts we created; anything else is left alone).
        for (Account dup : [SELECT Id, Description FROM Account WHERE Id IN :ourAccountToSynced.keySet()]) {
            if (dup.Description != STORE_ACCOUNT) {
                continue;
            }
            Id masterId = ourAccountToSynced.get(dup.Id);
            List<i42as__ioProvisioningOrder__c> moved = [SELECT Id FROM i42as__ioProvisioningOrder__c WHERE OT_Account__c = :dup.Id];
            for (i42as__ioProvisioningOrder__c p : moved) {
                p.OT_Account__c = masterId;
            }
            update moved;
            try {
                Database.merge(new Account(Id = masterId), dup.Id);
            } catch (Exception e) {
                System.debug(LoggingLevel.WARN, 'OT account merge skipped: ' + e.getMessage());
            }
        }
    }
}
