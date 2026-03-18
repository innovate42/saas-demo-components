import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { groupPath } from "../helpers"

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

function BillingFrequency({ selectedProduct, selectedBillingPlan, selectedTerm, handleFrequencyChange }) {
  const { offers = [] } = useCampaign()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const selectedProductOffers = offerGroups[selectedProduct]
  const validOffers = selectedProductOffers.filter(offer => R.equals(offer.data.attributes.term__limio, selectedTerm))

  const selectedBillingPlans = R.groupBy(offer => offer.data.attributes.billing_plan[0], validOffers)

  return (
    <>
      <p className="plan-title">BILLING FREQUENCY</p>
      <div>
        {Object.keys(selectedBillingPlans).map((billingPlan, i) => (
          <div className="billing-option" key={i}>
            <label className={`${billingPlan === selectedBillingPlan ? "billing-option-input--checked" : "billing-option-input"}`}>
              <input
                type="radio"
                id={billingPlan}
                value={billingPlan}
                onChange={e => handleFrequencyChange(e.target.value)}
                checked={billingPlan === selectedBillingPlan}
                className="billing-option-input gap"
              />
              {capitalize(billingPlan)}
            </label>
          </div>
        ))}
      </div>
      <div className="row-border" />
    </>
  )
}

export default BillingFrequency
