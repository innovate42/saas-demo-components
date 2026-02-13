import React, { useMemo } from "react"
import { useUser, useSubscriptions, useCampaign } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import xss from "xss"
import "./index.css"

const buildUrl = (baseUrl, subRef) => {
    if (!baseUrl) return ""
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}subRef=${encodeURIComponent(subRef)}`
}

const formatCurrency = (amount, currency) => {
    if (amount == null) return null
    try {
        return new Intl.NumberFormat("en", { style: "currency", currency: currency || "USD" }).format(amount)
    } catch {
        return `${currency || ""}${amount}`
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return null
    try {
        return new Date(dateStr).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })
    } catch {
        return dateStr
    }
}

const formatDateShort = (dateStr) => {
    if (!dateStr) return null
    try {
        return new Date(dateStr).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })
    } catch {
        return dateStr
    }
}

const getCurrentOffer = (subscription) => {
    const offers = subscription?.offers || []
    const now = new Date()
    // Use subscription.offers[] array — the documented pattern.
    // A subscription can have multiple offers (standard + discount);
    // filter where record_subtype is NOT "discount" to find the standard offer.
    const active = offers
        .filter(o => !o.data?.end || new Date(o.data.end) >= now)
        .filter(o => !o.data?.start || new Date(o.data.start) <= now)
        .find(o => o.data?.record_subtype !== "discount")
    return active?.data?.offer || null
}

const getPrice = (subscription) => {
    if (subscription.status === "cancelled") return "N/A"
    const schedules = (subscription.schedule || []).filter(s => ["active", "pending", "pending-external"].includes(s.status))
    const sorted = schedules.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
    if (sorted[0]?.data?.amount) {
        return formatCurrency(sorted[0].data.amount, sorted[0].data.currency)
    }
    const offer = getCurrentOffer(subscription)
    const price = offer?.data?.attributes?.price__limio?.[0]
    if (price?.value) return formatCurrency(price.value, price.currencyCode)
    return "—"
}

const getRenewalDate = (subscription) => {
    if (subscription.status === "cancelled") return null
    const now = new Date().toISOString()
    const schedules = (subscription.schedule || []).filter(s => ["active", "pending", "pending-external"].includes(s.status))
    const future = schedules.filter(s => s.data.date > now).sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
    return formatDate(future[0]?.data?.date || subscription.data?.termEndDate)
}

const getPeriod = (offer) => {
    if (!offer) return null
    const hasRecurring = offer.data?.attributes?.price__limio?.some(c => c.type === "recurring")
    if (!hasRecurring) return null
    const term = offer.data?.attributes?.term__limio
    if (term?.type && term?.length) {
        const label = term.length > 1 ? term.type : term.type?.replace(/s$/, "")
        return `${term.length} ${label}`
    }
    return null
}

const getProductName = (offer) => {
    const products = offer?.data?.products || []
    return products.map(p => p.attributes?.display_name__limio || p.name).filter(Boolean).join(", ")
}

const StatusBadge = ({ status }) => {
    const variant = status === "active" ? "active" : status === "cancelled" ? "cancelled" : "other"
    return <span className={`ad-badge ad-badge--${variant}`}>{status}</span>
}

const ScheduleStatusBadge = ({ status }) => {
    const label = status === "active" ? "Paid" : status === "cancelled" ? "Cancelled" : status === "pending" ? "Pending" : status
    const variant = status === "active" ? "paid" : status === "cancelled" ? "cancelled" : "pending"
    return <span className={`ad-schedule-badge ad-schedule-badge--${variant}`}>{label}</span>
}

const AccountDashboard = () => {
    const props = useStaticProps() || {}
    const user = useUser() || {}
    const { subscriptions: allSubscriptions } = useSubscriptions() || {}
    const { offers: campaignOffers } = useCampaign() || {}

    const {
        heroTitle = "Subscription Dashboard",
        heroSubtitle = "Manage your plans, billing, and account details",
        heading = "Account",
        profileSectionTitle = "Profile",
        subscriptionsSectionTitle = "Subscriptions",
        paymentHistoryTitle = "Payment History",
        availableOffersTitle = "Available Plans",
        availableOffersSubtitle = "Explore plans to upgrade or add to your account",
        showPaymentHistory = true,
        showAvailableOffers = true,
        showCancelledSubscriptions = false,
        nameLabel = "Name",
        emailLabel = "Email",
        memberSinceLabel = "Member since",
        planLabel = "Plan",
        statusLabel = "Status",
        priceLabel = "Price",
        periodLabel = "Billing period",
        renewalLabel = "Next billing date",
        startedLabel = "Started",
        referenceLabel = "Reference",
        productLabel = "Product",
        dateColumnLabel = "Date",
        descriptionColumnLabel = "Description",
        amountColumnLabel = "Amount",
        statusColumnLabel = "Status",
        upgradeUrl = "/upgrade",
        upgradeCtaText = "Change plan",
        manageAddOnsUrl = "",
        manageAddOnsText = "Manage add-ons",
        cancelUrl = "",
        cancelCtaText = "Cancel plan",
        noSubscriptionHeading = "No active subscription",
        noSubscriptionMessage = "You don't have an active plan yet. Choose a plan to get started.",
        getStartedText = "View plans",
        getStartedUrl = "/pricing",
        primaryColor__limio_color: primaryColor = "#635BFF",
        dangerColor__limio_color: dangerColor = "#DF1B41"
    } = props

    const attributes = user?.attributes || {}
    const email = attributes.email || ""
    const firstName = attributes.firstName || attributes.first_name || ""
    const lastName = attributes.lastName || attributes.last_name || ""
    const fullName = [firstName, lastName].filter(Boolean).join(" ")

    const initials = useMemo(() => {
        if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
        if (email) return email[0].toUpperCase()
        return "?"
    }, [firstName, lastName, email])

    const subscriptions = useMemo(() => {
        if (!allSubscriptions || !Array.isArray(allSubscriptions)) return []
        return allSubscriptions
            .filter(sub => showCancelledSubscriptions || sub.status === "active")
            .sort((a, b) => new Date(b.created) - new Date(a.created))
    }, [allSubscriptions, showCancelledSubscriptions])

    const activeCount = useMemo(() => {
        if (!allSubscriptions) return 0
        return allSubscriptions.filter(s => s.status === "active").length
    }, [allSubscriptions])

    const memberSince = useMemo(() => {
        if (!allSubscriptions?.length) return null
        const earliest = [...allSubscriptions].sort((a, b) => new Date(a.created) - new Date(b.created))[0]
        return formatDate(earliest?.created)
    }, [allSubscriptions])

    const subscriptionDetails = useMemo(() => {
        return subscriptions.map(sub => {
            const offer = getCurrentOffer(sub)
            const planName = offer?.data?.attributes?.display_name__limio || sub.name || "Plan"
            const price = getPrice(sub)
            const renewalDate = getRenewalDate(sub)
            const period = getPeriod(offer)
            const product = getProductName(offer)
            const startDate = formatDate(sub.created)
            const reference = sub.reference || sub.id
            return { sub, planName, price, renewalDate, period, product, startDate, reference }
        })
    }, [subscriptions])

    const paymentHistory = useMemo(() => {
        if (!showPaymentHistory || !allSubscriptions?.length) return []
        const now = new Date().toISOString()
        const allPayments = []
        for (const sub of allSubscriptions) {
            for (const entry of (sub.schedule || [])) {
                if (entry.data?.date <= now) {
                    allPayments.push({
                        date: entry.data.date,
                        description: entry.data.description || sub.name,
                        amount: formatCurrency(entry.data.amount, entry.data.currency),
                        status: entry.status,
                        id: entry.id
                    })
                }
            }
        }
        return allPayments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    }, [allSubscriptions, showPaymentHistory])

    const offers = useMemo(() => {
        if (!showAvailableOffers || !campaignOffers?.length) return []
        return campaignOffers
    }, [campaignOffers, showAvailableOffers])

    const totalMonthlySpend = useMemo(() => {
        if (!allSubscriptions?.length) return null
        let total = 0
        let currency = "USD"
        for (const sub of allSubscriptions) {
            if (sub.status !== "active") continue
            const offer = getCurrentOffer(sub)
            const price = offer?.data?.attributes?.price__limio?.[0]
            if (price?.value) {
                total += price.value
                currency = price.currencyCode || currency
            }
        }
        return total > 0 ? formatCurrency(total, currency) : null
    }, [allSubscriptions])

    return (
        <div className="ad-page" style={{ "--ad-primary": primaryColor, "--ad-danger": dangerColor }}>

            {/* Hero Header */}
            <div className="ad-hero">
                <div className="ad-hero-inner">
                    <div className="ad-hero-top">
                        <div className="ad-hero-avatar">{initials}</div>
                        <div className="ad-hero-greeting">
                            <h1 className="ad-hero-title">{heroTitle}</h1>
                            <p className="ad-hero-subtitle">
                                {fullName ? `Welcome back, ${firstName}` : heroSubtitle}
                            </p>
                        </div>
                    </div>
                    <div className="ad-hero-stats">
                        <div className="ad-hero-stat">
                            <span className="ad-hero-stat-value">{activeCount}</span>
                            <span className="ad-hero-stat-label">Active {activeCount === 1 ? "Plan" : "Plans"}</span>
                        </div>
                        {totalMonthlySpend && (
                            <div className="ad-hero-stat">
                                <span className="ad-hero-stat-value">{totalMonthlySpend}</span>
                                <span className="ad-hero-stat-label">Current Spend</span>
                            </div>
                        )}
                        {memberSince && (
                            <div className="ad-hero-stat">
                                <span className="ad-hero-stat-value">{memberSince}</span>
                                <span className="ad-hero-stat-label">{memberSinceLabel}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="ad-container">

                {/* Profile Card */}
                <div className="ad-card">
                    <div className="ad-card-header">
                        <h2 className="ad-card-title">{profileSectionTitle}</h2>
                    </div>
                    <dl className="ad-details">
                        {fullName && (
                            <div className="ad-detail-row">
                                <dt>{nameLabel}</dt>
                                <dd>{fullName}</dd>
                            </div>
                        )}
                        {email && (
                            <div className="ad-detail-row">
                                <dt>{emailLabel}</dt>
                                <dd>{email}</dd>
                            </div>
                        )}
                        {memberSince && (
                            <div className="ad-detail-row">
                                <dt>{memberSinceLabel}</dt>
                                <dd>{memberSince}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Subscriptions Section */}
                {subscriptionDetails.length > 0 ? (
                    <>
                        <div className="ad-section-header">
                            <h2 className="ad-section-title">{subscriptionsSectionTitle}</h2>
                            <span className="ad-section-count">{subscriptions.length}</span>
                        </div>

                        {subscriptionDetails.map(({ sub, planName, price, renewalDate, period, product, startDate, reference }) => (
                            <div className="ad-card" key={sub.id}>
                                <div className="ad-card-header">
                                    <h2 className="ad-card-title ad-card-title--plan">{planName}</h2>
                                    <StatusBadge status={sub.status} />
                                </div>
                                <dl className="ad-details">
                                    <div className="ad-detail-row">
                                        <dt>{priceLabel}</dt>
                                        <dd className="ad-detail-highlight">{price}</dd>
                                    </div>
                                    {period && (
                                        <div className="ad-detail-row">
                                            <dt>{periodLabel}</dt>
                                            <dd>{period}</dd>
                                        </div>
                                    )}
                                    {renewalDate && (
                                        <div className="ad-detail-row">
                                            <dt>{renewalLabel}</dt>
                                            <dd>{renewalDate}</dd>
                                        </div>
                                    )}
                                    {startDate && (
                                        <div className="ad-detail-row">
                                            <dt>{startedLabel}</dt>
                                            <dd>{startDate}</dd>
                                        </div>
                                    )}
                                    {product && (
                                        <div className="ad-detail-row">
                                            <dt>{productLabel}</dt>
                                            <dd>{product}</dd>
                                        </div>
                                    )}
                                    <div className="ad-detail-row">
                                        <dt>{referenceLabel}</dt>
                                        <dd className="ad-detail-mono">{reference}</dd>
                                    </div>
                                </dl>

                                {sub.status === "active" && (
                                    <div className="ad-actions">
                                        {upgradeUrl && (
                                            <a href={buildUrl(upgradeUrl, reference)} className="ad-btn ad-btn--primary">
                                                {upgradeCtaText}
                                            </a>
                                        )}
                                        {manageAddOnsUrl && (
                                            <a href={buildUrl(manageAddOnsUrl, reference)} className="ad-btn ad-btn--secondary">
                                                {manageAddOnsText}
                                            </a>
                                        )}
                                        {cancelUrl && (
                                            <a href={buildUrl(cancelUrl, reference)} className="ad-btn ad-btn--danger">
                                                {cancelCtaText}
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="ad-card ad-empty-state">
                        <div className="ad-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="ad-empty-heading">{noSubscriptionHeading}</h3>
                        <p className="ad-empty-text">{noSubscriptionMessage}</p>
                        {getStartedUrl && (
                            <a href={getStartedUrl} className="ad-btn ad-btn--primary">
                                {getStartedText}
                            </a>
                        )}
                    </div>
                )}

                {/* Payment History */}
                {paymentHistory.length > 0 && (
                    <>
                        <div className="ad-section-header">
                            <h2 className="ad-section-title">{paymentHistoryTitle}</h2>
                        </div>
                        <div className="ad-card ad-card--table">
                            <div className="ad-table-wrapper">
                                <table className="ad-table">
                                    <thead>
                                        <tr>
                                            <th>{dateColumnLabel}</th>
                                            <th>{descriptionColumnLabel}</th>
                                            <th className="ad-table-right">{amountColumnLabel}</th>
                                            <th className="ad-table-right">{statusColumnLabel}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map(payment => (
                                            <tr key={payment.id}>
                                                <td className="ad-table-date">{formatDateShort(payment.date)}</td>
                                                <td>{payment.description}</td>
                                                <td className="ad-table-right ad-table-amount">{payment.amount}</td>
                                                <td className="ad-table-right"><ScheduleStatusBadge status={payment.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Available Offers */}
                {offers.length > 0 && (
                    <>
                        <div className="ad-section-header">
                            <h2 className="ad-section-title">{availableOffersTitle}</h2>
                            {availableOffersSubtitle && <p className="ad-section-subtitle">{availableOffersSubtitle}</p>}
                        </div>
                        <div className="ad-offers-grid">
                            {offers.map((offer, i) => {
                                const attrs = offer?.data?.attributes || {}
                                const displayName = attrs.display_name__limio || offer.name || "Plan"
                                const displayPrice = attrs.display_price__limio || ""
                                const features = attrs.offer_features__limio || ""
                                const ctaText = attrs.cta_text__limio || "Select"
                                const isBestValue = attrs.best_value__limio
                                const badge = attrs.badge_text__limio

                                return (
                                    <div className={`ad-offer-card ${isBestValue ? "ad-offer-card--featured" : ""}`} key={offer.id || i}>
                                        {badge && <div className="ad-offer-badge">{badge}</div>}
                                        <h3 className="ad-offer-name">{displayName}</h3>
                                        {displayPrice && (
                                            <div
                                                className="ad-offer-price"
                                                dangerouslySetInnerHTML={{ __html: xss(displayPrice) }}
                                            />
                                        )}
                                        {features && (
                                            <div
                                                className="ad-offer-features"
                                                dangerouslySetInnerHTML={{ __html: xss(features) }}
                                            />
                                        )}
                                        <button className="ad-btn ad-btn--primary ad-offer-cta" type="button">
                                            {ctaText}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AccountDashboard
