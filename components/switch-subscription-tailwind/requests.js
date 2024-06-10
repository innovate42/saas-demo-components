import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"

export async function handleSubmitSwitch(context, subscriptionId, order) {
    const { userAttributes } = context
  
    const switchOrder = {
      order_type: "change_offer",
      change_type: "change_offer",
      forSubscription: {
        id: subscriptionId
      },
      external_id: subscriptionId,
      userDetails: userAttributes,
      ...order
    }


  
    return sendOrder(switchOrder)
  }
  