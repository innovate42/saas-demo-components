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
    const { nodes, edges } = useMemo(() => {
        const cols = 8
        const rows = 5
        const W = 1600
        const H = 900
        const padX = 80
        const padY = 80
        const spacingX = (W - padX * 2) / (cols - 1)
        const spacingY = (H - padY * 2) / (rows - 1)
        const seed = 42
        const seededRandom = (i) => {
            const x = Math.sin(seed + i * 127.1) * 43758.5453
            return x - Math.floor(x)
        }

        const nodeList = []
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const idx = r * cols + c
                const jitterX = (seededRandom(idx * 2) - 0.5) * spacingX * 0.45
                const jitterY = (seededRandom(idx * 2 + 1) - 0.5) * spacingY * 0.45
                nodeList.push({
                    x: padX + c * spacingX + jitterX,
                    y: padY + r * spacingY + jitterY,
                    delay: seededRandom(idx * 3) * 8,
                    size: seededRandom(idx * 7) > 0.7 ? 5 : 3,
                    isAccent: seededRandom(idx * 7) > 0.7,
                })
            }
        }

        const edgeList = []
        const threshold = spacingX * 1.5
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = i + 1; j < nodeList.length; j++) {
                const dx = nodeList[i].x - nodeList[j].x
                const dy = nodeList[i].y - nodeList[j].y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < threshold) {
                    edgeList.push({
                        x1: nodeList[i].x,
                        y1: nodeList[i].y,
                        x2: nodeList[j].x,
                        y2: nodeList[j].y,
                        delay: (nodeList[i].delay + nodeList[j].delay) / 2,
                    })
                }
            }
        }

        return { nodes: nodeList, edges: edgeList }
    }, [])

    return (
        <div className="hb-wireframe" aria-hidden="true">
            <svg className="hb-wireframe__svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <filter id="hb-glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {edges.map((edge, i) => (
                    <line
                        key={`e${i}`}
                        className="hb-wireframe__line"
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke={primaryColor}
                        strokeWidth="0.8"
                        style={{ animationDelay: `${edge.delay}s` }}
                    />
                ))}
                {nodes.map((node, i) => (
                    <circle
                        key={`n${i}`}
                        className="hb-wireframe__dot"
                        cx={node.x}
                        cy={node.y}
                        r={node.size}
                        fill={node.isAccent ? secondaryColor : primaryColor}
                        filter="url(#hb-glow)"
                        style={{ animationDelay: `${node.delay}s` }}
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
