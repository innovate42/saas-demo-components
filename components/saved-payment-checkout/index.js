// @flow
import React from "react"
import { useUser, useSubscriptions } from "@limio/sdk"
import { useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk"
import { getCurrentPayment, processPaymentMethod, getPaymentLabel } from "../source/utils/paymentMethods"

type Props = {
  heading?: string,
  noPaymentMessage?: string,
  changePaymentLabel?: string,
  changePaymentLink?: string,
}

function SavedPaymentCheckout({
  heading = "Payment method",
  noPaymentMessage = "No saved payment method found.",
  changePaymentLabel = "Change",
  changePaymentLink = "",
}: Props) {
  const user = useUser()
  const { subscriptions = [] } = useSubscriptions()
  const isLoggedIn = user?.loginStatus === "logged-in"
  const subscription = subscriptions[0]
  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subscription?.id)

  if (!isLoggedIn || !payment_methods || !payment_methods.length) {
    const message = !isLoggedIn ? "Please log in to use a saved payment method." : !payment_methods ? "Loading..." : noPaymentMessage
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
    )
  }

  const paymentMethod = getCurrentPayment(payment_methods)
  const { paymentDescription, paymentIcon, secondaryPaymentIcon } = processPaymentMethod(paymentMethod)
  const paymentLabel = getPaymentLabel(paymentMethod)

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800">
      {heading && <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-4 pt-3">{heading}</p>}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3 flex-shrink-0">{secondaryPaymentIcon || paymentIcon}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{paymentLabel}</span>
            {paymentDescription && <span className="text-sm text-gray-500 dark:text-gray-400">{paymentDescription}</span>}
          </div>
        </div>
        {changePaymentLink && (
          <a href={changePaymentLink} className="text-sm text-blue-700 hover:text-blue-800 dark:text-blue-500 font-medium">
            {changePaymentLabel}
          </a>
        )}
      </div>
    </div>
  )
}

export default SavedPaymentCheckout
