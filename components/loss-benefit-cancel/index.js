import React from "react"
import { useSubscriptions, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

// Preview data shown in the Limio Page Builder when moustache templates are unresolved
const PAGE_BUILDER_PREVIEW = {
    planName: "Example Plan",
    displayPrice: "<p><strong>$9.99/month</strong></p>",
    featuresHtml: "<ul><li>Access to all plan features</li><li>Priority customer support</li><li>Monthly newsletter</li><li>Early access to new features</li></ul>",
    addOns: [{ name: "example Add-On", price: "<p>$4.99/month</p>" }],
}

function isMoustache(val) {
    return typeof val === "string" && val.includes("{{")
}

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
        offerFeatures__limio_richtext = "",
        fallbackFeatures__limio_richtext = "<ul><li>Access to all plan features</li><li>Customer support</li><li>Regular updates</li></ul>",
        planName = "",
        displayPrice = "",
        showPlanName = true,
        showPrice = true,
    } = props

    // In page builder, moustache templates aren't resolved — show preview data instead
    const resolvedPlanName = (isInPageBuilder && isMoustache(planName)) ? PAGE_BUILDER_PREVIEW.planName : planName
    const resolvedPrice = (isInPageBuilder && isMoustache(displayPrice)) ? PAGE_BUILDER_PREVIEW.displayPrice : displayPrice
    const resolvedFeatures = (isInPageBuilder && isMoustache(offerFeatures__limio_richtext))
        ? PAGE_BUILDER_PREVIEW.featuresHtml
        : (offerFeatures__limio_richtext || fallbackFeatures__limio_richtext)

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

    if (!subscription && Array.isArray(subscriptions) && subscriptions.length > 0) {
        subscription = subscriptions.find(s => s?.status === "active") || subscriptions[0]
    }

    // In page builder, show example add-on so the section is visible for configuration
    const activeAddOns = isInPageBuilder ? PAGE_BUILDER_PREVIEW.addOns : getActiveAddOns(subscription)

    return (
        <section className="lbc-container" style={{ "--lbc-primary": primaryColor }}>
            <div className="lbc-card">
                {showPlanName && resolvedPlanName && (
                    <div className="lbc-plan-badge">
                        <span className="lbc-plan-name">{resolvedPlanName}</span>
                        {showPrice && resolvedPrice && (
                            <span
                                className="lbc-plan-price"
                                dangerouslySetInnerHTML={{ __html: sanitiseHTML(resolvedPrice) }}
                            />
                        )}
                    </div>
                )}

                <h2 className="lbc-heading">{heading}</h2>
                <p className="lbc-subheading">{subheading}</p>

                <div className="lbc-features">
                    <div
                        className="lbc-features-list"
                        dangerouslySetInnerHTML={{ __html: sanitiseHTML(resolvedFeatures) }}
                    />
                </div>

                {activeAddOns.length > 0 && (
                    <div className="lbc-addons-section">
                        <h3 className="lbc-addons-heading">{addOnsHeading}</h3>
                        <p className="lbc-addons-description">{addOnDescription}</p>
                        {activeAddOns.map((addOn, i) => {
                            // Support both real add-on objects and page builder preview objects
                            const attrs = addOn?.data ? getAddOnAttributes(addOn) : {}
                            const name = attrs.display_name__limio || addOn?.data?.add_on?.name || addOn?.name || ""
                            const price = attrs.display_price__limio || addOn?.price || ""

                            return (
                                <div key={i} className="lbc-addon-item">
                                    <span className="lbc-addon-name">{name}</span>
                                    {showPrice && price && (
                                        <span
                                            className="lbc-addon-price"
                                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(price) }}
                                        />
                                    )}
                                    <span className="lbc-addon-tag">Add-on</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

export default LossBenefitCancel
