/**
 * Default Provisioning Owner for OpenText provisioning orders: the user whose
 * username is in the OT_Record_Owner_Username label (Amaury on saasdemo3).
 */
public without sharing class OTProvisioningOwner {

    public static Id defaultOwnerId() {
        String username = System.Label.OT_Record_Owner_Username;
        List<User> users = [SELECT Id FROM User WHERE Username = :username AND IsActive = true LIMIT 1];
        return users.isEmpty() ? null : users[0].Id;
    }

    public static void applyDefault(List<i42as__ioProvisioningOrder__c> orders) {
        Id owner = null;
        for (i42as__ioProvisioningOrder__c p : orders) {
            if (p.OT_Provisioning_Owner__c == null) {
                if (owner == null) {
                    owner = defaultOwnerId();
                }
                p.OT_Provisioning_Owner__c = owner;
            }
        }
    }
}
