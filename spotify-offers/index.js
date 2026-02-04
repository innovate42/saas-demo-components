import React, { useState, useMemo } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import { groupBy, prop } from "ramda"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")
const groupOffers = groupBy(prop("group__limio"))

// Get contrasting text color for a background
const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000"
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

const OfferCard = ({
    offer,
    index,
    accentColor,
    bestValueLabel,
    cardBackgroundColor,
    textColor,
    mutedTextColor,
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

    const buttonTextColor = getContrastColor(accentColor)

    return (
        <div
            className="spotify-offers__card"
            style={{ backgroundColor: cardBackgroundColor }}
        >
            <div
                className="spotify-offers__card-accent"
                style={{ backgroundColor: accentColor }}
            />

            {imageAttachment && (
                <img
                    src={imageAttachment.url}
                    alt={displayName}
                    className="spotify-offers__card-image"
                />
            )}

            <div className="spotify-offers__card-body">
                {isBestValue && (
                    <span
                        className="spotify-offers__card-badge"
                        style={{
                            backgroundColor: accentColor,
                            color: buttonTextColor
                        }}
                    >
                        {bestValueLabel}
                    </span>
                )}

                <h3
                    className="spotify-offers__card-name"
                    style={{ color: textColor }}
                >
                    {displayName}
                </h3>

                <div className="spotify-offers__card-price">
                    <div
                        className="spotify-offers__card-price-value"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: sanitizeString(displayPrice) }}
                    />
                    {detailedPrice && (
                        <div
                            className="spotify-offers__card-price-detail"
                            style={{ color: mutedTextColor }}
                            dangerouslySetInnerHTML={{ __html: sanitizeString(detailedPrice) }}
                        />
                    )}
                </div>

                <div className="spotify-offers__card-divider" />

                {features && (
                    <div
                        className="spotify-offers__card-features"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{ __html: sanitizeString(features) }}
                    />
                )}

                <button
                    className="spotify-offers__card-cta"
                    style={{
                        backgroundColor: accentColor,
                        color: buttonTextColor
                    }}
                    onClick={() => onAddToBasket(offer)}
                    disabled={loading}
                >
                    {loading ? "Processing..." : ctaText}
                </button>
            </div>
        </div>
    )
}

const SpotifyOffers = () => {
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
        heroHeadline = "Get Premium free for 1 month",
        heroSubheadline = "Just $10.99/month after. Cancel anytime.",
        heroImageUrl = "",
        showHeroSection = true,
        sectionHeadline = "Pick your Premium",
        sectionSubheadline = "Listen without limits on your phone, speaker, and other devices.",
        showGroupedOffers = false,
        groupLabels = [],
        cardAccentColors = [],
        bestValueLabel = "Most Popular",
        backgroundColor__limio_color: backgroundColor = "#121212",
        cardBackgroundColor__limio_color: cardBackgroundColor = "#242424",
        textColor__limio_color: textColor = "#FFFFFF",
        mutedTextColor__limio_color: mutedTextColor = "#A7A7A7",
        primaryAccentColor__limio_color: primaryAccentColor = "#1ED760"
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

    // Get accent color for a specific offer index
    const getAccentColor = (index) => {
        const colorConfig = cardAccentColors.find(
            c => c.offerId === String(index) || c.offerId === index
        )
        if (colorConfig?.color) return colorConfig.color

        // Default color rotation
        const defaultColors = ["#1ED760", "#ffd2d7", "#c4b1d4", "#ffc862", "#a5bbd1"]
        return defaultColors[index % defaultColors.length]
    }

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

    return (
        <div className="spotify-offers" style={{ backgroundColor }}>
            {/* Hero Section */}
            {showHeroSection && (
                <section className="spotify-offers__hero">
                    {heroImageUrl && (
                        <img
                            src={heroImageUrl}
                            alt=""
                            className="spotify-offers__hero-image"
                        />
                    )}
                    <div className="spotify-offers__hero-content">
                        <h1
                            className="spotify-offers__hero-headline"
                            style={{ color: textColor }}
                        >
                            {heroHeadline}
                        </h1>
                        <p
                            className="spotify-offers__hero-subheadline"
                            style={{ color: mutedTextColor }}
                        >
                            {heroSubheadline}
                        </p>
                        <a
                            href="#plans"
                            className="spotify-offers__hero-cta"
                            style={{
                                backgroundColor: primaryAccentColor,
                                color: getContrastColor(primaryAccentColor)
                            }}
                        >
                            View Plans
                        </a>
                    </div>
                </section>
            )}

            {/* Offers Section */}
            <section className="spotify-offers__section" id="plans">
                <div className="spotify-offers__container">
                    <header className="spotify-offers__header">
                        <h2
                            className="spotify-offers__headline"
                            style={{ color: textColor }}
                        >
                            {sectionHeadline}
                        </h2>
                        {sectionSubheadline && (
                            <p
                                className="spotify-offers__subheadline"
                                style={{ color: mutedTextColor }}
                            >
                                {sectionSubheadline}
                            </p>
                        )}
                    </header>

                    {showGroupedOffers && validLabels.length > 1 && (
                        <div className="spotify-offers__toggle">
                            <div className="spotify-offers__toggle-container">
                                {validLabels.map((group) => (
                                    <button
                                        key={group.id}
                                        className={`spotify-offers__toggle-btn ${
                                            selectedGroup === group.id
                                                ? "spotify-offers__toggle-btn--active"
                                                : ""
                                        }`}
                                        style={{
                                            color: selectedGroup === group.id
                                                ? backgroundColor
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

                    {(!offers || offers.length === 0) ? (
                        <p className="spotify-offers__empty" style={{ color: mutedTextColor }}>
                            No plans available at this time.
                        </p>
                    ) : (
                        <div className="spotify-offers__grid">
                            {displayedOffers.map((offer, index) => (
                                <OfferCard
                                    key={offer?.id || index}
                                    offer={offer}
                                    index={index}
                                    accentColor={getAccentColor(index)}
                                    bestValueLabel={bestValueLabel}
                                    cardBackgroundColor={cardBackgroundColor}
                                    textColor={textColor}
                                    mutedTextColor={mutedTextColor}
                                    onAddToBasket={handleAddToBasket}
                                    loading={basketLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default SpotifyOffers
