// @flow
import * as React from "react"
import { useCheckout } from "@limio/internal-checkout-sdk"
import { displayDate, formatCurrency, stripPathToProductName } from "./helpers"
import { getOrderItems } from "./helpers"

function SubscriptionSection(): React.Node {
  const { useCheckoutSelector } = useCheckout()
  const { order = {}, paidSchedule = {}, schedule = {} } = useCheckoutSelector(state => state)

  const orderItems = getOrderItems(order)

  console.log("order", order, "paidSchedule", paidSchedule, "schedule", schedule, "orderItems", orderItems)

  const product = stripPathToProductName(orderItems[0].offer.data.products[0].path)
  const billingPlan = orderItems[0].offer.data.productBundles[0].rate_plan
  const frequency = orderItems[0].offer.data.attributes.billing_plan[0]
  const addOns = orderItems[0].addOns

  const addOnList = addOns?.length
    ? addOns.map((addOn, index) => {
        const addOnName = addOn.addOn.name
        return (
          <li key={index} className={"li-no"}>
            {addOnName}
          </li>
        )
      })
    : "N/A"

  const price = formatCurrency(paidSchedule.amountWithoutTax, paidSchedule.currency)
  const paymentDate = displayDate(paidSchedule.schedule_date)
  const confirmationEmail = order.customerDetails.email

  return (
    <section>
      <h3>Your Subscription</h3>
      <table className={"styled-table"}>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Billing Plan</th>
            <th>Billing Frequency</th>
            <th>Add-Ons</th>
            <th>Price</th>
            <th>Payment Date</th>
            <th>Confirmation Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product}</td>
            <td>{billingPlan}</td>
            <td>{frequency}</td>
            <td>{addOnList}</td>
            <td>{price}</td>
            <td>{paymentDate}</td>
            <td>{confirmationEmail}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default SubscriptionSection
