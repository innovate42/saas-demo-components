import * as React from "react"
import { useState, Suspense } from "react"
import { sanitiseHTML } from "@limio/sdk"
import { parseString, encodeDates } from "@limio/shop/src/helpers/string"
import { formatCurrency } from "@limio/shop/src/format"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LoadingSkeleton } from "@limio/design-system"
import { useComponentStaticProps } from "../componentStaticProps"
import "../index.css"

type Props = {
  subscriptionOfferData: any
  nextSchedule: any
  previewSchedule: Array<Record<any, any>>
  discount: any
  description: string
}

const MobileDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="offer-mobile-description">
      <div className={`expand-description ${expanded ? "expanded" : ""}`} onClick={() => setExpanded(!expanded)}>
        <div className="mobile-offer-header-wrapper">
          <h3>What's included</h3>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
      {expanded && <div className="offer-mobile-description" dangerouslySetInnerHTML={{ __html: sanitiseHTML(description) }} />}
    </div>
  )
}

export function SubscriptionFeatures({ subscriptionOfferData, nextSchedule, previewSchedule, discount, description }: Props) {
  const { nextPaymentDetails__limio__richtext, detailedSubheading, discountDetails } = useComponentStaticProps()

  const nextPaymentSaving = (
    <span>
      Next payment <s>{formatCurrency(nextSchedule?.data?.amount, nextSchedule?.data?.currency)}</s>
      {` ${formatCurrency(previewSchedule?.[0]?.amount, nextSchedule?.data?.currency)}`}
    </span>
  )

  return (
    <Suspense
      fallback={
        <div className={"subscription-features-container"}>
          <LoadingSkeleton width="auto" height="100px" />
        </div>
      }
    >
      <div className={"subscription-features-container"}>
        {discountDetails && <div className={"discount-info"}>{parseString(discountDetails, subscriptionOfferData, encodeDates)}</div>}
        {discount && nextPaymentDetails__limio__richtext ? (
          <div
            className={"next-payment-cost"}
            dangerouslySetInnerHTML={{
              __html: sanitiseHTML(parseString(nextPaymentDetails__limio__richtext, subscriptionOfferData, encodeDates))
            }}
          ></div>
        ) : (
          discount && <div className={"next-payment-cost"}>{nextPaymentSaving}</div>
        )}
        {detailedSubheading && <div className={"next-charge-time"}>{parseString(detailedSubheading, subscriptionOfferData, encodeDates)}</div>}
        <div className={"cancel-save-offer-subscription-features"} dangerouslySetInnerHTML={{ __html: sanitiseHTML(description) }} />
        <MobileDescription description={description} />
      </div>
    </Suspense>
  )
}

export default SubscriptionFeatures
