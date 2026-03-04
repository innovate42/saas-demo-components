import React, { useState, useMemo } from "react"
import { useCampaign, useBasket, useLimioContext } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const sanitize = (str) => xss(str || "")

const getContrastColor = (hex) => {
    if (!hex) return "#fff"
    const c = hex.replace("#", "")
    const r = parseInt(c.substr(0, 2), 16)
    const g = parseInt(c.substr(2, 2), 16)
    const b = parseInt(c.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#1B1D2A" : "#FFFFFF"
}

/* ─── Comparison Table Feature Data ─── */
const COMPARISON_FEATURES = {
    products: [
        { label: "Graph / Link analysis", values: ["Community", true, true, true] },
        { label: "Search / OSINT lookups", values: [false, "Limited", "Unlimited", "Unlimited"] },
        { label: "Monitor / Continuous monitoring", values: [false, false, false, true] },
        { label: "Evidence / Case management", values: [false, false, false, true] },
        { label: "Web capture", values: [false, true, true, true] },
    ],
    data: [
        { label: "Monthly credits", values: ["200", "10,000", "25,000", "40,000+"] },
        { label: "Open-source data connectors", values: [true, true, true, true] },
        { label: "Commercial data access", values: [false, "Standard", "Standard + Advanced", "Full catalog"] },
        { label: "Custom data integrations", values: [false, false, true, true] },
        { label: "API access", values: [false, false, true, true] },
    ],
    services: [
        { label: "Community support", values: [true, true, true, true] },
        { label: "Email support", values: [false, true, true, true] },
        { label: "Priority support", values: [false, false, true, true] },
        { label: "Dedicated account manager", values: [false, false, false, true] },
        { label: "Training & onboarding", values: [false, false, true, true] },
        { label: "SLA guarantee", values: [false, false, false, true] },
    ],
}

/* ─── FAQ Answers ─── */
const FAQ_ANSWERS = {
    trial: "Yes! Our Basic plan is free forever. For paid plans, we offer a 14-day free trial so you can explore all features before committing.",
    upgrade: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    cancel: "You can cancel your subscription at any time. Your access continues until the end of the current billing period — no questions asked.",
    payment: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans.",
    discount: "Yes! Annual billing saves you up to 20% compared to monthly pricing. The discount is applied automatically when you choose annual billing.",
}

/* ─── Sub-components ─── */

const GroupToggle = ({ labels, selected, onChange, primaryColor }) => {
    if (!labels || labels.length < 2) return null
    return (
        <div className="mp-toggle">
            {labels.map((item) => (
                <button
                    key={item.id}
                    className={`mp-toggle__btn ${selected === item.id ? "mp-toggle__btn--active" : ""}`}
                    style={selected === item.id ? { background: primaryColor, color: getContrastColor(primaryColor) } : {}}
                    onClick={() => onChange(item.id)}
                >
                    {item.label}
                    {item.id === "annual" && <span className="mp-toggle__save">Save 20%</span>}
                </button>
            ))}
        </div>
    )
}

const PricingCard = ({ offer, index, totalOffers, isBestValue, bestValueLabel, bestValueColor, primaryColor, ctaText, freeCta, enterpriseCta, onAdd, loading }) => {
    const attrs = offer?.data?.attributes || {}
    const displayName = attrs.display_name__limio || offer?.name || "Plan"
    const displayPrice = attrs.display_price__limio || ""
    const detailedPrice = attrs.detailed_display_price__limio || ""
    const features = attrs.offer_features__limio || ""
    const badge = attrs.badge_text__limio || ""
    const cta = attrs.cta_text__limio || (index === 0 ? freeCta : index === totalOffers - 1 ? enterpriseCta : ctaText)
    const isEnterprise = index === totalOffers - 1
    const isFree = index === 0

    return (
        <div className={`mp-card ${isBestValue ? "mp-card--featured" : ""}`} style={isBestValue ? { borderColor: bestValueColor } : {}}>
            {(isBestValue || badge) && (
                <div className="mp-card__badge" style={{ background: bestValueColor, color: getContrastColor(bestValueColor) }}>
                    {badge || bestValueLabel}
                </div>
            )}
            <div className="mp-card__header">
                <h3 className="mp-card__name">{displayName}</h3>
                {displayPrice ? (
                    <div className="mp-card__price" dangerouslySetInnerHTML={{ __html: sanitize(displayPrice) }} />
                ) : isEnterprise ? (
                    <div className="mp-card__price"><span className="mp-card__price-custom">Custom</span></div>
                ) : null}
                {detailedPrice && (
                    <div className="mp-card__detail" dangerouslySetInnerHTML={{ __html: sanitize(detailedPrice) }} />
                )}
            </div>
            <button
                className={`mp-card__cta ${isBestValue ? "mp-card__cta--primary" : ""} ${isFree ? "mp-card__cta--outline" : ""}`}
                style={isBestValue ? { background: primaryColor, borderColor: primaryColor, color: getContrastColor(primaryColor) } : {}}
                onClick={() => onAdd(offer)}
                disabled={loading}
            >
                {cta}
            </button>
            {features && (
                <div className="mp-card__features" dangerouslySetInnerHTML={{ __html: sanitize(features) }} />
            )}
        </div>
    )
}

const ComparisonTable = ({ offers, featureCategories, comparisonHeadline, primaryColor }) => {
    const tierNames = useMemo(() => {
        return (offers || []).map((o) => o?.data?.attributes?.display_name__limio || o?.name || "Plan")
    }, [offers])

    return (
        <div className="mp-compare" id="comparison">
            <h2 className="mp-compare__title">{comparisonHeadline}</h2>
            <div className="mp-compare__scroll">
                <table className="mp-compare__table">
                    <thead>
                        <tr>
                            <th className="mp-compare__th mp-compare__th--feature">Feature</th>
                            {tierNames.map((name, i) => (
                                <th key={i} className="mp-compare__th">{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(featureCategories || []).map((cat) => {
                            const features = COMPARISON_FEATURES[cat.id] || []
                            if (!features.length) return null
                            return (
                                <React.Fragment key={cat.id}>
                                    <tr className="mp-compare__cat-row">
                                        <td colSpan={tierNames.length + 1} className="mp-compare__cat" style={{ color: primaryColor }}>
                                            {cat.label}
                                        </td>
                                    </tr>
                                    {features.map((feat, fi) => (
                                        <tr key={fi} className="mp-compare__row">
                                            <td className="mp-compare__feat">{feat.label}</td>
                                            {feat.values.slice(0, tierNames.length).map((val, vi) => (
                                                <td key={vi} className="mp-compare__val">
                                                    {val === true ? (
                                                        <svg className="mp-compare__check" viewBox="0 0 20 20" fill="none">
                                                            <circle cx="10" cy="10" r="10" fill={primaryColor + "1A"} />
                                                            <path d="M6 10.5L9 13.5L14 7.5" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : val === false ? (
                                                        <span className="mp-compare__dash">—</span>
                                                    ) : (
                                                        <span className="mp-compare__text">{val}</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const FaqSection = ({ faqHeadline, faqItems, primaryColor }) => {
    const [openId, setOpenId] = useState(null)

    return (
        <div className="mp-faq">
            <h2 className="mp-faq__title">{faqHeadline}</h2>
            <div className="mp-faq__list">
                {(faqItems || []).map((item) => {
                    const isOpen = openId === item.id
                    const answer = FAQ_ANSWERS[item.id] || "Please contact us for more information about this topic."
                    return (
                        <div key={item.id} className={`mp-faq__item ${isOpen ? "mp-faq__item--open" : ""}`}>
                            <button
                                className="mp-faq__question"
                                onClick={() => setOpenId(isOpen ? null : item.id)}
                                style={isOpen ? { color: primaryColor } : {}}
                            >
                                <span>{item.label}</span>
                                <svg className={`mp-faq__chevron ${isOpen ? "mp-faq__chevron--open" : ""}`} viewBox="0 0 20 20" fill="none">
                                    <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {isOpen && (
                                <div className="mp-faq__answer">
                                    <p>{answer}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ─── Main Component ─── */

const MaltegoPricing = () => {
    const { offers } = useCampaign() || {}
    const { initiateCheckout, addOfferToBasket, navigateToCheckout, basketLoading } = useBasket() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}

    const {
        darkMode = false,
        showHero = true,
        heroImage = "",
        heroImageAlt = "Product preview",
        showLearnMoreButton = true,
        learnMoreText = "Learn more",
        learnMoreUrl = "#",
        headline = "Explore plans that power your business",
        subheadline = "Choose the plan that fits your needs.",
        showComparisonTable = true,
        showFaq = true,
        showGroupToggle = true,
        ctaText = "Get started",
        freeCta = "Use for free",
        enterpriseCta = "Book a demo",
        bestValueLabel = "Best Value",
        primaryColor: primaryColorProp = "#EFBF04",
        bestValueColor: bestValueColorProp = "#EFBF04",
        backgroundColor: backgroundColorProp = "#FFFFFF",
        cardColor: cardColorProp = "#FFFFFF",
        textColor: textColorProp = "#1B2438",
        mutedTextColor: mutedTextColorProp = "#5A6175",
        faqHeadline = "Frequently asked questions",
        comparisonHeadline = "Compare all features",
        groupLabels = [],
        featureCategories = [],
        faqItems = [],
    } = props

    // Apply dark mode overrides (Maltego yellow stays)
    const primaryColor = darkMode ? "#EFBF04" : primaryColorProp
    const bestValueColor = darkMode ? "#EFBF04" : bestValueColorProp
    const backgroundColor = darkMode ? "#0E1117" : backgroundColorProp
    const cardColor = darkMode ? "#161B27" : cardColorProp
    const textColor = darkMode ? "#F0F2F7" : textColorProp
    const mutedTextColor = darkMode ? "#8B92A5" : mutedTextColorProp

    // Group offers by group__limio
    const grouped = useMemo(() => {
        if (!offers) return {}
        const groups = {}
        offers.forEach((offer) => {
            const g = offer?.data?.attributes?.group__limio || "default"
            if (!groups[g]) groups[g] = []
            groups[g].push(offer)
        })
        return groups
    }, [offers])

    const availableGroups = useMemo(() => {
        const keys = Object.keys(grouped)
        if (groupLabels?.length > 0) return groupLabels.filter((l) => keys.includes(l.id))
        return keys.map((k) => ({ id: k, label: k }))
    }, [grouped, groupLabels])

    const [selectedGroup, setSelectedGroup] = useState(availableGroups[0]?.id || "")

    const displayOffers = useMemo(() => {
        if (showGroupToggle && selectedGroup && grouped[selectedGroup]) {
            return grouped[selectedGroup]
        }
        return offers || []
    }, [showGroupToggle, selectedGroup, grouped, offers])

    // Find best value offer
    const bestValueIndex = useMemo(() => {
        return displayOffers.findIndex((o) => o?.data?.attributes?.best_value__limio)
    }, [displayOffers])

    const handleAdd = async (offer) => {
        if (basketLoading) return
        const checkoutId = getCurrentBasketId()
        if (!checkoutId) {
            await initiateCheckout({ order: { orderItems: [{ offer }] } })
        } else {
            await addOfferToBasket({ offer })
        }
        await navigateToCheckout()
    }

    if (!offers?.length) return null

    return (
        <section
            className={`mp${darkMode ? " mp--dark" : ""}`}
            style={{
                "--mp-primary": primaryColor,
                "--mp-best-value": bestValueColor,
                "--mp-bg": backgroundColor,
                "--mp-card": cardColor,
                "--mp-text": textColor,
                "--mp-muted": mutedTextColor,
            }}
        >
            {/* Hero */}
            {showHero && (
                <div className="mp-hero">
                    {heroImage && (
                        <div className="mp-hero__image-wrap">
                            <img src={heroImage} alt={heroImageAlt} className="mp-hero__image" />
                        </div>
                    )}
                    <h1 className="mp-hero__title">{headline}</h1>
                    <p className="mp-hero__sub">{subheadline}</p>
                    {showLearnMoreButton && (
                        <a href={learnMoreUrl} className="mp-hero__learnmore" style={{ color: primaryColor, borderColor: primaryColor }}>
                            {learnMoreText}
                        </a>
                    )}
                    {showGroupToggle && availableGroups.length > 1 && (
                        <GroupToggle
                            labels={availableGroups}
                            selected={selectedGroup}
                            onChange={setSelectedGroup}
                            primaryColor={primaryColor}
                        />
                    )}
                </div>
            )}

            {/* Cards */}
            <div className="mp-cards" style={{ "--mp-card-count": displayOffers.length }}>
                {displayOffers.map((offer, i) => (
                    <PricingCard
                        key={offer?.id || i}
                        offer={offer}
                        index={i}
                        totalOffers={displayOffers.length}
                        isBestValue={i === bestValueIndex}
                        bestValueLabel={bestValueLabel}
                        bestValueColor={bestValueColor}
                        primaryColor={primaryColor}
                        ctaText={ctaText}
                        freeCta={freeCta}
                        enterpriseCta={enterpriseCta}
                        onAdd={handleAdd}
                        loading={basketLoading}
                    />
                ))}
            </div>

            {/* See all features link */}
            {showComparisonTable && (
                <div className="mp-seeall">
                    <a href="#comparison" className="mp-seeall__link" style={{ color: primaryColor }}>
                        See all features
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            )}

            {/* Comparison Table */}
            {showComparisonTable && displayOffers.length > 0 && (
                <ComparisonTable
                    offers={displayOffers}
                    featureCategories={featureCategories}
                    comparisonHeadline={comparisonHeadline}
                    primaryColor={primaryColor}
                />
            )}

            {/* FAQ */}
            {showFaq && faqItems?.length > 0 && (
                <FaqSection faqHeadline={faqHeadline} faqItems={faqItems} primaryColor={primaryColor} />
            )}
        </section>
    )
}

export default MaltegoPricing
