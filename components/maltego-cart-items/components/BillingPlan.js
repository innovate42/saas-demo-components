import * as React from "react"
import * as R from "ramda"
import { useCampaign } from "@limio/sdk"
import { groupPath, toDays, stripHTMLtags } from "../helpers"

const formatTermLabel = term => {
  const { length, type } = term
  if (type === "months" && length === 1) return "Monthly"
  if (type === "months") return `${length} months`
  if (type === "years" && length === 1) return "1 year"
  if (type === "years") return `${length} years`
  return `${length} ${type}`
}

function BillingPlan({ selectedProduct, selectedTerm, handleTermChange, upsellLayout = "radio", showPrice = true }) {
  const { offers = [] } = useCampaign()

  const offerGroups = R.groupBy(offer => groupPath(offer), offers)
  const possibleTerms = R.uniq(offerGroups[selectedProduct].map(offer => offer.data.attributes.term__limio))
  const sortedTerms = R.sort((a, b) => toDays(a) - toDays(b), possibleTerms)

  const getTermPrice = term => {
    const offer = offerGroups[selectedProduct].find(o => R.equals(o.data.attributes.term__limio, term))
    const raw = offer?.data?.attributes?.display_price__limio || ""
    return raw ? stripHTMLtags(raw) : ""
  }

  if (upsellLayout === "card") {
    return (
      <>
        <div className="mci-term-cards">
          {sortedTerms.map(term => {
            const isSelected = R.equals(term, selectedTerm)
            const label = formatTermLabel(term)
            const price = showPrice ? getTermPrice(term) : ""
            return (
              <button
                key={JSON.stringify(term)}
                className={`mci-term-card${isSelected ? " mci-term-card--selected" : ""}`}
                onClick={() => handleTermChange(term)}
                type="button"
              >
                <span className="mci-term-card__label">{label}</span>
                {price && <span className="mci-term-card__price">{price}</span>}
              </button>
            )
          })}
        </div>
        <div className="row-border" />
      </>
    )
  }

  // Default: radio layout
  return (
    <>
      <div>
        {sortedTerms.map(term => {
          const isSelected = R.equals(term, selectedTerm)
          const price = showPrice ? getTermPrice(term) : ""
          return (
            <div className="billing-option" key={JSON.stringify(term)}>
              <label className={isSelected ? "billing-option-input--checked" : "billing-option-input"}>
                <input
                  type="radio"
                  value={JSON.stringify(term)}
                  onChange={() => handleTermChange(term)}
                  checked={isSelected}
                  className="gap"
                />
                <span className="billing-option-label-text">{formatTermLabel(term)}</span>
                {price && <span className="billing-option-price">{price}</span>}
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
