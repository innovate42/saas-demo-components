import React from "react"
import { useCampaign, useBasket, sanitiseHTML, useLimioContext } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const PricingCard = ({ offer, primaryColor, highlightColor, selectOffer, basketLoading }) => {
  const attrs = offer?.data?.attributes || {}
  const isHighlighted = attrs.best_value__limio

  const cardClass = `pricing-card${isHighlighted ? " pricing-card--highlighted" : ""}`

  const handleCtaClick = (e) => {
    e.preventDefault()
    selectOffer(offer)
  }

  return (
    <div
      className={cardClass}
      style={isHighlighted ? { backgroundColor: highlightColor } : undefined}
    >
      <div className="pricing-card__header">
        <h2 className="pricing-card__tier-name">
          {attrs.display_name__limio}
        </h2>
      </div>

      <div className="pricing-card__body">
        {attrs.display_description__limio && (
          <p className="pricing-card__description">
            {attrs.display_description__limio}
          </p>
        )}

        {attrs.display_price__limio && (
          <div
            className="pricing-card__price"
            dangerouslySetInnerHTML={{ __html: sanitiseHTML(attrs.display_price__limio) }}
          />
        )}

        {attrs.detailed_display_price__limio && (
          <div
            className="pricing-card__price-detail"
            dangerouslySetInnerHTML={{ __html: sanitiseHTML(attrs.detailed_display_price__limio) }}
          />
        )}

        <button
          className={`pricing-card__cta ${isHighlighted ? "pricing-card__cta--highlighted" : "pricing-card__cta--primary"}`}
          onClick={handleCtaClick}
          disabled={basketLoading}
          style={
            !isHighlighted
              ? { backgroundColor: primaryColor, borderColor: primaryColor }
              : undefined
          }
        >
          {attrs.cta_text__limio || "Subscribe"}
        </button>

        {attrs.offer_features__limio && (
          <div
            className="pricing-card__features"
            dangerouslySetInnerHTML={{ __html: sanitiseHTML(attrs.offer_features__limio) }}
          />
        )}
      </div>
    </div>
  )
}

const PricingCards = () => {
  const props = useStaticProps() || {}
  const {
    primaryColor__limio_color: primaryColor,
    highlightColor__limio_color: highlightColor,
    componentId,
  } = props

  const { isInPageBuilder } = useLimioContext() || {}
  const { offers = [] } = useCampaign() || {}
  const {
    basketLoading,
    initiateCheckout,
    addOfferToBasket,
    navigateToCheckout,
    pageOptions,
  } = useBasket() || {}

  async function selectOffer(offer) {
    const checkoutId = getCurrentBasketId()
    if (!checkoutId) {
      await initiateCheckout({ order: { orderItems: [{ offer }] } })
    } else {
      await addOfferToBasket({ offer })
    }
    if (pageOptions?.pushToCheckout) {
      await navigateToCheckout()
    }
  }

  return (
    <section id={componentId} className="pricing-cards">
      <div className="pricing-cards__grid">
        {offers.map((offer) => (
          <PricingCard
            key={offer?.id || offer?.path}
            offer={offer}
            primaryColor={primaryColor}
            highlightColor={highlightColor}
            selectOffer={selectOffer}
            basketLoading={basketLoading}
          />
        ))}
      </div>
    </section>
  )
}

export default PricingCards
