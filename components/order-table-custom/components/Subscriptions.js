import * as React from "react"
import { SubscriptionItem } from "./SubscriptionItem.js"
import { useSubscriptions } from "@limio/sdk"

type Props = {
  updateNotification: Function,
  propsObject: {
    cancelLink: string,
    cancelHeading: string,
    switchHeading: string,
    changePaymentHeading: string,
    switchLink: string,
    changePaymentLink: string,
    editAddOnsLink: string,
    editBasePlanLink: string,
    basePlanSwitchHeading: string
  }
}

export function Subscriptions({ updateNotification, propsObject }) {
  const {
    basePlanSwitchHeading,
    cancelLink,
    cancelHeading,
    switchHeading,
    changePaymentHeading,
    switchLink,
    changePaymentLink,
    editAddOnsLink,
    editBasePlanLink
  } = propsObject

  const { subscriptions } = useSubscriptions()

  // generate uuid using math random
  const uuid = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

  return (
    <div>
      {subscriptions
        .sort(({ created: a }, { created: b }) => new Date(b) - new Date(a))
        .map(({ subscription }) => (
          <SubscriptionItem
            key={uuid()}
            links={{ cancel: cancelLink, switch: switchLink, changePayment: changePaymentLink, editAddOns: editAddOnsLink, editBasePlan: editBasePlanLink }}
            headings={{
              cancel: cancelHeading,
              switch: switchHeading,
              changePayment: changePaymentHeading,
              basePlan: basePlanSwitchHeading
            }}
            updateNotification={updateNotification}
            propsObject={propsObject}
          />
        ))}
    </div>
  )
}
