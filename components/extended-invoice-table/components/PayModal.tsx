import React, { useState, useMemo } from "react"
import {
  Card,
  Text,
  Button,
  Icon,
  Input,
  Skeleton,
  Badge
} from "@limio/component-library"
import { faTimes, faCheck, faXmark } from "@fortawesome/pro-light-svg-icons"
import {
  useLimioUserCustomer,
  useLimioUserPaymentMethods
} from "@limio/internal-checkout-sdk"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests"
import PaymentDetails from "./PaymentDetails"
import type { Invoice, PaymentResult } from "../types"
import { useTranslation, currencyList } from "@limio/sdk"
import { useComponentStaticProps } from "../componentStaticProps"
import { formatCurrency } from "@limio/sdk/price"
import { parseString } from "@limio/shop/src/helpers/string"
import { payInvoicesSequentially } from "../helpers/payInvoices"

type PaymentNotification = {
  message: string
  isPartial: boolean
}

type PayModalProps = {
  setShowPayModal: (open: boolean) => void
  currency: string
  selectedInvoice: Invoice | null
  selectedInvoices?: Invoice[]
  onPaymentComplete?: (notification: PaymentNotification) => void
}

function PayModal({
  setShowPayModal,
  selectedInvoice,
  selectedInvoices = [],
  currency,
  onPaymentComplete
}: PayModalProps): React.JSX.Element {
  const {
    confirmPayHeading,
    confirmPayText,
    changePayURL,
    noDefaultHeading,
    noDefaultText,
    confirmSuccessHeading,
    confirmSuccessText,
    confirmErrorHeading,
    confirmErrorText,
    allowPartialPayment,
    minimumPaymentAmount,
    partialPaymentText,
    totalAmountToPayLabel,
    multiPayProgressText,
    multiPaySuccessHeading,
    multiPaySuccessText,
    multiPayPartialHeading,
    multiPayPartialText,
    multiPayErrorHeading,
    multiPayErrorText,
    retryFailedText
  } = useComponentStaticProps()
  const { t } = useTranslation()
  const { customer } = useLimioUserCustomer()
  const defaultPaymentMethodID = customer?.data?.defaultPaymentMethodId

  const isMultiPay = selectedInvoices.length > 1
  const invoicesToPay = isMultiPay
    ? selectedInvoices
    : selectedInvoice
      ? [selectedInvoice]
      : []

  const [isLoading, setIsLoading] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(
    selectedInvoice?.balance ?? 0
  )
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Multi-pay state
  const [progressCurrent, setProgressCurrent] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)
  const [paymentResults, setPaymentResults] = useState<PaymentResult[]>([])

  const { paymentMethods } = useLimioUserPaymentMethods(customer.id, {
    filterType: ["invoice"]
  })
  const defaultPaymentMethod = paymentMethods?.find(
    (pm) => pm?.id === defaultPaymentMethodID
  )

  const showPaymentDetails = !!defaultPaymentMethodID && !!defaultPaymentMethod
  const currencySymbol = currencyList[currency]?.symbol || currency

  const effectiveMinAmount = Math.min(minimumPaymentAmount > 0 ? minimumPaymentAmount : 0.01, selectedInvoice?.balance ?? 0)

  const totalBalance = invoicesToPay.reduce(
    (sum, inv) => sum + inv.balance,
    0
  )

  const succeededResults = paymentResults.filter((r) => r.success)
  const failedResults = paymentResults.filter((r) => !r.success)

  const modalText = useMemo(() => {
    // Multi-pay results
    if (isMultiPay && paymentResults.length > 0) {
      if (failedResults.length === 0) {
        return {
          header: multiPaySuccessHeading,
          message: multiPaySuccessText
        }
      }
      if (succeededResults.length === 0) {
        return {
          header: multiPayErrorHeading,
          message: multiPayErrorText
        }
      }
      return {
        header: multiPayPartialHeading,
        message: parseString(multiPayPartialText, {
          succeeded: String(succeededResults.length),
          failed: String(failedResults.length)
        })
      }
    }

    // Multi-pay in progress
    if (isMultiPay && isLoading) {
      return {
        header: confirmPayHeading,
        message: parseString(multiPayProgressText, {
          current: String(progressCurrent),
          total: String(progressTotal)
        })
      }
    }

    // Single pay states
    if (hasError) {
      return { header: confirmErrorHeading, message: confirmErrorText }
    }
    if (paymentCompleted) {
      return { header: confirmSuccessHeading, message: confirmSuccessText }
    }
    if (showPaymentDetails) {
      return {
        header: confirmPayHeading,
        message: isMultiPay
          ? t("These invoices will be paid with your default payment method:")
          : confirmPayText,
        showPaymentDetails: true
      }
    }
    return { header: noDefaultHeading, message: noDefaultText }
  }, [
    hasError,
    paymentCompleted,
    showPaymentDetails,
    isLoading,
    paymentResults,
    isMultiPay,
    progressCurrent,
    progressTotal,
    confirmErrorHeading,
    confirmErrorText,
    confirmSuccessHeading,
    confirmSuccessText,
    confirmPayHeading,
    confirmPayText,
    noDefaultHeading,
    noDefaultText,
    multiPayProgressText,
    multiPaySuccessHeading,
    multiPaySuccessText,
    multiPayPartialHeading,
    multiPayPartialText,
    multiPayErrorHeading,
    multiPayErrorText,
    failedResults.length,
    succeededResults.length,
    t
  ])

  const handlePaySingleInvoice = async () => {
    setIsLoading(true)
    try {
      const order = {
        order_type: "pay_invoice",
        invoice: selectedInvoice,
        payment: {
          amount: paymentAmount
        }
      }

      const result = await sendOrder(order)

      if (result.error) {
        setHasError(true)
        return
      }

      setPaymentCompleted(true)
    } catch (error) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayMultipleInvoices = async () => {
    setIsLoading(true)
    setProgressTotal(invoicesToPay.length)

    const results = await payInvoicesSequentially(
      invoicesToPay,
      (current, total) => {
        setProgressCurrent(current)
        setProgressTotal(total)
      }
    )

    setPaymentResults(results)
    setIsLoading(false)

    const allSucceeded = results.every((r) => r.success)
    if (allSucceeded) {
      setPaymentCompleted(true)
    } else {
      setHasError(true)
    }
  }

  const handlePay = () => {
    if (isMultiPay) {
      handlePayMultipleInvoices()
    } else {
      handlePaySingleInvoice()
    }
  }

  const handleRetryFailed = () => {
    setPaymentResults([])
    setHasError(false)
    setPaymentCompleted(false)
    setProgressCurrent(0)
    setProgressTotal(0)
  }

  const handleClose = () => {
    setShowPayModal(false)
    setHasError(false)
    const hasSucceeded = paymentCompleted || succeededResults.length > 0
    if (hasSucceeded) {
      onPaymentComplete?.({ message: modalText.message, isPartial: failedResults.length > 0 })
    }
  }

  const isFinished = paymentCompleted || (hasError && !isLoading)
  const hasPartialResults =
    paymentResults.length > 0 && failedResults.length > 0 && succeededResults.length > 0

  const getActionButton = () => {
    if (isFinished && paymentResults.length > 0) {
      return (
        <div className="tw-flex tw-gap-2">
          {failedResults.length > 0 && (
            <Button variant="outline" onClick={handleRetryFailed}>
              {retryFailedText}
            </Button>
          )}
          <Button onClick={handleClose}>{t("Done")}</Button>
        </div>
      )
    }

    if (paymentCompleted || hasError) {
      return (
        <Button
          disabled={isLoading}
          onClick={handleClose}
        >
          {t("Done")}
        </Button>
      )
    }

    if (!showPaymentDetails) {
      return (
        <Button onClick={() => (window.location = changePayURL)}>
          {t("Set Payment Method")}
        </Button>
      )
    }

    if (!isMultiPay) {
      return (
        <Button
          disabled={
            paymentAmount < effectiveMinAmount ||
            paymentAmount > (selectedInvoice?.balance ?? 0) ||
            isLoading
          }
          onClick={handlePay}
        >
          {t("Pay Now")}
        </Button>
      )
    }

    return (
      <Button disabled={isLoading} onClick={handlePay}>
        {isLoading
          ? parseString(multiPayProgressText, {
              current: String(progressCurrent),
              total: String(progressTotal)
            })
          : `${t("Pay")} ${formatCurrency(totalBalance, currency)}`}
      </Button>
    )
  }

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black/80 tw-flex tw-items-center tw-justify-center tw-z-50">
      <Card className="tw-w-[90vw] sm:tw-w-full tw-max-w-xl tw-m-2">
        <Card.Header>
          <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
            <Card.Title className="tw-mb-0">{modalText.header}</Card.Title>
            <Icon
              onClick={handleClose}
              icon={faTimes}
              aria-label={"Close modal"}
              size="lg"
            />
          </div>
        </Card.Header>
        <Card.Body>
          <Text className="tw-text-muted">{modalText.message}</Text>

          {/* Payment method details */}
          {modalText.showPaymentDetails && defaultPaymentMethod && (
            <>
              <PaymentDetails
                total={totalBalance}
                currency={currency}
                defaultPaymentMethod={defaultPaymentMethod}
              />

              {/* Multi-pay invoice list */}
              {isMultiPay && (
                <div className="tw-mt-4 tw-max-h-48 tw-overflow-y-auto">
                  {invoicesToPay.map((inv) => (
                    <div
                      key={inv.id}
                      className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-gray-100"
                    >
                      <Text className="tw-text-sm tw-text-primary">
                        {inv.invoiceNumber}
                      </Text>
                      <Text className="tw-text-sm tw-font-semibold tw-text-primary">
                        {formatCurrency(inv.balance, currency)}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

              {/* Total and partial payment for single invoice */}
              {!isMultiPay && allowPartialPayment ? (
                <div>
                  <Text className="tw-text-primary">
                    {totalAmountToPayLabel}
                  </Text>
                  <div className="tw-mt-2 tw-relative">
                    <span className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-justify-center tw-w-10 tw-border tw-border-r-0 tw-rounded-l-md tw-bg-blue-gray-100 tw-z-10 select-none">
                      {currencySymbol}
                    </span>
                    <Input
                      aria-label="Invoice payment amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min={effectiveMinAmount}
                      max={selectedInvoice?.balance}
                      step="0.01"
                      className="tw-pl-12"
                    />
                  </div>
                  <Text className="tw-text-primary">
                    {parseString(partialPaymentText, {
                      invoiceBalance: formatCurrency(
                        selectedInvoice?.balance ?? 0,
                        currency
                      ),
                      minAmount: formatCurrency(effectiveMinAmount, currency)
                    })}
                  </Text>
                </div>
              ) : (
                <div className="tw-flex tw-justify-between tw-items-center tw-mt-4">
                  <Text className="tw-text-primary tw-font-semibold">
                    {totalAmountToPayLabel}
                  </Text>
                  <Text className="tw-text-primary tw-text-lg tw-font-bold">
                    {formatCurrency(
                      isMultiPay ? totalBalance : paymentAmount,
                      currency
                    )}
                  </Text>
                </div>
              )}
            </>
          )}

          {/* Multi-pay progress bar */}
          {isMultiPay && isLoading && (
            <div className="tw-mt-4">
              <div className="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-2">
                <div
                  className="tw-bg-blue-600 tw-h-2 tw-rounded-full tw-transition-all tw-duration-300"
                  style={{
                    width: `${progressTotal > 0 ? (progressCurrent / progressTotal) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Multi-pay results */}
          {paymentResults.length > 0 && !isLoading && (
            <div className="tw-mt-4 tw-max-h-60 tw-overflow-y-auto">
              {succeededResults.length > 0 && (
                <div className="tw-mb-3">
                  {succeededResults.map((result) => (
                    <div
                      key={result.invoice.id}
                      className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-gray-100"
                    >
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <Icon
                          icon={faCheck}
                          className="tw-text-green-600"
                          size="sm"
                        />
                        <Text className="tw-text-sm tw-text-primary">
                          {result.invoice.invoiceNumber}
                        </Text>
                      </div>
                      <Badge variant="success">
                        {formatCurrency(result.invoice.balance, currency)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {failedResults.length > 0 && (
                <div>
                  {failedResults.map((result) => (
                    <div
                      key={result.invoice.id}
                      className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-gray-100"
                    >
                      <div className="tw-flex tw-items-center tw-gap-2">
                        <Icon
                          icon={faXmark}
                          className="tw-text-red-600"
                          size="sm"
                        />
                        <div>
                          <Text className="tw-text-sm tw-text-primary">
                            {result.invoice.invoiceNumber}
                          </Text>
                          {result.error && (
                            <Text className="tw-text-xs tw-text-red-600">
                              {result.error}
                            </Text>
                          )}
                        </div>
                      </div>
                      <Badge variant="danger">
                        {formatCurrency(result.invoice.balance, currency)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card.Body>
        <Card.Footer className="tw-flex tw-justify-end tw-gap-2">
          {!paymentCompleted && !hasError && !isLoading && (
            <Button
              variant="text"
              onClick={handleClose}
            >
              {t("Cancel")}
            </Button>
          )}
          {getActionButton()}
        </Card.Footer>
      </Card>
    </div>
  )
}

PayModal.Skeleton = (): React.JSX.Element => (
  <div className="tw-fixed tw-inset-0 tw-bg-black/80 tw-flex tw-items-center tw-justify-center tw-z-50">
    <Card className="tw-w-[90vw] sm:tw-w-full tw-max-w-xl tw-m-2">
      <Skeleton className="tw-w-1/2 tw-h-4 tw-p-4 tw-mb-8" />
      <Skeleton className="tw-w-full tw-h-4 tw-py-4 tw-mb-8" />
      <Skeleton className="tw-w-20 tw-ml-auto tw-h-4 tw-p-4" />
    </Card>
  </div>
)

export default PayModal
