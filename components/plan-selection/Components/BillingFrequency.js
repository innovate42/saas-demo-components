// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { usePreview } from "@limio/ui-preview-context"
import { groupPath } from "../helpers"

type Props = {
  handleFrequencyChange: string => void,
  selectedBillingPlan: string,
  selectedProduct: string,
  selectedTerm: Object
}

const capitalize = s => s && s[0].toUpperCase() + s.slice(1)

function BillingFrequency({ selectedProduct, selectedBillingPlan, selectedTerm, handleFrequencyChange }: Props): React.Node {
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const { loadingPreview } = usePreview()

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
                disabled={loadingPreview}
              />
              {capitalize(billingPlan)}
              {/* change this to whatever value is necessary / set as a customer prop to select the correct attribute?  */}
            </label>
          </div>
        ))}
      </div>
      <div className="row-border" />
    </>
  )
}

export default BillingFrequency
