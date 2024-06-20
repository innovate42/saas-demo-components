// @flow
import React, { useRef } from "react"
import { useScript } from "@limio/shop/src/shop"
import { sendRecaptchaAction } from "@limio/shop/src/shop/helpers/analytics"
import * as Sentry from "@sentry/browser"
import { authenticatedRequest, sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { getCookie } from "@limio/sdk"
import { mapAddress, getGooglePayAppConfig } from "@limio/payment-sdk/src/GooglePay/helpers"

type Props = {
  subData: ?LimioObject<Subscription>,
  cusId: string,
  subId: string,
  owner: string,
  userData: ?{ attributes: { [string]: string } },
  onFinished: (success: boolean) => void
}

export function GooglePayEditor({ subData, cusId, subId, owner, userData, onFinished }: Props) {
  const client = useRef(null)
  const payButton = useRef(null)
  const initialized = useRef(false)

  const { gateway, gatewayMerchantId, allowedCardNetworks, mode, allowedCardAuthMethods, merchantName, merchantId, recaptchaId } = getGooglePayAppConfig()
  const country = subData?.data?.purchaseCountry || getCookie("limio-country")
  const currency = subData.data.price.currency

  const status = useScript("https://pay.google.com/gp/p/js/pay.js")

  const initialiseGooglePay = async () => {
    try {
      const googleClient = new window.google.payments.api.PaymentsClient({
        environment: mode,
        paymentDataCallbacks: {
          onPaymentAuthorized: async paymentData => {
            const unverifiedRecaptchaToken = recaptchaId && (await sendRecaptchaAction(recaptchaId, "initiateCheckout"))
            const paymentToken = paymentData.paymentMethodData.tokenizationData.token

            const paymentDetails = await authenticatedRequest(`/api/plugins/zuora/google`, {
              method: "POST",
              headers: {
                "x-limio-recaptcha": unverifiedRecaptchaToken,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ token: paymentToken, country, currency })
            })

            if (paymentDetails.error) {
              Sentry.captureMessage(paymentDetails.error)
            }

            const { payment_method, paymentGateway } = paymentDetails
            const address = mapAddress(paymentData.paymentMethodData.info.billingAddress)

            const newPaymentMethod = {
              type: "google__pay",
              zuora: {
                refId: payment_method.id,
                paymentGateway
              },
              billingDetails: address
            }

            try {
              const order = {
                order_type: "change_payment",
                customerId: cusId,
                subscriptionId: subId,
                owner,
                userDetails: userData?.attributes,
                external_id: subId,
                payment: newPaymentMethod,
                billingDetails: address
              }
              await sendOrder(order)
              onFinished(true)
            } catch (e) {
              Sentry.captureException(e)
            }
          }
        }
      })

      client.current = googleClient
      initialized.current = true
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const createButton = container => {
    const baseRequest = { apiVersion: 2, apiVersionMinor: 0 }
    const tokenizationSpecification = {
      type: "PAYMENT_GATEWAY",
      parameters: { gateway: gateway, gatewayMerchantId: gatewayMerchantId }
    }
    const baseCardPaymentMethod = {
      type: "CARD",
      parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks,
        billingAddressRequired: true,
        billingAddressParameters: { format: "FULL" }
      }
    }
    const cardPaymentMethod = { ...baseCardPaymentMethod, tokenizationSpecification }
    const isReadyToPayRequest = { ...baseRequest, allowedPaymentMethods: [baseCardPaymentMethod] }
    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods: [cardPaymentMethod],
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: "0",
        currencyCode: currency,
        countryCode: country || "GB"
      },
      merchantInfo: { merchantName: merchantName, merchantId: merchantId },
      callbackIntents: ["PAYMENT_AUTHORIZATION"]
    }

    const googleClient = client.current

    googleClient.isReadyToPay(isReadyToPayRequest).then(response => {
      if (response.result) {
        const button = googleClient.createButton({
          onClick: () => googleClient.loadPaymentData(paymentDataRequest),
          allowedPaymentMethods: [baseCardPaymentMethod],
          buttonColor: "black",
          buttonType: "plain",
          buttonRadius: "4px"
        })
        container.appendChild(button)
        payButton.current = button
      }
    })
  }

  if (status === "ready" && !client.current && !initialized.current) {
    initialiseGooglePay().then(() => createButton(document.getElementById("google-pay-button-container")))
  }

  return <div id="google-pay-button-container"></div>
}
