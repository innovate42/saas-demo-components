// @flow
import React, { useState, useEffect, useCallback, Suspense } from "react"
import { sendOrder, authenticatedRequest } from "@limio/shop/src/shop/helpers/postRequests.js"
import { Error } from "../../helpers/Error"
import { filterEmptyNull } from "@limio/helpers/array"
import { getCookie } from "@limio/shop/src/helpers/cookie.js"
import { Alert } from "@limio/design-system"
import useSWR from "@limio/swr"
import { sendRecaptchaAction } from "@limio/shop/src/shop/helpers/analytics"
import { ErrorBoundary } from "@limio/sdk"
import { selectAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import * as Sentry from "@sentry/browser"

const countryData = require("@limio/resources/src/resources/country-data.json")
const paypalClient = require("braintree-web/client")
const paypalCheckout = require("braintree-web/paypal-checkout")

const defaultStyle = {
  fundingicons: "false",
  color: "gold",
  shape: "rect",
  tagline: "false",
  funding: "disallowed",
  layout: "horizontal",
  size: "responsive",
  height: 38
}

type Props = {
  onPaymentChange: func
}

export const LoadPayPalEditor = ({ subId, cusId, address, owner, onFinished, userData, billingAgreement, subData }: Props) => {
  const rendered = document && document.getElementById("paypal-button")

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [button, setButton] = useState()
  const [status, setStatus] = useState()
  const [regionalError, setRegionalError] = useState(false)

  const country = subData ? subData?.data?.purchaseCountry : getCookie("limio-country")
  const allowedCountries = subData?.data?.offer?.data?.attributes?.allowed_countries__limio
  const recaptchaId = selectAppConfigValue(modeConfig => modeConfig?.analytics?.google_recaptcha_v3)
  const ppMode = selectAppConfigValue(modeConfig => modeConfig?.payments?.plugins?.paypal?.mode)
  const paypalMode = ppMode || "sandbox"

  const { data: paypalToken } = useSWR(
    `/api/plugins/paypal`,
    url =>
      authenticatedRequest(url, {
        method: "POST",
        body: JSON.stringify({ country })
      }),
    {
      suspense: true,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  // handle the create order path = we want this to change as little as possible as the button needs to re-render on change
  useEffect(() => {
    if (window) {
      const renderPaypalButton = async () => {
        const paypal = require("paypal-checkout")

        const payment = (data, actions) => {
          return actions.braintree.create({
            flow: "vault", // Required
            billingAgreementDescription: billingAgreement, //Assume one for now
            enableShippingAddress: false,
            shippingAddressEditable: true
          })
        }

        const buttonProps = {
          braintree: {
            client: paypalClient,
            paypalCheckout: paypalCheckout
          },
          client: {
            [paypalMode]: paypalToken
          },
          env: paypalMode,
          payment,
          commit: true,
          locale: "en_US", //localeData[country] || "en_US", Certain locales are causing issues (fr_XC) so let's just worry about english for now
          onAuthorize: async payload => handleSavePayment(payload),
          // eslint-disable-next-line no-console
          onCancel: data => console.log("checkout.js payment cancelled"),
          onError: err => setError(context => ({ ...context, error: "An error occurred (1)." })),
          style: defaultStyle
        }

        setButton({ render: () => paypal.Button.render(buttonProps, "#paypal-button") })
      }

      renderPaypalButton().catch(err => Sentry.captureException(err))
    }
  }, [paypalMode, billingAgreement, country, handleSavePayment, paypalToken])

  useEffect(() => {
    // make sure page is rendered
    if (rendered && button && !status) {
      setStatus("loading")
      // button is a function, so use the functional update to set it
      button.render()
      setStatus("loaded")
    }
  }, [button, rendered, status])

  const handleSavePayment = useCallback(
    async payload => {
      const mapAddress = (paypalAddress, full_name) => {
        // if the address is undefined, then also return empty object as we want to leave the current details (if they exist)
        const limioCountry = countryData.find(row => row["alpha-2"] === country)
        const billingCountry = address.country

        if (!paypalAddress) {
          //if the country is USA we'll need a state, if the state doesn't exist we'll have to defer to NY for now (Zuora)
          return {
            state: ["USA"].includes(limioCountry?.["alpha-3"]) ? "NY" : ["CAN"].includes(limioCountry?.["alpha-3"]) ? "ON" : undefined,
            country: billingCountry || limioCountry?.["alpha-3"] || "GBR"
          }
        }

        return {
          fullName: full_name,
          address1: paypalAddress.line1,
          address2: paypalAddress.line2,
          city: paypalAddress.city,
          state: paypalAddress.state,
          postalCode: paypalAddress.postalCode,
          country: paypalAddress.countryCode || billingCountry || "GBR"
        }
      }

      const updatePayment = async (payment_method, new_address) => {
        //create an order to handle this

        if (new_address?.country && !allowedCountries.includes(new_address?.country)) {
          setRegionalError(true)
        } else {
          try {
            const order = {
              order_type: "change_payment",
              customerId: cusId,
              subscriptionId: subId,
              owner: owner,
              userDetails: userData?.attributes,
              external_id: subId,
              payment: payment_method,
              billingDetails: new_address
            }
            await sendOrder(order)
            onFinished(true)
          } catch {
            setError({ err: true, text: "Payment method could not be updated" })
          }
        }
      }

      setIsLoading(true)
      const { nonce } = payload

      const unverifiedRecaptchaToken = recaptchaId && (await sendRecaptchaAction(recaptchaId, "initiateCheckout"))

      const paymentDetails = await authenticatedRequest(`/api/plugins/zuora/paypal`, {
        method: "POST",
        headers: {
          "x-limio-recaptcha": unverifiedRecaptchaToken
        },
        body: JSON.stringify({ nonce, country })
      })

      const fullName = userData.name || filterEmptyNull([userData?.attributes?.given_name, userData?.attributes?.family_name]).join(" ")

      const { payment_method: paypal_data, customer_info, paymentGateway } = paymentDetails
      const { billingAddress } = customer_info

      const payment_method = {
        type: "zuora",
        zuora: {
          refId: paypal_data.id,
          paymentGateway
        },
        billingDetails: mapAddress(billingAddress, fullName)
      }

      await updatePayment(payment_method, mapAddress(billingAddress, fullName))
      setIsLoading(false)
    },
    [recaptchaId, userData, address.country, country, allowedCountries, cusId, subId, owner, onFinished]
  )

  if (error?.err) {
    return <Error text={error.text} />
  }

  return (
    <div className="paypal-payment-editor-container">
      {regionalError && (
        <ErrorBoundary fallback={<div />}>
          <Alert
            text="Payment method does not match your region. "
            description="Please select a payment option that matches your current region."
            variant="error"
            isOpen={true}
          />
        </ErrorBoundary>
      )}
      <div id="paypal-button" />
      {error && (
        <div className="paypal-error" style={{ color: "#f44336" }}>
          {error}
        </div>
      )}
    </div>
  )
}

export const PayPalEditor = props => (
  <Suspense fallback={<div />}>
    <LoadPayPalEditor {...props} />
  </Suspense>
)

export default PayPalEditor
