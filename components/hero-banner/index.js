import React, { useState, useMemo } from "react"
import { useCampaign, useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitizeString = (str) => xss(str || "")

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const parseFeatures = (html) =>
    html
        .split(/<li[^>]*>|<\/li>/gi)
        .filter(item => item.trim() && !item.includes("<ul") && !item.includes("</ul"))
        .map(item => item.replace(/<[^>]*>/g, "").trim())
        .filter(item => item.length > 0)

const getOfferImage = (offer) => {
    const attachments = offer?.data?.attachments || []
    const img = attachments.find(a => a.type?.startsWith("image"))
    return img?.url || null
}

const WireframeBackground = ({ primaryColor, secondaryColor }) => {
    const dots = useMemo(() => {
        const result = []
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                result.push({
                    cx: col * 80 + 40,
                    cy: row * 80 + 40,
                    delay: ((row * 8 + col) * 0.5) % 4,
                    mobile: row < 3,
                })
            }
        }
        return result
    }, [])

    return (
        <div className="hb-wireframe" aria-hidden="true">
            <svg className="hb-wireframe__svg" width="100%" height="100%">
                <defs>
                    <pattern id="hb-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect className="hb-wireframe__grid" width="100%" height="100%" fill="url(#hb-grid)" />
                {dots.map((dot, i) => (
                    <circle
                        key={i}
                        className={`hb-wireframe__dot${dot.mobile ? "" : " hb-wireframe__dot--desktop"}`}
                        cx={dot.cx}
                        cy={dot.cy}
                        r="2"
                        fill={i % 2 === 0 ? primaryColor : secondaryColor}
                        style={{ animationDelay: `${dot.delay}s` }}
                    />
                ))}
            </svg>
        </div>
    )
}

const SidebarCard = ({ offer, isSelected, primaryColor, secondaryColor, onClick }) => {
    const attributes = offer?.data?.attributes || {}
    const name = attributes.display_name__limio || "Plan"
    const price = attributes.display_price__limio || ""

    return (
        <button
            className={`hb-sidebar__card${isSelected ? " hb-sidebar__card--selected" : ""}`}
            style={isSelected ? { "--hb-accent-from": primaryColor, "--hb-accent-to": secondaryColor } : {}}
            onClick={onClick}
            aria-pressed={isSelected}
        >
            <span className="hb-sidebar__card-name">{name}</span>
            <span
                className="hb-sidebar__card-price"
                dangerouslySetInnerHTML={{ __html: sanitizeString(price) }}
            />
        </button>
    )
}

const OfferContent = ({ offer, primaryColor, secondaryColor, ctaOverride }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } = useBasket() || {}

    const attributes = offer?.data?.attributes || {}
    const name = attributes.display_name__limio || "Plan"
    const price = attributes.display_price__limio || ""
    const detailedPrice = attributes.detailed_display_price__limio || ""
    const features = attributes.offer_features__limio || ""
    const badgeText = attributes.badge_text__limio || ""
    const ctaText = ctaOverride || attributes.cta_text__limio || "Get started"
    const image = getOfferImage(offer)

    const featuresList = useMemo(() => parseFeatures(features), [features])

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

    return (
        <div className="hb-content__inner hb-content__fade-in">
            <div className="hb-content__details">
                {badgeText && (
                    <span
                        className="hb-content__badge"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                        {badgeText}
                    </span>
                )}

                <h2 className="hb-content__name">{name}</h2>

                <div
                    className="hb-content__price"
                    dangerouslySetInnerHTML={{ __html: sanitizeString(price) }}
                />

                {detailedPrice && (
                    <div
                        className="hb-content__detailed-price"
                        dangerouslySetInnerHTML={{ __html: sanitizeString(detailedPrice) }}
                    />
                )}

                {featuresList.length > 0 && (
                    <ul className="hb-content__features">
                        {featuresList.map((feature, i) => (
                            <li key={i} className="hb-content__feature">
                                <span className="hb-content__feature-icon" style={{ color: primaryColor }}>
                                    <CheckIcon />
                                </span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="hb-content__cta"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    onClick={handleAddToBasket}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : ctaText}
                </button>
            </div>

            {image && (
                <div className="hb-content__image-wrap">
                    <img className="hb-content__image" src={image} alt={name} />
                </div>
            )}
        </div>
    )
}

const HeroBanner = () => {
    const { offers } = useCampaign() || {}
    const props = useStaticProps() || {}

    const {
        headline = "Choose Your Plan",
        subheadline = "Select a plan to explore features and pricing",
        primaryColor__limio_color: primaryColor = "#F96D24",
        secondaryColor__limio_color: secondaryColor = "#CC3A5E",
        backgroundColor__limio_color: backgroundColor = "#0a0a14",
        showWireframe = true,
        ctaText = "",
        sidebarPosition = "left",
    } = props

    const [selectedIndex, setSelectedIndex] = useState(0)

    const offerList = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return []
        return offers
    }, [offers])

    const selectedOffer = offerList[selectedIndex] || null

    if (offerList.length === 0) return null

    const isRight = sidebarPosition === "right"

    return (
        <section
            className="hb-hero"
            style={{
                "--hb-primary": primaryColor,
                "--hb-secondary": secondaryColor,
                "--hb-bg": backgroundColor,
            }}
        >
            {showWireframe && (
                <WireframeBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />
            )}

            <div className="hb-hero__container">
                <header className="hb-hero__header">
                    <h1 className="hb-hero__headline">{headline}</h1>
                    <p className="hb-hero__subheadline">{subheadline}</p>
                </header>

                <div className={`hb-hero__layout${isRight ? " hb-hero__layout--reverse" : ""}`}>
                    <nav className="hb-sidebar" aria-label="Offer selection">
                        {offerList.map((offer, i) => (
                            <SidebarCard
                                key={offer?.id || i}
                                offer={offer}
                                isSelected={i === selectedIndex}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                onClick={() => setSelectedIndex(i)}
                            />
                        ))}
                    </nav>

                    <div className="hb-content">
                        {selectedOffer && (
                            <OfferContent
                                key={selectedOffer?.id || selectedIndex}
                                offer={selectedOffer}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                ctaOverride={ctaText}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroBanner
