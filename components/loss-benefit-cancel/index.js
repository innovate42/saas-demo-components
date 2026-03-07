import React from "react"
import { useSubscriptions, useLimioContext, getCurrentOffer, sanitiseHTML } from "@limio/sdk"
import { checkActiveOffers } from "@limio/sdk/offers"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

function getActiveAddOns(subscription) {
    const addOns = subscription?.addOns
    if (!Array.isArray(addOns) || addOns.length === 0) return []

    const now = new Date()
    return addOns.filter(addOn => {
        if (!["active", "pending", "pending-external"].includes(addOn.status)) return false
        const end = addOn?.data?.end ? new Date(addOn.data.end) : null
        const start = addOn?.data?.start ? new Date(addOn.data.start) : null
        if (start && start > now) return false
        if (end && end < now) return false
        return true
    })
}

function getAddOnDisplayName(addOn) {
    return addOn?.data?.add_on?.data?.attributes?.display_name__limio
        || addOn?.data?.add_on?.name
        || addOn?.name
        || ""
}

function getOfferAttributes(offer) {
    return offer?.data?.offer?.data?.attributes
        || offer?.data?.attributes
        || null
}

function OfferCard({ attrs, offerName, addOns, featuresField, fallbackFeaturesHtml, showPlanName, showPrice }) {
    const featuresHtml = attrs?.[featuresField] || fallbackFeaturesHtml
    const planName = attrs?.display_name__limio || offerName || ""
    const displayPrice = attrs?.display_price__limio || ""

    return (
        <div className="lbc-card">
            <div className="lbc-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            </div>

            {showPlanName && planName && (
                <div className="lbc-plan-badge">
                    <span className="lbc-plan-name">{planName}</span>
                    {showPrice && displayPrice && (
                        <span
                            className="lbc-plan-price"
                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(displayPrice) }}
                        />
                    )}
                </div>
            )}

            <div className="lbc-features">
                <div
                    className="lbc-features-list"
                    dangerouslySetInnerHTML={{ __html: sanitiseHTML(featuresHtml) }}
                />
            </div>

            {addOns.length > 0 && (
                <div className="lbc-addons">
                    <p className="lbc-addons-label">Add-ons you'll also lose:</p>
                    <ul className="lbc-addons-list">
                        {addOns.map((addOn, i) => (
                            <li key={i} className="lbc-addon-item">
                                {getAddOnDisplayName(addOn)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function LossBenefitCancel() {
    const { isInPageBuilder } = useLimioContext() || {}
    const { subscriptions } = useSubscriptions() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Here's what you'll lose",
        subheading = "If you cancel your subscription, you'll no longer have access to these features:",
        primaryColor = "#002C5F",
        fallbackFeatures__limio_richtext = "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
        showPlanName = true,
        showPrice = true,
        offerFeaturesField = "offer_features__limio",
    } = props

    // Get subscription from URL param or use the first active one
    let subscription = null
    if (!isInPageBuilder && typeof window !== "undefined") {
        try {
            const params = new URL(window.location).searchParams
            const subId = params.get("subId") || ""
            const subRef = params.get("subRef") || ""
            if (subId && Array.isArray(subscriptions)) {
                subscription = subscriptions.find(s => s?.id === subId) || null
            }
            if (!subscription && subRef && Array.isArray(subscriptions)) {
                subscription = subscriptions.find(s => s?.reference === subRef) || null
            }
        } catch (e) {
            // window.location may not be available in some contexts
        }
    }

    // Fallback to first active subscription
    if (!subscription && Array.isArray(subscriptions) && subscriptions.length > 0) {
        subscription = subscriptions.find(s => s?.status === "active") || subscriptions[0]
    }

    // Get active non-discount offers from the subscription
    const allActiveOffers = checkActiveOffers(subscription?.offers || [])
        .filter(o => o.data?.record_subtype !== "discount")

    // For single-offer, use getCurrentOffer which unwraps to offer data directly
    // For multi-offer, use the wrapped offers from checkActiveOffers
    const offers = allActiveOffers.length > 1
        ? allActiveOffers.map(o => ({ attrs: getOfferAttributes(o), name: o.name }))
        : [{ attrs: getOfferAttributes(getCurrentOffer(subscription) || {}), name: subscription?.name }]

    const activeAddOns = getActiveAddOns(subscription)

    return (
        <section
            className="lbc-container"
            style={{ "--lbc-primary": primaryColor }}
        >
            <h2 className="lbc-heading">{heading}</h2>
            <p className="lbc-subheading">{subheading}</p>

            <div className={offers.length > 1 ? "lbc-cards-stack" : ""}>
                {offers.map((offer, i) => (
                    <OfferCard
                        key={i}
                        attrs={offer.attrs}
                        offerName={offer.name}
                        addOns={i === 0 ? activeAddOns : []}
                        featuresField={offerFeaturesField}
                        fallbackFeaturesHtml={fallbackFeatures__limio_richtext}
                        showPlanName={showPlanName}
                        showPrice={showPrice}
                    />
                ))}
            </div>
        </section>
    )
}

export default LossBenefitCancel
