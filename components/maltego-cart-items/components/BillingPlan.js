import * as React from "react"
import * as R from "ramda"
import { toDays, stripHTMLtags } from "../helpers"

const getOfferLabel = offer => {
  const displayName = offer.data.attributes.upsell_display_name__limio
  if (displayName) return stripHTMLtags(displayName)
  // Fallback: derive from term
  const term = offer.data.attributes.term__limio
  if (!term) return offer.name || ""
  const { length, type } = term
  if (type === "months" && length === 1) return "Monthly"
  if (type === "months") return `${length} months`
  if (type === "years" && length === 1) return "1 year"
  if (type === "years") return `${length} years`
  return `${length} ${type}`
}

const getOfferPrice = offer => {
  const raw = offer.data.attributes.display_price__limio || ""
  return raw ? stripHTMLtags(raw) : ""
}

function BillingPlan({ upsellOffers = [], selectedOfferId, handleOfferChange, upsellLayout = "radio", showPrice = true }) {
  if (!upsellOffers.length) return null

  const sortedOffers = R.sort(
    (a, b) => toDays(a.data.attributes.term__limio) - toDays(b.data.attributes.term__limio),
    upsellOffers
  )

  if (upsellLayout === "card") {
    return (
      <>
        <div className="mci-term-cards">
          {sortedOffers.map(offer => {
            const isSelected = offer.id === selectedOfferId
            const price = showPrice ? getOfferPrice(offer) : ""
            return (
              <button
                key={offer.id}
                className={`mci-term-card${isSelected ? " mci-term-card--selected" : ""}`}
                onClick={() => handleOfferChange(offer)}
                type="button"
              >
                <span className="mci-term-card__label">{getOfferLabel(offer)}</span>
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
        {sortedOffers.map(offer => {
          const isSelected = offer.id === selectedOfferId
          const price = showPrice ? getOfferPrice(offer) : ""
          return (
            <div className="billing-option" key={offer.id}>
              <label className={isSelected ? "billing-option-input--checked" : "billing-option-input"}>
                <input
                  type="radio"
                  value={offer.id}
                  onChange={() => handleOfferChange(offer)}
                  checked={isSelected}
                  className="gap"
                />
                <span className="billing-option-label-text">{getOfferLabel(offer)}</span>
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
