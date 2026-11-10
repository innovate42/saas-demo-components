trigger OTOrderEventTrigger on i42as__OrderEvent__e (after insert) {
    // Data captures (Type DATA_CAPTURE) are either a quote built by the buyer on
    // the store (OTQuoteRequestHandler) or something a Limio agent captured
    // (OTAgentCaptureHandler); everything else is an order.
    List<i42as__OrderEvent__e> orders = new List<i42as__OrderEvent__e>();
    List<i42as__OrderEvent__e> captures = new List<i42as__OrderEvent__e>();
    List<i42as__OrderEvent__e> quoteRequests = new List<i42as__OrderEvent__e>();
    for (i42as__OrderEvent__e e : Trigger.new) {
        if (e.i42as__Type__c == 'DATA_CAPTURE') {
            if (OTQuoteRequestHandler.isQuoteRequest(e)) {
                quoteRequests.add(e);
            } else {
                captures.add(e);
            }
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
    if (!quoteRequests.isEmpty()) {
        OTQuoteRequestHandler.handle(quoteRequests);
    }
}
