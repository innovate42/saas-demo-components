// @flow
import * as React from "react"
import { useCampaign } from "@limio/sdk"
import * as R from "ramda"
import { usePreview } from "@limio/ui-preview-context"

type Props = {
  setSelectedBillingPlan: string => void,
  selectedBillingPlan: string,
  selectedProduct: string
}

function BillingOptions({ selectedProduct, setSelectedBillingPlan, selectedBillingPlan }: Props): React.Node {
  const { offers = [] } = useCampaign()
  const { loadingPreview } = usePreview()

  const offerGroups = R.groupBy(offer => offer.data.products[0].path, offers)
  const selectedProductOffers = offerGroups[selectedProduct]
  const selectedRatePlans = R.groupBy(offer => offer.data.productBundles[0].rate_plan, selectedProductOffers)

  const handleSelection = e => {
    setSelectedBillingPlan(e.target.value)
  }

  return (
    <>
      <p className="plan-title">BILLING PLAN</p>
      <div>
        {Object.keys(selectedRatePlans).map((ratePlan, i) => (
          <div className="billing-option" key={i}>
            <label className={`${ratePlan === selectedBillingPlan ? "billing-option-input--checked" : "billing-option-input"}`}>
              <input
                type="radio"
                id={ratePlan}
                value={ratePlan}
                onChange={e => handleSelection(e)}
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

export default BillingOptions
