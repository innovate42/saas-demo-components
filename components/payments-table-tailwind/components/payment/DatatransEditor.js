// @flow
import * as React from "react"
import { useState } from "react"
import { useTranslation } from "@limio/sdk"
import { Button, Alert } from "@limio/design-system"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { selectAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import { authenticatedRequest } from "@limio/shop/src/shop/helpers/postRequests.js"
import { sendRecaptchaAction } from "@limio/shop/src/shop/helpers/analytics"

type Props = {
  subId: string,
  cusId: string,
  owner: string,
  closePaymentEditor: Function,
  userData: {}
}

export function DatatransEditor({ subId, cusId, owner, userData, closePaymentEditor }: Props): React.Node {
  const { t } = useTranslation()
  const recaptchaId = selectAppConfigValue(modeConfig => modeConfig?.analytics?.google_recaptcha_v3)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(false)
  const paymentErrorMessage = "Your request could not be processed. Please try again later or contact support."

  let unverifiedRecaptchaToken

  if (recaptchaId) {
    sendRecaptchaAction(recaptchaId, "initiateCheckout").then(token => {
      unverifiedRecaptchaToken = token
    })
  }

  // We don't pass the payment object as it wil be created in the backend
  async function initialiseChangePaymentOrder() {
    const order = {
      order_type: "change_payment",
      forSubscription: {
        id: subId
      }
    }

    setIsLoading(true)

    const orderDetails = await sendOrder(order)

    return orderDetails
  }

  const handleConfirmChangePayment = async () => {
    const orderDetails = await initialiseChangePaymentOrder()

    const body = {
      orderEventId: orderDetails.id
    }

    try {
      const { redirectUrl } = await authenticatedRequest(`/api/integrations/datatrans/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-limio-recaptcha": unverifiedRecaptchaToken
        },
        body: JSON.stringify(body)
      })

      if (redirectUrl) {
        window.location.assign(redirectUrl)
      } else {
        setPaymentError(true)
      }
    } catch (err) {
      setIsLoading(false)
      setPaymentError(true)
    }
    setIsLoading(false)
  }

  return (
    <>
      {paymentError && (
        <Alert color="danger" variant={"error"} isOpen={paymentError} toggle={() => setPaymentError(false)} text={paymentErrorMessage}>
          {`${paymentErrorMessage}`}
        </Alert>
      )}
      {isLoading ? (
       
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
      ) : (
        !paymentError && (
          <div className="payment-information-change-group">
            <Button className="payment-information-change" color="primary" onClick={() => handleConfirmChangePayment()}>
              {t("Proceed to update payment")}
            </Button>
            <Button className="payment-information-change cancel-change" color="secondary" onClick={() => closePaymentEditor()}>
              {t("Cancel")}
            </Button>
          </div>
        )
      )}
    </>
  )
}
