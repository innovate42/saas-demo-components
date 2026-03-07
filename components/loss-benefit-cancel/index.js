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

function getAddOnPrice(addOn) {
    return addOn?.data?.add_on?.data?.attributes?.display_price__limio
        || addOn?.data?.display_price__limio
        || ""
}

function getAddOnFeatures(addOn) {
    return addOn?.data?.add_on?.data?.attributes?.offer_features__limio || ""
}

function getOfferAttributes(offer) {
    return offer?.data?.offer?.data?.attributes
        || offer?.data?.attributes
        || null
}

function OfferCard({ attrs, offerName, featuresField, fallbackFeaturesHtml, showPlanName, showPrice }) {
    const featuresHtml = attrs?.[featuresField] || fallbackFeaturesHtml
    const planName = attrs?.display_name__limio || offerName || ""
    const displayPrice = attrs?.display_price__limio || ""

    return (
        <div className="lbc-card">
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

            <p className="lbc-card-description">If you cancel your subscription, you'll no longer have access to these features:</p>

            <div className="lbc-features">
                <div
                    className="lbc-features-list"
                    dangerouslySetInnerHTML={{ __html: sanitiseHTML(featuresHtml) }}
                />
            </div>
        </div>
    )
}

function AddOnCard({ addOn, featuresField, fallbackFeaturesHtml, showPlanName, showPrice }) {
    const name = getAddOnDisplayName(addOn)
    const price = getAddOnPrice(addOn)
    const featuresHtml = getAddOnFeatures(addOn) || fallbackFeaturesHtml

    return (
        <div className="lbc-card">
            {showPlanName && name && (
                <div className="lbc-plan-badge">
                    <span className="lbc-plan-name">{name}</span>
                    <span className="lbc-addon-tag">Add-on</span>
                    {showPrice && price && (
                        <span
                            className="lbc-plan-price"
                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(price) }}
                        />
                    )}
                </div>
            )}

            <p className="lbc-card-description">You'll also lose access to this add-on:</p>

            <div className="lbc-features">
                <div
                    className="lbc-features-list"
                    dangerouslySetInnerHTML={{ __html: sanitiseHTML(featuresHtml) }}
                />
            </div>
        </div>
    )
}

function LossBenefitCancel() {
    const { isInPageBuilder } = useLimioContext() || {}
    const { subscriptions } = useSubscriptions() || {}
    const props = useStaticProps() || {}

    const {
        heading = "Here's what you'll lose",
        addOnsHeading = "You will also lose",
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

    const hasAddOns = activeAddOns.length > 0

    return (
        <section
            className="lbc-container"
            style={{ "--lbc-primary": primaryColor }}
        >
            <h2 className="lbc-heading">{heading}</h2>

            <div className="lbc-cards-stack">
                {offers.map((offer, i) => (
                    <OfferCard
                        key={i}
                        attrs={offer.attrs}
                        offerName={offer.name}
                        featuresField={offerFeaturesField}
                        fallbackFeaturesHtml={fallbackFeatures__limio_richtext}
                        showPlanName={showPlanName}
                        showPrice={showPrice}
                    />
                ))}

                {hasAddOns && (
                    <>
                        <h3 className="lbc-addons-heading">{addOnsHeading}</h3>
                        {activeAddOns.map((addOn, i) => (
                            <AddOnCard
                                key={i}
                                addOn={addOn}
                                featuresField={offerFeaturesField}
                                fallbackFeaturesHtml={fallbackFeatures__limio_richtext}
                                showPlanName={showPlanName}
                                showPrice={showPrice}
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default LossBenefitCancel
