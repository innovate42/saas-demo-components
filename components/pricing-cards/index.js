import React, { useState } from "react"
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

const GroupToggle = ({ groupValues, activeGroup, onGroupChange, primaryColor }) => {
  if (!groupValues || groupValues.length <= 1) return null

  return (
    <div className="pricing-cards__toggle">
      {groupValues.map((group) => (
        <button
          key={group.id}
          className={`pricing-cards__toggle-btn${activeGroup === group.id ? " pricing-cards__toggle-btn--active" : ""}`}
          onClick={() => onGroupChange(group.id)}
          style={activeGroup === group.id ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
        >
          {group.label}
        </button>
      ))}
    </div>
  )
}

const PricingCards = () => {
  const props = useStaticProps() || {}
  const {
    primaryColor__limio_color: primaryColor,
    highlightColor__limio_color: highlightColor,
    cardGap,
    componentId,
  } = props

  const { isInPageBuilder } = useLimioContext() || {}
  const { offers = [], groupValues = [] } = useCampaign() || {}
  const {
    basketLoading,
    initiateCheckout,
    addOfferToBasket,
    navigateToCheckout,
    pageOptions,
  } = useBasket() || {}

  // Derive active groups from actual offers rather than all possible groupValues
  const offerGroupIds = [...new Set(
    offers
      .map((o) => o?.data?.attributes?.group__limio)
      .filter(Boolean)
  )]
  const activeGroups = groupValues.filter((g) => offerGroupIds.includes(g.id))

  const hasGroups = activeGroups.length > 1
  const [activeGroup, setActiveGroup] = useState(activeGroups[0]?.id || null)

  const filteredOffers = hasGroups
    ? offers.filter((offer) => {
        const group = offer?.data?.attributes?.group__limio
        return group === activeGroup
      })
    : offers

  const cardCount = filteredOffers.length
  const gap = cardGap != null ? `${cardGap}px` : undefined
  const gridStyle = gap ? { gap } : undefined

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

  const gridClass = `pricing-cards__grid pricing-cards__grid--cols-${Math.min(cardCount, 4)}`

  return (
    <section id={componentId} className="pricing-cards">
      <GroupToggle
        groupValues={activeGroups}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        primaryColor={primaryColor}
      />
      <div className={gridClass} style={gridStyle}>
        {filteredOffers.map((offer) => (
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
