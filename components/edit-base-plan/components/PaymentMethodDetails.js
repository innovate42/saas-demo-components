// @flow

import React from "react"
import { useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk"
import { useSubscriptions } from "@limio/sdk"
import * as R from "ramda"

function PaymentMethodDetails() {
  const { subscriptions = [] } = useSubscriptions()

  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subscription.id)

  const showPaymentDetails = payment_methods => {
    const activePaymentMethods = payment_methods.filter(paymentMethod => paymentMethod.status === "active")

    if (activePaymentMethods.length === 0) {
      return
    }
    const [activePaymentMethod] = activePaymentMethods.sort((a, b) => new Date(b.start) - new Date(a.start))

    const paymentMethodType = activePaymentMethod.type
    const paymentMethodData = R.path(["data", paymentMethodType, "result"], activePaymentMethod)
    const { CreditCardMaskNumber: creditCardMask, CreditCardType = "" } = paymentMethodData
    return `Charge to your ${CreditCardType} (${creditCardMask})`
  }

  return <p>{payment_methods && payment_methods.length ? showPaymentDetails(payment_methods) : null}</p>
}

export default PaymentMethodDetails
