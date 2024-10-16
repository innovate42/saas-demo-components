// @flow
import * as React from "react"
import * as R from "ramda"
import { useCampaign } from "@limio/sdk"
import { usePreview } from "@limio/ui-preview-context"
import { v4 as uuid } from "uuid"
import { formatTerm, groupPath, toDays } from "./helpers"

type Props = {
  selectedProduct: string,
  selectedTerm: Object,
  handleTermChange: Function
}

function BillingPlan({ selectedProduct, selectedTerm, handleTermChange }: Props): React.Node {
  const { offers = [] } = useCampaign()

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
              <div className="billing-option" key={uuid()}>
                <label className={`${term === selectedTerm ? "billing-option-input--checked" : "billing-option-input"}`}>
                  <input
                    type="radio"
                    id={term}
                    value={term}
                    onChange={e => handleTermChange(term)}
                    checked={term === selectedTerm}
                    className="billing-option-input gap"
                    disabled={loadingPreview}
                  />
                  {formatTerm(term)}
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
