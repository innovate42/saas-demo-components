import * as React from "react"
import { formatCurrency, parseTemplate } from "../helpers"

function Upsell({ offers = [], currentOffer, onUpsell, showUpsellPrice }) {
  const handleChange = (offerId) => {
    const offer = offers.find((o) => o.id === offerId)
    if (offer) onUpsell(offer)
  }

  return (
    <div className="cis-upsell" data-testid="upsells">
      {offers.map((upsellOffer) => {
        const price = upsellOffer.data?.attributes?.price__limio?.[0]
        const displayName = upsellOffer.data?.attributes?.upsell_display_name__limio
        const displayDescription = upsellOffer.data?.attributes?.upsell_display_description__limio
        const id = upsellOffer.id
        const selected = currentOffer?.id === id
        return (
          <label className="cis-upsell__option" key={id} htmlFor={id}>
            <input
              type="radio"
              id={id}
              name="cis-upsell"
              checked={selected}
              onChange={() => handleChange(id)}
            />
            <div className="cis-upsell__text">
              {displayName && (
                <span
                  className="cis-upsell__name"
                  dangerouslySetInnerHTML={{ __html: parseTemplate(displayName, upsellOffer) }}
                />
              )}
              {displayDescription && (
                <span
                  className="cis-upsell__description"
                  dangerouslySetInnerHTML={{ __html: parseTemplate(displayDescription, upsellOffer) }}
                />
              )}
            </div>
            {showUpsellPrice && price && (
              <span className="cis-upsell__price">
                {formatCurrency(price.value, price.currencyCode)}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}

export default Upsell
