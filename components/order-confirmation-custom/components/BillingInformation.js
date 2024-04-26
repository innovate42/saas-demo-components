// @flow
import * as React from "react"
import { useCheckout } from "@limio/internal-checkout-sdk"
import { useSubscriptions } from "@limio/sdk"

// import useLimioUserSubscriptionPaymentMethods from @limio/internal-checkout-sdk
function BillingInformation(): React.Node {
  const { useCheckoutSelector } = useCheckout()
  const { order = {}, paidSchedule = {}, schedule = {} } = useCheckoutSelector(state => state)
  const { subscriptions } = useSubscriptions()
  const { subscription } = subscriptions[0]
  const subId = subscription.id
  // const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subId)


  return (
    <section>
      <h3>Your Subscription</h3>
      <table>
        <thead>
        <tr>
          <th>Card Type</th>
          <th>Cardholder Name</th>
          <th>Card Number</th>
          <th>Phone Number</th>
          <th>Confirmation Email</th>
          <th>Billing Address</th>
        </tr>
        </thead>
        <tbody>
        <tr>

        </tr>
        </tbody>
      </table>
    </section>
  )
}

export default BillingInformation
