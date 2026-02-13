import React, { useMemo } from "react"
import { useCampaign, useBasket, useUser } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const getContrastColor = (hexColor) => {
    if (!hexColor) return "#ffffff"
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#ffffff"
}

const WinBack = () => {
    const props = useStaticProps() || {}
    const { offers } = useCampaign() || {}
    const user = useUser() || {}
    const { initiateCheckout, addOfferToBasket, navigateToCheckout, basketLoading } = useBasket() || {}

    const {
        headline = "We'd love to have you back",
        subheadline = "Your account is still here, and we've been making things even better since you left.",
        greetingPrefix = "Welcome back",
        fallbackGreeting = "Welcome back",
        offersSectionTitle = "Pick up where you left off",
        offersSectionSubtitle = "Choose a plan that works for you and get started again in seconds.",
        showFeatures = true,
        showDetailedPrice = true,
        valueProps__limio_richtext: valueProps = "<ul><li>All your data and preferences are still saved</li><li>New features and improvements since your last visit</li><li>Cancel anytime — no commitments</li></ul>",
        footerMessage = "Questions? Contact our support team anytime.",
        footerLinkText = "Get in touch",
        footerLinkUrl = "/support",
        primaryColor__limio_color: primaryColor = "#635BFF",
        accentColor__limio_color: accentColor = "#0d9f6e",
    } = props

    const attributes = user?.attributes || {}
    const firstName = attributes.firstName || attributes.first_name || ""
    const lastName = attributes.lastName || attributes.last_name || ""
    const email = attributes.email || ""

    const displayName = useMemo(() => {
        if (firstName) return firstName
        if (lastName) return lastName
        if (email) return email
        return ""
    }, [firstName, lastName, email])

    const greeting = displayName ? `${greetingPrefix}, ${displayName}` : fallbackGreeting

    const initials = useMemo(() => {
        if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
        if (firstName) return firstName[0].toUpperCase()
        if (email) return email[0].toUpperCase()
        return "?"
    }, [firstName, lastName, email])

    const handleResubscribe = async (offer) => {
        if (basketLoading) return
        await initiateCheckout({ order: { orderItems: [{ offer }] } })
        await navigateToCheckout()
    }

    if (!offers?.length) return null

    return (
        <div className="wb-page" style={{ "--wb-primary": primaryColor, "--wb-accent": accentColor }}>

            {/* Hero Section */}
            <div className="wb-hero">
                <div className="wb-hero-inner">
                    <div className="wb-avatar">{initials}</div>
                    <h1 className="wb-greeting">{greeting}</h1>
                    <h2 className="wb-headline">{headline}</h2>
                    <p className="wb-subheadline">{subheadline}</p>
                </div>
                <div className="wb-hero-fade" />
            </div>

            {/* Value Props */}
            {valueProps && (
                <div className="wb-container">
                    <div className="wb-value-props">
                        <div
                            className="wb-value-list"
                            dangerouslySetInnerHTML={{ __html: xss(valueProps) }}
                        />
                    </div>
                </div>
            )}

            {/* Offers Section */}
            <div className="wb-container">
                <div className="wb-offers-header">
                    <h3 className="wb-section-title">{offersSectionTitle}</h3>
                    {offersSectionSubtitle && (
                        <p className="wb-section-subtitle">{offersSectionSubtitle}</p>
                    )}
                </div>

                <div className="wb-offers-grid">
                    {offers.map((offer, i) => {
                        const attrs = offer?.data?.attributes || {}
                        const displayNameOffer = attrs.display_name__limio || offer.name || "Plan"
                        const displayPrice = attrs.display_price__limio || ""
                        const detailedPrice = attrs.detailed_display_price__limio || ""
                        const features = attrs.offer_features__limio || ""
                        const ctaText = attrs.cta_text__limio || "Resubscribe"
                        const isBestValue = attrs.best_value__limio
                        const badge = attrs.badge_text__limio

                        return (
                            <div
                                className={`wb-offer-card ${isBestValue ? "wb-offer-card--featured" : ""}`}
                                key={offer.id || i}
                            >
                                {badge && <div className="wb-offer-badge">{badge}</div>}
                                <div className="wb-offer-content">
                                    <h4 className="wb-offer-name">{displayNameOffer}</h4>
                                    {displayPrice && (
                                        <div
                                            className="wb-offer-price"
                                            dangerouslySetInnerHTML={{ __html: xss(displayPrice) }}
                                        />
                                    )}
                                    {showDetailedPrice && detailedPrice && (
                                        <div
                                            className="wb-offer-detailed-price"
                                            dangerouslySetInnerHTML={{ __html: xss(detailedPrice) }}
                                        />
                                    )}
                                    {showFeatures && features && (
                                        <div
                                            className="wb-offer-features"
                                            dangerouslySetInnerHTML={{ __html: xss(features) }}
                                        />
                                    )}
                                </div>
                                <button
                                    className={`wb-btn wb-btn--cta ${isBestValue ? "wb-btn--featured" : ""}`}
                                    type="button"
                                    disabled={basketLoading}
                                    onClick={() => handleResubscribe(offer)}
                                    style={isBestValue ? {
                                        backgroundColor: primaryColor,
                                        color: getContrastColor(primaryColor)
                                    } : undefined}
                                >
                                    {ctaText}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer */}
            {footerMessage && (
                <div className="wb-footer">
                    <p className="wb-footer-text">
                        {footerMessage}
                        {footerLinkUrl && footerLinkText && (
                            <>
                                {" "}
                                <a href={footerLinkUrl} className="wb-footer-link">{footerLinkText}</a>
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}

export default WinBack
