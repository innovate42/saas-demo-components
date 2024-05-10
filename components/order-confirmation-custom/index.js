// @flow
import * as React from "react"
import "./index.css"
import { useCheckout } from "@limio/internal-checkout-sdk"
import { Button } from "@limio/design-system"
import SubscriptionSection from "./components/SubscriptionSection"
// import BillingInformation from "./components/BillingInformation"

type Props = {
  buttonLink: string
}

function OrderConfirmationCustom({ buttonLink }: Props): React.Node {
  const { useCheckoutSelector } = useCheckout()
  const { order = {} } = useCheckoutSelector(state => state)

  const { customerDetails, order_reference } = order
  const handleClick = () => (window.location.href = buttonLink)

  return (
    <div className={"h-100 bg-grey"}>
      <div className={"flex center justify-center"}>
        {/*thanks section*/}
        <div className={"bg-white w-100 m-lrb-2 flex col text-center"}>
          <section className={"mb-6 mt-4"}>
            <h1>Thank you for subscribing!</h1>
            <p>A confirmation email has been sent {customerDetails.email}.</p>
            <p>Order Reference #{order_reference}</p>
            <Button onClick={handleClick} className={"button"}>
              Go to my account
            </Button>
          </section>
          {/* subscription summary section     */}
          <SubscriptionSection />
          {/* Billing Information Section */}
          {/*<BillingInformation /> */}
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationCustom
