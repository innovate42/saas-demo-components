// @flow
import * as React from "react"
import { useState, useRef, useContext, useCallback } from "react"
import { useTranslation } from "@limio/sdk"
import { CustomInput, FormGroup, FormFeedback, LoadingSpinner } from "@limio/design-system"
import { renderZPage } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/plugins/ZuoraHPMPlugin/helper.js"
import { ZuoraContext } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/plugins/ZuoraHPMPlugin/context.js"
import { useStore } from "@limio/shop"
import { sendOrder, authenticatedRequest } from "@limio/shop/src/shop/helpers/postRequests.js"
import { getCookie } from "@limio/shop/src/helpers/cookie.js"
import { parseRichText } from "@limio/shop/src/components/helpers.js"
import { sanitizeString } from "@limio/shop/src/shop/offers/helpers"
import { PaymentError } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/errors"
// import { useToaster } from "@limio/ui-toaster"
import { getRecaptchaToken } from "@limio/shop/src/shop/checkout/helpers"
import * as Sentry from "@sentry/browser"
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"


type Props = {
  subId: string,
  cusId: string,
  owner: string,
  address: Address,
  onFinished: boolean => void,
  userData: User,
  paymentType: string,
  closePaymentEditor: () => void,
  invalidMessages: InvalidMessages,
  subData: UserSubscription
}

export const ZuoraEditor = ({
  subId,
  cusId,
  owner,
  address: billingAddress = {},
  onFinished,
  userData,
  subData,
  invalidMessages,
  closePaymentEditor,
  showCheckbox,
  paymentType
}: Props): React.Node => {
  const ref = useRef()
  const [focus, setFocus] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [processPayment, setProcessPayment] = useState()
  const [minHeight, setMinHeight] = useState("400px")
  const [savePaymentDetails, setSavePaymentDetails] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const [paymentInformationText, setPaymentInformationText] = useState()
  const country = subData ? subData?.data?.purchaseCountry : getCookie("limio-country")
  const recaptchaId = getAppConfigValue(["analytics", "google_recaptcha_v3"])
  const store = useStore()
  // const { toaster, Toaster } = useToaster()


  const { sdk: zuora } = useContext(ZuoraContext)

  const { t } = useTranslation()

  const nodeRef = useCallback(
    node => {
      if (node !== null && zuora) {
        const renderPage = async () => {
          let zuoraAccountId = await authenticatedRequest(`/api/plugins/zuora/customer/${subId}`, {
            method: "GET"
          })

          const {
            processPayment,
            minHeight: height,
            pageParams
          } = await renderZPage(
            zuora,
            { store, zuoraAccountId, subscriptionId: subId },
            { paymentType, customerDetails: userData?.attributes, total: { currency: subData?.data?.price?.currency }, country }
          )
          setPaymentInformationText(pageParams?.paymentInformationText)
          setMinHeight(height)
          setProcessPayment({ process: processPayment })
        }

        renderPage().catch(err => Sentry.captureException(err))
      }
    },
    [country, paymentType, store, subData?.data?.price?.currency, userData?.attributes, zuora, subId]
  )

  const updatePayment = async ({ payment }) => {
    const unverifiedRecaptchaToken = await getRecaptchaToken(recaptchaId)

    //create an order to handle this
    const order = {
      order_type: "change_payment",
      customerId: cusId,
      subscriptionId: subId,
      owner: owner,
      external_id: subId,
      payment,
      userDetails: userData?.attributes,
      billingDetails: billingAddress
    }

    await sendOrder(order, { "x-limio-recaptcha": unverifiedRecaptchaToken })
  }

  const handleSavePayment = async () => {
    setIsLoading(true)

    try {
      if (processPayment?.process) {
        const { process } = processPayment
        const payment_method = await Promise.resolve(process({ billingDetails: billingAddress, customerDetails: userData?.attributes, savePaymentDetails }))
        await updatePayment(payment_method)
      }
      // toaster.success("Your payment details have been updated.")
      setIsLoading(false)
      onFinished(true)
    } catch (error) {
      setIsLoading(false)

      Sentry.captureException(error)
      let message = invalidMessages?.invalidPaymentMethodMessage || error.message || "Payment method could not be updated"

      if (error instanceof PaymentError) {
        message = `Payment method could not be updated: ${error.userErrorMessage}`
      }

      // toaster.error(message)
    }
  }

  const handleSubmit = async () => {
    // if there is a checkbox and that checkbox is not checked show validation
    if (!savePaymentDetails && showCheckbox) {
      setShowValidation(true)
    } else {
      await handleSavePayment()
    }
  }

  return (
    <>
      <div className={`payment-editor-container${focus ? " focus" : ""}`} onClick={() => setFocus(true)} ref={ref}>
        {/* <Toaster /> */}
        <div id="zuora_payment" ref={nodeRef} style={{ width: "100%", minHeight }} />
        {paymentInformationText && parseRichText(paymentInformationText).length > 0 && (
          <div className="additional-payment-information" dangerouslySetInnerHTML={{ __html: sanitizeString(paymentInformationText) }} />
        )}
        {showCheckbox && (
          <FormGroup className="SavePaymentDetails">
            <CustomInput
              type="checkbox"
              id="savePaymentDetails"
              name="savePaymentDetails"
              label={t("I agree to save my details for future payments")}
              onChange={() => setSavePaymentDetails(!savePaymentDetails)}
              error={showValidation && !savePaymentDetails ? "Please accept to continue" : null}
              required
              checked={savePaymentDetails}
            />
            <FormFeedback>{t("Please accept to continue")}</FormFeedback>
          </FormGroup>
        )}
      </div>
      <>
        {!isLoading && typeof processPayment?.process === "function" ? (
          <div className="flex flex-col sm:flex-row">
            <div className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4" onClick={() => closePaymentEditor()}>
              {t("Cancel")}
            </div>
            <div className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4" onClick={() => handleSubmit()}>
              {t("Save Details")}
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </>
    </>
  )
}
