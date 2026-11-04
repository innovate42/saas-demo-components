trigger OTOrderEventTrigger on i42as__OrderEvent__e (after insert) {
    // Limio agent data captures (Type DATA_CAPTURE) go to the agent handler;
    // everything else is an order.
    List<i42as__OrderEvent__e> orders = new List<i42as__OrderEvent__e>();
    List<i42as__OrderEvent__e> captures = new List<i42as__OrderEvent__e>();
    for (i42as__OrderEvent__e e : Trigger.new) {
        if (e.i42as__Type__c == 'DATA_CAPTURE') {
            captures.add(e);
        } else {
            orders.add(e);
        }
    }
    if (!orders.isEmpty()) {
        OTOrderEventHandler.handle(orders);
    }
    if (!captures.isEmpty()) {
        OTAgentCaptureHandler.handle(captures);
    }
}
