// @flow
import React, { useState, useRef, useContext, useCallback } from "react"
import { useTranslation } from "@limio/sdk"
import { Row, Col } from "@limio/design-system"
import { LoadingIcon } from "../../helpers/LoadingIcon.js"
import { renderXPayPage } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/plugins/NexiPlugin/helper.js"
import { NexiContext } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/plugins/NexiPlugin/context.js"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { PaymentError } from "@limio/old-shop-components/src/shop/checkout/PaymentManager/errors"
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import * as Sentry from "@sentry/browser"

type Props = {
  subId: string,
  cusId: string,
  owner: string,
  address: {},
  onFinished: Function,
  userData: {}
}

export const NexiEditor = ({ subId, cusId, owner, onFinished, userData, subData, invalidMessages, closePaymentEditor }: Props) => {
  const ref = useRef()
  const [focus, setFocus] = useState(false)
  const [paymentError, setPaymentError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [processPayment, setProcessPayment] = useState()
  const [minHeight, setMinHeight] = useState("28px")
  const [iframeReady, setIframeReady] = useState(false)

  const nexiConfig = getAppConfigValue(["payments", "plugins", "nexi"])

  const { env, key } = nexiConfig || {}
  const { sdk: nexi } = useContext(NexiContext)

  const { t } = useTranslation()

  const nodeRef = useCallback(
    node => {
      if (node !== null) {
        const renderPage = async () => {
          const { processPayment, minHeight: height } = await renderXPayPage(nexi, { env, key }, { requestType: "PP" })

          setMinHeight(height)
          setProcessPayment({ process: processPayment })
          setIframeReady(true)
        }

        if (nexi) {
          renderPage().catch(err => Sentry.captureException(err))
        }
      }
    },
    [env, key, nexi]
  )

  const updatePayment = ({ payment }) => {
    //create an order to handle this
    const order = {
      order_type: "change_external_payment",
      customerId: cusId,
      subscriptionId: subId,
      owner: owner,
      external_id: subId,
      payment,
      userDetails: userData?.attributes
    }
    return sendOrder(order)
  }

  const handleSavePayment = async () => {
    setIsLoading(true)

    try {
      if (processPayment?.process) {
        const { process } = processPayment
        const payment_method = await Promise.resolve(process({ customerDetails: userData?.attributes }))
        const response = await updatePayment(payment_method)

        if (response?.error) {
          setIsLoading(false)
          setPaymentError({
            error: true,
            message: t("Payment method could not be updated")
          })
          return
        }
      }
      setIsLoading(false)
      onFinished(true)
    } catch (error) {
      setIsLoading(false)

      let message = invalidMessages?.invalidPaymentMethodMessage || "Payment method could not be updated"

      if (error instanceof PaymentError) {
        message = `Payment method could not be updated: ${error.userErrorMessage}`
      }

      setPaymentError({
        error: true,
        message
      })
    }
  }

  const handleSubmit = () => {
    handleSavePayment()
  }

  // useOutsideClick(ref, () => {
  //   setFocus(false)
  // })

  return (
    <>
      <div className={`payment-editor-container${focus ? " focus" : ""}`} onClick={() => setFocus(true)} ref={ref}>
        {/* <div style={{ display: selectedPaymentType == "creditcard" ? "block" : "none" }}> */}
        <div>
          <div id="card-details" ref={nodeRef} style={{ width: "100%", minHeight, overflow: "hidden" }}>
            <Row>
              <Col md={5} xs={12}>
                <div id="xpay-pan" className="form-control"></div>
              </Col>
              <Col md={3} xs={6}>
                <div id="xpay-expiry" className="form-control"></div>
              </Col>
              <Col md={3} xs={6}>
                <div id="xpay-cvv" className="form-control"></div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <div id="xpay-card-errors"></div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {paymentError && <div className="nexi-payment-error">{paymentError.message}</div>}
      <>
        {!isLoading && typeof processPayment?.process === "function" ? (
          <div className="payment-information-change-group">
            <div className="payment-information-change cancel-change" onClick={() => closePaymentEditor()}>
              {t("Cancel")}
            </div>
            <div className="payment-information-change" onClick={() => handleSubmit()}>
              {t("Save Details")}
            </div>
          </div>
        ) : (
          <LoadingIcon align={"left"} />
        )}
      </>
    </>
  )
}
