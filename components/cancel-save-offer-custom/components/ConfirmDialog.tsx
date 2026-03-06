import * as React from "react"
import { LoadingSpinner } from "@limio/design-system"
import { sanitiseHTML } from "@limio/sdk"
import * as R from "ramda"
import { DateTime } from "@limio/date"
import { PaymentDetails } from "@limio/old-shop-components/src/components/PaymentDetails"
import { updateSubscriptionTermEndDate } from "@limio/sdk/subscription"
import { parseString, encodeDates } from "@limio/shop/src/helpers/string.ts"
import { formatCurrency, formatDate } from "@limio/shop/src/format"
import { useComponentStaticProps } from "../componentStaticProps"
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig"
import type { LimioObject, PaymentMethod, Subscription, ElasticOffer, Schedule } from "@limio/types"

type Props = {
  onConfirm: () => Promise<void>
  onCancel: () => void
  nextSchedule: LimioObject<Schedule>
  offer: ElasticOffer
  subscription: LimioObject<Subscription>
  prevSchedule: LimioObject<Schedule>
  previewSchedule: LimioObject<Schedule>
  paymentMethod: LimioObject<PaymentMethod>
}

export function ConfirmDialog({ onConfirm, onCancel, nextSchedule, offer, subscription, prevSchedule, previewSchedule, paymentMethod }: Props) {
  const {
    confirmHeading,
    confirmSubheading,
    confirmationOk,
    confirmationCancel,
    redirectUrl,
    showPaymentMethod,
    imageUrl,
    paymentMethodHeading,
    paymentAmountLabel,
    paymentDateLabel,
    paymentFrequencyLabel
  } = useComponentStaticProps()
  let params = new URL(window.location).searchParams
  const subIdParam = params.get("subId") || ""
  const [loading, setLoading] = React.useState(false)

  const { attributes = {}, attachments } = offer.data || {}
  const discount = attributes.discount__limio
  const discountedPrice = formatCurrency(previewSchedule?.[0]?.amount, nextSchedule?.data?.currency)

  const dateFormat = getAppConfigValue(["shop", "default_date_format"])
  const effectiveDate =
    offer?.data?.attributes?.switch_date__limio === "immediate" ? DateTime.utc().toISO() : nextSchedule?.data?.schedule_date || subscription?.data?.termEndDate

  const nextPaymentSaving = (
    <span>
      Next payment <s>{formatCurrency(nextSchedule?.data?.amount, nextSchedule?.data?.currency)}</s>
      {` ${discountedPrice}`}
    </span>
  )
  const nextPaymentDate = nextSchedule?.data?.date
  const nextPaymentCost = formatCurrency(previewSchedule?.[0]?.amount, nextSchedule?.data?.currency)
  const currentPaymentCost = formatCurrency(prevSchedule?.data?.amount, prevSchedule?.data?.currency)
  const currentPrice = formatCurrency(nextSchedule?.data?.amount, nextSchedule?.data?.currency)
  const currentOffer = offer?.data?.record_subtype === "discount"
  const discountData = offer?.data?.attributes?.discount__limio
  const currentOfferTermData = offer?.data?.attributes?.term__limio
  const { length: currentOfferTermLength, type: currentOfferTermType } = currentOfferTermData
  const offerTerm = `${currentOfferTermLength} ${
    currentOfferTermLength > 1 ? currentOfferTermType : currentOfferTermType?.substr(0, currentOfferTermType.length - 1)
  }`
  const paymentLabels = {
    frequency: paymentFrequencyLabel,
    amount: paymentAmountLabel,
    nextBillDate: paymentDateLabel
  } as const
  const { termLength, termType } = discountData
  let discountEndDate = ""
  if (discountData?.termType) {
    discountEndDate = DateTime.fromISO(nextPaymentDate).plus({ [termType]: parseInt(termLength) })
  }

  const subscriptionData = subIdParam ? subscription : subscription?.items?.[0]
  const data = updateSubscriptionTermEndDate(subscriptionData, params)

  data.nextPaymentDate = nextPaymentDate
  data.nextPaymentCost = nextPaymentCost
  data.currentPaymentCost = currentPaymentCost
  data.discountEndDate = discountEndDate
  data.currentPrice = currentPrice

  const confirm = async () => {
    const params = new URL(window.location).searchParams

    setLoading(true)
    await onConfirm()
    setLoading(false)
    onCancel()
    document.cookie = `limio-cookie=; max-age=0` // this cookie can be removed now
    window.location.href = `${redirectUrl}?subId=${params.get("subId")}`
  }

  return (
    <div className="offer-confirm-dialog-container">
      <div className="offer-confirm-dialog">
        {confirmHeading && <div className="confirm-title">{confirmHeading}</div>}
        <div className="confirm-body">
          {showPaymentMethod && paymentMethod && (
            <PaymentDetails
              paymentMethod={paymentMethod}
              frequency={offerTerm}
              amount={discountedPrice}
              nextBillDate={formatDate(effectiveDate, dateFormat)}
              paymentLabels={paymentLabels}
              paymentHeading={paymentMethodHeading}
            />
          )}
          {currentOffer && confirmSubheading && (
            <div
              className="confirm-body-section"
              data-limio-prop="subheading"
              dangerouslySetInnerHTML={{ __html: sanitiseHTML(parseString(confirmSubheading, data, encodeDates)) }}
            />
          )}

          {offer && (
            <div className="confirm-body-section offer">
              {attachments && (
                <div className="offer-image">
                  <img src={R.path([0, "url"], attachments) || imageUrl} alt={"offerImage"} />
                </div>
              )}

              <div className="offer-details">
                <div className="display-name">{attributes.display_name__limio ? attributes.display_name__limio : offer.name}</div>
                <div className="display-price" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) }} />
                {discount && <div className="display-price discount">{nextPaymentSaving}</div>}
                <div className="detailed-price" dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
              </div>
            </div>
          )}
        </div>
        <div className="confirm-actions">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="confirm-action cancel" onClick={() => onCancel()}>
                {confirmationCancel}
              </div>
              <div className="confirm-action" onClick={() => confirm()}>
                {confirmationOk}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
