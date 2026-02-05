import React, { useState, useMemo } from "react"
import { useCampaign, useBasket, useLimioContext } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import { groupBy, prop } from "ramda"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")

const groupOffersByGroup = groupBy((offer) =>
    offer?.data?.attributes?.group__limio || "default"
)

const IntelliJOfferCards = () => {
    const { offers } = useCampaign() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const {
        addOfferToBasket,
        initiateCheckout,
        navigateToCheckout,
        basketLoading,
        pageOptions
    } = useBasket() || {}

    const props = useStaticProps() || {}
    const {
        headline = "Choose Your Plan",
        subheadline = "All plans include access to core features and updates",
        accentColor = "#087CFA",
        showGroupToggle = true,
        groupLabels = [],
        ctaText = "Get Started",
        showFeatures = true
    } = props

    const groupedOffers = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return {}
        return groupOffersByGroup(offers)
    }, [offers])

    const validLabels = useMemo(() => {
        const groups = Object.keys(groupedOffers)
        if (groupLabels?.length > 0) {
            return groupLabels.filter(item => groups.includes(item.id))
        }
        return groups.map(g => ({ id: g, label: g }))
    }, [groupLabels, groupedOffers])

    const [selectedGroup, setSelectedGroup] = useState(validLabels[0]?.id || "")

    const displayedOffers = useMemo(() => {
        if (showGroupToggle && selectedGroup && groupedOffers[selectedGroup]) {
            return groupedOffers[selectedGroup]
        }
        return offers || []
    }, [showGroupToggle, selectedGroup, groupedOffers, offers])

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

    if (!offers?.length) {
        if (isInPageBuilder) {
            return (
                <section className="ij-offer-cards">
                    <div className="ij-offer-cards__container">
                        <p className="ij-offer-cards__placeholder">
                            No offers available. Add offers to this page to see the component.
                        </p>
                    </div>
                </section>
            )
        }
        return null
    }

    return (
        <section className="ij-offer-cards">
            <div className="ij-offer-cards__container">
                <header className="ij-offer-cards__header">
                    <h2 className="ij-offer-cards__headline">{headline}</h2>
                    {subheadline && (
                        <p className="ij-offer-cards__subheadline">{subheadline}</p>
                    )}
                </header>

                {showGroupToggle && validLabels.length > 1 && (
                    <div className="ij-offer-cards__toggle">
                        {validLabels.map((group) => (
                            <button
                                key={group.id}
                                className={`ij-offer-cards__toggle-btn ${
                                    selectedGroup === group.id ? "ij-offer-cards__toggle-btn--active" : ""
                                }`}
                                onClick={() => setSelectedGroup(group.id)}
                                style={{
                                    "--accent-color": accentColor
                                }}
                            >
                                {group.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="ij-offer-cards__grid">
                    {displayedOffers.map((offer, index) => (
                        <OfferCard
                            key={offer?.id || index}
                            offer={offer}
                            accentColor={accentColor}
                            ctaText={ctaText}
                            showFeatures={showFeatures}
                            onSelect={handleAddToBasket}
                            isLoading={basketLoading}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

const OfferCard = ({
    offer,
    accentColor,
    ctaText,
    showFeatures,
    onSelect,
    isLoading
}) => {
    const attributes = offer?.data?.attributes || {}
    const {
        display_name__limio,
        display_price__limio,
        detailed_display_price__limio,
        offer_features__limio,
        best_value__limio,
        badge_text__limio,
        cta_text__limio
    } = attributes

    const displayName = display_name__limio || offer?.name || "Plan"
    const buttonText = cta_text__limio || ctaText
    const isFeatured = best_value__limio === true
    const badgeText = badge_text__limio || (isFeatured ? "Recommended" : null)

    const attachments = offer?.data?.attachments || []
    const imageAttachment = attachments.find(a =>
        a.type === "image" || (a.url && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(a.url))
    )

    return (
        <article
            className={`ij-card ${isFeatured ? "ij-card--featured" : ""}`}
            style={{ "--accent-color": accentColor }}
        >
            {badgeText && (
                <div className="ij-card__badge">
                    {badgeText}
                </div>
            )}

            <div className="ij-card__header">
                {imageAttachment && (
                    <div className="ij-card__icon">
                        <img src={imageAttachment.url} alt="" />
                    </div>
                )}
                <h3 className="ij-card__title">{displayName}</h3>
            </div>

            <div className="ij-card__pricing">
                {display_price__limio && (
                    <div
                        className="ij-card__price"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeString(display_price__limio)
                        }}
                    />
                )}
                {detailed_display_price__limio && (
                    <div
                        className="ij-card__price-detail"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeString(detailed_display_price__limio)
                        }}
                    />
                )}
            </div>

            {showFeatures && offer_features__limio && (
                <div
                    className="ij-card__features"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeString(offer_features__limio)
                    }}
                />
            )}

            <button
                className="ij-card__cta"
                onClick={() => onSelect(offer)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="ij-card__spinner" />
                ) : (
                    buttonText
                )}
            </button>
        </article>
    )
}

export default IntelliJOfferCards
