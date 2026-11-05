trigger OTProvisioningOrderTrigger on i42as__ioProvisioningOrder__c (before insert) {
    // Every new provisioning order gets a Provisioning Owner (the OT record owner by default).
    OTProvisioningOwner.applyDefault(Trigger.new);
}
