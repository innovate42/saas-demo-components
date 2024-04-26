// @flow
import * as React from "react"
import "./index.css"
import { useUser } from "@limio/sdk"
import { Button } from "@limio/design-system"


type Props = {
  buttonLink: string,
}

function OrderConfirmation({ buttonLink }: Props): React.Node {
  const user = useUser()
  const { attributes, subscriptions } = user
  const emailAddress = attributes.email ?? ""
  const activeSubscription = subscriptions.find(
    (subscription) => subscription.status === "active"
  )

  const reference = activeSubscription?.reference ?? ""


  console.log(user)
  const handleClick = () => window.location.href = buttonLink

  return (
    <div className={"flex center bg-grey justify-center"}>
      {/*thanks section*/}
      <div className={"bg-white w-100 m-2-tlr flex col text-center"}>
        <section>
          <h1>Thank you for your order!</h1>
          <p>
            A confirmation email has been sent {emailAddress}.
          </p>
          <p>
            Order Reference #{reference}
          </p>
          <Button onClick={handleClick}>
            Go to JazzHR
          </Button>
        </section>
        {/* subscription summary section     */}
        <section>
          <h3>Your Subscription</h3>
          <table>
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
              {/*<td>{activeSubscription?.plan.name}</td>*/}
              {/*<td>{activeSubscription?.plan.billingPlan}</td>*/}
              {/*<td>{activeSubscription?.plan.billingFrequency}</td>*/}
              {/*<td>{activeSubscription?.plan.addOns}</td>*/}
              {/*<td>{activeSubscription?.plan.price}</td>*/}
              {/*<td>{activeSubscription?.plan.paymentDate}</td>*/}
              {/*<td>{activeSubscription?.plan.confirmationEmail}</td>*/}
            </tr>
            </tbody>
          </table>
        </section>
        <section></section>
        {/* Billing Information Section */}
        <section></section>
      </div>
    </div>
  )
}

export default OrderConfirmation
