import React, { useState, useMemo } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import { groupBy, prop } from "ramda"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")
const groupOffers = groupBy(prop("group__limio"))

const OfferCard = ({
    offer,
    bestValueLabel,
    cardBackgroundColor,
    headlineColor,
    textColor,
    ctaBackgroundColor,
    ctaTextColor,
    accentColor,
    onAddToBasket,
    loading
}) => {
    const attributes = offer?.data?.attributes || {}
    const attachments = offer?.data?.attachments || []

    const displayName = attributes.display_name__limio || "Plan"
    const displayPrice = attributes.display_price__limio || ""
    const detailedPrice = attributes.detailed_display_price__limio || ""
    const features = attributes.offer_features__limio || ""
    const ctaText = attributes.cta_text__limio || "Get Started"
    const isBestValue = attributes.best_value__limio === true

    const imageAttachment = attachments.find(a =>
        a.type === "image" || (a.url && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(a.url))
    )

    return (
        <div
            className={`practicetek-offers__card ${isBestValue ? "practicetek-offers__card--featured" : ""}`}
            style={{
                backgroundColor: cardBackgroundColor,
                borderColor: isBestValue ? accentColor : "transparent"
            }}
        >
            {isBestValue && (
                <span
                    className="practicetek-offers__badge"
                    style={{
                        backgroundColor: accentColor,
                        color: ctaTextColor
                    }}
                >
                    {bestValueLabel}
                </span>
            )}

            {imageAttachment && (
                <img
                    src={imageAttachment.url}
                    alt={displayName}
                    className="practicetek-offers__card-image"
                />
            )}

            <h3
                className="practicetek-offers__card-name"
                style={{ color: headlineColor }}
            >
                {displayName}
            </h3>

            <div className="practicetek-offers__card-price">
                <div
                    className="practicetek-offers__card-price-value"
                    style={{ color: headlineColor }}
                    dangerouslySetInnerHTML={{ __html: sanitizeString(displayPrice) }}
                />
                {detailedPrice && (
                    <div
                        className="practicetek-offers__card-price-detail"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: sanitizeString(detailedPrice) }}
                    />
                )}
            </div>

            {features && (
                <div
                    className="practicetek-offers__card-features"
                    style={{ color: textColor }}
                    dangerouslySetInnerHTML={{ __html: sanitizeString(features) }}
                />
            )}

            <button
                className="practicetek-offers__card-cta"
                style={{
                    backgroundColor: ctaBackgroundColor,
                    color: ctaTextColor
                }}
                onClick={() => onAddToBasket(offer)}
                disabled={loading}
            >
                {loading ? "Processing..." : ctaText}
            </button>
        </div>
    )
}

const PracticeTekOffers = () => {
    const { offers } = useCampaign() || {}
    const props = useStaticProps() || {}
    const {
        basketLoading,
        initiateCheckout,
        addOfferToBasket,
        navigateToCheckout,
        pageOptions
    } = useBasket() || {}

    const {
        headline = "Choose Your Plan",
        subheadline = "Select the perfect plan for your practice",
        showGroupedOffers = false,
        groupLabels = [],
        bestValueLabel = "Most Popular",
        backgroundColor__limio_color: backgroundColor = "#F8F9FA",
        cardBackgroundColor__limio_color: cardBackgroundColor = "#FFFFFF",
        headlineColor__limio_color: headlineColor = "#1A1A2E",
        textColor__limio_color: textColor = "#4A4A5A",
        ctaBackgroundColor__limio_color: ctaBackgroundColor = "#1A1A2E",
        ctaTextColor__limio_color: ctaTextColor = "#FFFFFF",
        accentColor__limio_color: accentColor = "#1A1A2E",
        toggleBackgroundColor__limio_color: toggleBackgroundColor = "#E9ECEF",
        toggleActiveColor__limio_color: toggleActiveColor = "#1A1A2E"
    } = props

    // Group offers by group__limio attribute
    const groupedOffers = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return {}
        return groupOffers(
            offers.map(offer => ({
                ...offer,
                group__limio: offer?.data?.attributes?.group__limio || "default"
            }))
        )
    }, [offers])

    // Filter valid labels that have matching offers
    const validLabels = useMemo(() => {
        const groups = Object.keys(groupedOffers)
        if (groupLabels && groupLabels.length > 0) {
            return groupLabels.filter(item => groups.includes(item.id))
        }
        return groups.map(g => ({ id: g, label: g }))
    }, [groupLabels, groupedOffers])

    const [selectedGroup, setSelectedGroup] = useState(validLabels[0]?.id || "")

    const displayedOffers = useMemo(() => {
        if (showGroupedOffers && selectedGroup && groupedOffers[selectedGroup]) {
            return groupedOffers[selectedGroup]
        }
        return offers || []
    }, [showGroupedOffers, selectedGroup, groupedOffers, offers])

    const handleAddToBasket = async (offer) => {
        if (basketLoading) return

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

    if (!offers || offers.length === 0) {
        return (
            <section
                className="practicetek-offers"
                style={{ backgroundColor }}
            >
                <div className="practicetek-offers__container">
                    <p className="practicetek-offers__empty" style={{ color: textColor }}>
                        No offers available at this time.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section
            className="practicetek-offers"
            style={{ backgroundColor }}
        >
            <div className="practicetek-offers__container">
                <header className="practicetek-offers__header">
                    <h2
                        className="practicetek-offers__headline"
                        style={{ color: headlineColor }}
                    >
                        {headline}
                    </h2>
                    {subheadline && (
                        <p
                            className="practicetek-offers__subheadline"
                            style={{ color: textColor }}
                        >
                            {subheadline}
                        </p>
                    )}
                </header>

                {showGroupedOffers && validLabels.length > 1 && (
                    <div className="practicetek-offers__toggle">
                        <div
                            className="practicetek-offers__toggle-container"
                            style={{ backgroundColor: toggleBackgroundColor }}
                        >
                            {validLabels.map((group) => (
                                <button
                                    key={group.id}
                                    className={`practicetek-offers__toggle-btn ${
                                        selectedGroup === group.id
                                            ? "practicetek-offers__toggle-btn--active"
                                            : ""
                                    }`}
                                    style={{
                                        backgroundColor:
                                            selectedGroup === group.id
                                                ? toggleActiveColor
                                                : "transparent",
                                        color:
                                            selectedGroup === group.id
                                                ? ctaTextColor
                                                : textColor
                                    }}
                                    onClick={() => setSelectedGroup(group.id)}
                                >
                                    {group.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="practicetek-offers__grid">
                    {displayedOffers.map((offer, index) => (
                        <OfferCard
                            key={offer?.id || index}
                            offer={offer}
                            bestValueLabel={bestValueLabel}
                            cardBackgroundColor={cardBackgroundColor}
                            headlineColor={headlineColor}
                            textColor={textColor}
                            ctaBackgroundColor={ctaBackgroundColor}
                            ctaTextColor={ctaTextColor}
                            accentColor={accentColor}
                            onAddToBasket={handleAddToBasket}
                            loading={basketLoading}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PracticeTekOffers
