// @flow
import * as React from "react"
import * as R from "ramda"
import { useCampaign } from "@limio/sdk"
import { usePreview } from "@limio/ui-preview-context"
import { groupPath, toDays, formatTerm } from "../helpers"

type Props = {
  selectedProduct: string,
  selectedTerm: Object,
  handleTermChange: Function,
  termLabels: {
    monthlyTermLabel: string,
    oneYearTermLabel: string,
    twoYearTermLabel: string,
    threeYearTermLabel: string
  }
}

function BillingPlan({ selectedProduct, selectedTerm, handleTermChange, termLabels }: Props): React.Node {
  const { offers = [], } = useCampaign()
  const { loadingPreview } = usePreview()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const possibleTerms = R.uniq(offerGroups[selectedProduct].map(offer => offer.data.attributes.term__limio))
  const sortedTerms = R.sort((a, b) => toDays(a) - toDays(b), possibleTerms)

  return (
    <>
      <p className="plan-title">BILLING PLAN</p>
      <div>
        {!R.isNil(sortedTerms) &&
          sortedTerms.map(term => {
            return (
              <div className="billing-option" key={JSON.stringify(term)}>
                <label className={`${term === selectedTerm ? "billing-option-input--checked" : "billing-option-input"}`}>
                  <input
                    type="radio"
                    id={term}
                    value={term}
                    onChange={() => handleTermChange(term)}
                    checked={term === selectedTerm}
                    className="billing-option-input gap"
                    disabled={loadingPreview}
                  />
                  {formatTerm(term, termLabels)}
                </label>
              </div>
            )
          })}
      </div>
      <div className="row-border" />
    </>
  )
}

export default BillingPlan
