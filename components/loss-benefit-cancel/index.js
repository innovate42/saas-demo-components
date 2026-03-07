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

function getAddOnAttributes(addOn) {
    return addOn?.data?.add_on?.data?.attributes || {}
}

function BenefitCard({ name, price, featuresHtml, description, badge, showPlanName, showPrice }) {
    return (
        <div className="lbc-card">
            {showPlanName && name && (
                <div className="lbc-plan-badge">
                    <span className="lbc-plan-name">{name}</span>
                    {badge && <span className="lbc-addon-tag">{badge}</span>}
                    {showPrice && price && (
                        <span
                            className="lbc-plan-price"
                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(price) }}
                        />
                    )}
                </div>
            )}

            <p className="lbc-card-description">{description}</p>

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
        subheading = "If you cancel your subscription, you'll no longer have access to these features:",
        addOnsHeading = "You will also lose",
        addOnDescription = "You'll also lose access to this add-on:",
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

    // Build offer card data - use checkActiveOffers results, fall back to getCurrentOffer
    const offers = allActiveOffers.length > 0
        ? allActiveOffers.map(o => {
            const attrs = o?.data?.offer?.data?.attributes || o?.data?.attributes || {}
            return { attrs, name: o.name }
        })
        : [{
            attrs: (getCurrentOffer(subscription) || {})?.data?.attributes || {},
            name: subscription?.name,
        }]

    const activeAddOns = getActiveAddOns(subscription)

    return (
        <section
            className="lbc-container"
            style={{ "--lbc-primary": primaryColor }}
        >
            <h2 className="lbc-heading">{heading}</h2>

            <div className="lbc-cards-stack">
                {offers.map((offer, i) => {
                    const featuresHtml = offer.attrs?.[offerFeaturesField] || fallbackFeatures__limio_richtext
                    const planName = offer.attrs?.display_name__limio || offer.name || ""
                    const displayPrice = offer.attrs?.display_price__limio || ""

                    return (
                        <BenefitCard
                            key={i}
                            name={planName}
                            price={displayPrice}
                            featuresHtml={featuresHtml}
                            description={subheading}
                            showPlanName={showPlanName}
                            showPrice={showPrice}
                        />
                    )
                })}

                {activeAddOns.length > 0 && (
                    <>
                        <h3 className="lbc-addons-heading">{addOnsHeading}</h3>
                        {activeAddOns.map((addOn, i) => {
                            const attrs = getAddOnAttributes(addOn)
                            const name = attrs.display_name__limio || addOn?.data?.add_on?.name || addOn?.name || ""
                            const price = attrs.display_price__limio || ""
                            const featuresHtml = attrs[offerFeaturesField] || fallbackFeatures__limio_richtext

                            return (
                                <BenefitCard
                                    key={i}
                                    name={name}
                                    price={price}
                                    featuresHtml={featuresHtml}
                                    description={addOnDescription}
                                    badge="Add-on"
                                    showPlanName={showPlanName}
                                    showPrice={showPrice}
                                />
                            )
                        })}
                    </>
                )}
            </div>
        </section>
    )
}

export default LossBenefitCancel
