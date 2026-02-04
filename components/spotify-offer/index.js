import React from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")

const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000"
    const hex = hexColor.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

const SpotifyOffer = () => {
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
        headline = "Get Premium",
        subheadline = "1 account, just for you",
        badgeText = "1 month free",
        showBadge = true,
        footerText__limio_richtext: footerText = "<p>Terms apply.</p>",
        backgroundColor__limio_color: backgroundColor = "#121212",
        cardBackgroundColor__limio_color: cardBackgroundColor = "#242424",
        textColor__limio_color: textColor = "#FFFFFF",
        mutedTextColor__limio_color: mutedTextColor = "#A7A7A7",
        accentColor__limio_color: accentColor = "#1ED760"
    } = props

    // Get the first (and only) offer
    const offer = offers?.[0]
    const attributes = offer?.data?.attributes || {}
    const attachments = offer?.data?.attachments || []

    const displayName = attributes.display_name__limio || "Premium"
    const displayPrice = attributes.display_price__limio || ""
    const detailedPrice = attributes.detailed_display_price__limio || ""
    const features = attributes.offer_features__limio || ""
    const ctaText = attributes.cta_text__limio || "Get Started"
    const badge = attributes.badge_text__limio || badgeText

    const imageAttachment = attachments.find(a =>
        a.type === "image" || (a.url && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(a.url))
    )

    const buttonTextColor = getContrastColor(accentColor)

    const handleAddToBasket = async () => {
        if (basketLoading || !offer) return

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
        <section className="spotify-offer" id="offer" style={{ backgroundColor }}>
            <div className="spotify-offer__container">
                <header className="spotify-offer__header">
                    <h2 className="spotify-offer__headline" style={{ color: textColor }}>
                        {headline}
                    </h2>
                    <p className="spotify-offer__subheadline" style={{ color: mutedTextColor }}>
                        {subheadline}
                    </p>
                </header>

                {!offer ? (
                    <p className="spotify-offer__empty" style={{ color: mutedTextColor }}>
                        No offer available at this time.
                    </p>
                ) : (
                    <div className="spotify-offer__card" style={{ backgroundColor: cardBackgroundColor }}>
                        <div className="spotify-offer__accent" style={{ backgroundColor: accentColor }} />

                        {imageAttachment && (
                            <img
                                src={imageAttachment.url}
                                alt={displayName}
                                className="spotify-offer__card-image"
                            />
                        )}

                        <div className="spotify-offer__card-body">
                            {showBadge && badge && (
                                <span
                                    className="spotify-offer__badge"
                                    style={{
                                        backgroundColor: accentColor,
                                        color: buttonTextColor
                                    }}
                                >
                                    {badge}
                                </span>
                            )}

                            <h3 className="spotify-offer__name" style={{ color: textColor }}>
                                {displayName}
                            </h3>

                            <div className="spotify-offer__price">
                                <div
                                    className="spotify-offer__price-value"
                                    style={{ color: textColor }}
                                    dangerouslySetInnerHTML={{ __html: sanitizeString(displayPrice) }}
                                />
                                {detailedPrice && (
                                    <div
                                        className="spotify-offer__price-detail"
                                        style={{ color: mutedTextColor }}
                                        dangerouslySetInnerHTML={{ __html: sanitizeString(detailedPrice) }}
                                    />
                                )}
                            </div>

                            <div className="spotify-offer__divider" />

                            {features && (
                                <div
                                    className="spotify-offer__features"
                                    style={{ color: textColor }}
                                    dangerouslySetInnerHTML={{ __html: sanitizeString(features) }}
                                />
                            )}

                            <button
                                className="spotify-offer__cta"
                                style={{
                                    backgroundColor: accentColor,
                                    color: buttonTextColor
                                }}
                                onClick={handleAddToBasket}
                                disabled={basketLoading}
                            >
                                {basketLoading ? "Processing..." : ctaText}
                            </button>
                        </div>
                    </div>
                )}

                {footerText && (
                    <div
                        className="spotify-offer__footer"
                        style={{ color: mutedTextColor }}
                        dangerouslySetInnerHTML={{ __html: sanitizeString(footerText) }}
                    />
                )}
            </div>
        </section>
    )
}

export default SpotifyOffer
