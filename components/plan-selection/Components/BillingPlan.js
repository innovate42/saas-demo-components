// @flow
import * as React from "react"
import * as R from "ramda"
import { useCampaign } from "@limio/sdk"
import { usePreview } from "@limio/ui-preview-context"
import { groupPath } from "../helpers"

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
  const { offers = [], addOns: addOnsFromCampaign } = useCampaign()
  let addOns
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign
  } else {
    addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
  }
  const { loadingPreview } = usePreview()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const possibleTerms = R.uniq(offerGroups[selectedProduct].map(offer => offer.data.attributes.term__limio))

  const toDays = obj => {
    switch (obj.type) {
      case "years":
        return obj.length * 365
      case "months":
        return obj.length * 30
      case "days":
        return obj.length
      default:
        return 0
    }
  }

  const formatTerm = term => {
    const {
      monthlyTermLabel = "Month to Month",
      oneYearTermLabel = "1 Year Agreement",
      twoYearTermLabel = "2 Year Agreement",
      threeYearTermLabel = "3 Year Agreement"
    } = termLabels

    const { length, type } = term
    switch (type) {
      case "years":
        if (length === 1) return oneYearTermLabel
        if (length === 2) return twoYearTermLabel
        if (length === 3) return threeYearTermLabel
        return `${length} ${type}`
      case "months":
        return monthlyTermLabel
      default:
        return `${length} ${type}`
    }
  }

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
