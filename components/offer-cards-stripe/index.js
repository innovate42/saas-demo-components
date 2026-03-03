import React, { useState, useMemo } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import { groupBy, prop } from "ramda"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")

const themes = {
    purple: { primary: "#635BFF", hover: "#5851EA" },
    blue: { primary: "#0073E6", hover: "#005BBB" },
    indigo: { primary: "#4F46E5", hover: "#4338CA" },
    emerald: { primary: "#059669", hover: "#047857" },
    slate: { primary: "#475569", hover: "#334155" },
}

const groupOffers = groupBy(prop("group__limio"))

const CheckIcon = () => (
    <svg className="stripe-check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const OfferCard = ({ offer, isPopular, primaryColor, showFeatures, isDark }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } = useBasket() || {}

    const attributes = offer?.data?.attributes || {}

    const name = attributes.display_name__limio || "Plan"
    const price = attributes.display_price__limio || ""
    const detailedPrice = attributes.detailed_display_price__limio || ""
    const features = attributes.offer_features__limio || ""
    const description = attributes.display_description__limio || ""
    const badgeText = attributes.badge_text__limio || "Most popular"
    const ctaText = attributes.cta_text__limio || "Get started"

    const featuresList = features
        .split(/<li[^>]*>|<\/li>/gi)
        .filter(item => item.trim() && !item.includes("<ul") && !item.includes("</ul"))
        .map(item => item.replace(/<[^>]*>/g, "").trim())
        .filter(item => item.length > 0)

    const handleAddToBasket = async () => {
        setIsLoading(true)
        try {
            const checkoutId = getCurrentBasketId()
            if (!checkoutId) {
                await initiateCheckout({ order: { orderItems: [{ offer }] } })
            } else {
                await addOfferToBasket({ offer })
            }
            if (pageOptions?.pushToCheckout) {
                await navigateToCheckout()
            }
        } catch (err) {
            console.error("Error adding to basket:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const cardClass = `stripe-card ${isPopular ? "stripe-card--popular" : ""} ${isDark ? "stripe-card--dark" : ""}`

    return (
        <div className={cardClass} style={isPopular ? { borderColor: primaryColor } : {}}>
            {isPopular && (
                <div className="stripe-badge" style={{ backgroundColor: primaryColor }}>
                    {badgeText}
                </div>
            )}

            <div className="stripe-card__content">
                <h3 className="stripe-card__name">{name}</h3>

                {description && (
                    <p className="stripe-card__description">{description}</p>
                )}

                <div
                    className="stripe-card__price"
                    dangerouslySetInnerHTML={{ __html: sanitizeString(price) }}
                />

                {detailedPrice && (
                    <div
                        className="stripe-card__detailed-price"
                        dangerouslySetInnerHTML={{ __html: sanitizeString(detailedPrice) }}
                    />
                )}

                <button
                    className={`stripe-cta ${isPopular ? "stripe-cta--primary" : "stripe-cta--secondary"}`}
                    style={isPopular ? { backgroundColor: primaryColor } : { color: primaryColor, borderColor: primaryColor }}
                    onClick={handleAddToBasket}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : ctaText}
                </button>

                {showFeatures && featuresList.length > 0 && (
                    <div className="stripe-features">
                        <p className="stripe-features__title">What's included</p>
                        <ul className="stripe-features__list">
                            {featuresList.map((feature, i) => (
                                <li key={i} className="stripe-features__item">
                                    <CheckIcon />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

const BillingToggle = ({ labels, selected, onSelect, savingsLabel, primaryColor }) => {
    if (!labels || labels.length < 2) return null

    return (
        <div className="stripe-toggle">
            {labels.map((item, i) => (
                <button
                    key={item.id}
                    className={`stripe-toggle__btn ${selected === item.id ? "stripe-toggle__btn--active" : ""}`}
                    onClick={() => onSelect(item.id)}
                >
                    {item.label}
                    {i === labels.length - 1 && savingsLabel && (
                        <span className="stripe-toggle__badge" style={{ backgroundColor: primaryColor }}>
                            {savingsLabel}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}

const OfferCardsStripe = () => {
    const { offers } = useCampaign() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Simple, transparent pricing",
        subheading = "Choose the plan that's right for you.",
        componentId = "offers-stripe",
        themeColor = "purple",
        backgroundStyle = "animated",
        groupLabels = [],
        showGroupedOffers = false,
        annualSavingsLabel = "",
        showFeatureComparison = true,
    } = props

    const theme = themes[themeColor] || themes.purple
    const isDark = backgroundStyle === "dark"

    const groupedOffers = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return {}
        return groupOffers(
            offers.map(offer => ({
                ...offer,
                group__limio: offer?.data?.attributes?.group__limio || "default",
            }))
        )
    }, [offers])

    const validLabels = useMemo(() => {
        const groups = Object.keys(groupedOffers)
        if (groupLabels && groupLabels.length > 0) {
            // groupLabels is array of {id, label} objects
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

    const popularIndex = useMemo(() => {
        const idx = displayedOffers.findIndex(o => o?.data?.attributes?.best_value__limio === true)
        if (idx !== -1) return idx
        return displayedOffers.length >= 3 ? 1 : 0
    }, [displayedOffers])

    if (!offers || offers.length === 0) {
        return null
    }

    const wrapperClass = `stripe-pricing ${isDark ? "stripe-pricing--dark" : ""} stripe-pricing--${backgroundStyle}`

    return (
        <section id={componentId} className={wrapperClass}>
            <div className="stripe-pricing__bg">
                <div className="stripe-orb stripe-orb--1" style={{ background: `radial-gradient(circle, ${theme.primary}25 0%, transparent 70%)` }} />
                <div className="stripe-orb stripe-orb--2" style={{ background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)` }} />
            </div>

            <div className="stripe-pricing__container">
                <header className="stripe-pricing__header">
                    <h1 className="stripe-pricing__title">{heading}</h1>
                    <p className="stripe-pricing__subtitle">{subheading}</p>

                    {showGroupedOffers && validLabels.length > 1 && (
                        <BillingToggle
                            labels={validLabels}
                            selected={selectedGroup}
                            onSelect={setSelectedGroup}
                            savingsLabel={annualSavingsLabel}
                            primaryColor={theme.primary}
                        />
                    )}
                </header>

                <div className="stripe-cards">
                    {displayedOffers.map((offer, i) => (
                        <OfferCard
                            key={offer?.id || i}
                            offer={offer}
                            isPopular={i === popularIndex}
                            primaryColor={theme.primary}
                            showFeatures={showFeatureComparison}
                            isDark={isDark}
                        />
                    ))}
                </div>

                <footer className="stripe-footer">
                    <span>ð Secure checkout</span>
                    <span>â¢</span>
                    <span>Cancel anytime</span>
                    <span>â¢</span>
                    <span>24/7 support</span>
                </footer>
            </div>
        </section>
    )
}

export default OfferCardsStripe
