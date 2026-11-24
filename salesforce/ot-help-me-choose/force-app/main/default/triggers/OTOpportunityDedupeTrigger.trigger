trigger OTOpportunityDedupeTrigger on Opportunity (after insert) {
    OTOpportunityDedupe.afterInsert(Trigger.new);
}