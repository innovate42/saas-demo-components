// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { usePreview } from "@limio/ui-preview-context"
import { groupPath } from "./helpers"

type Props = {
  handleFrequencyChange: string => void,
  selectedBillingPlan: string,
  selectedProduct: string,
  selectedTerm: Object
}

function BillingFrequency({ selectedProduct, handleFrequencyChange, selectedBillingPlan, selectedTerm }: Props): React.Node {
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

  // TODO: refactor to use offer id in the selection instead of rate plan
  const selectedRatePlans = R.groupBy(offer => offer.data.productBundles[0].rate_plan, validOffers)

  return (
    <>
      <p className="plan-title">BILLING FREQUENCY</p>
      <div>
        {Object.keys(selectedRatePlans).map((ratePlan, i) => (
          <div className="billing-option" key={i}>
            <label className={`${ratePlan === selectedBillingPlan ? "billing-option-input--checked" : "billing-option-input"}`}>
              <input
                type="radio"
                id={ratePlan}
                value={ratePlan}
                onChange={e => handleFrequencyChange(e.target.value)}
                checked={ratePlan === selectedBillingPlan}
                className="billing-option-input gap"
                disabled={loadingPreview}
              />
              {ratePlan}
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
