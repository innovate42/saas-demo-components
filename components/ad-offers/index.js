import React, { useMemo, useState } from "react"
import { ErrorBoundary, useBasket, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { groupBy, prop } from "ramda"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const sanitize = (str) => sanitiseHTML(str || "")

const fillTemplate = (tpl, vars) =>
    String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""))

// One catalog, many markets: the locale follows the offer's own currency,
// so the same component renders $199.00, £21.99 and 24,99 € correctly.
const LOCALE_BY_CURRENCY = {
    USD: "en-US",
    CAD: "en-CA",
    GBP: "en-GB",
    EUR: "de-DE",
    AUD: "en-AU",
}

const formatMoney = (value, currency, localeOverride) => {
    const num = Number(value)
    if (!Number.isFinite(num)) return ""
    const locale = localeOverride?.trim() || LOCALE_BY_CURRENCY[currency] || "en-US"
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency || "USD",
            minimumFractionDigits: num % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(num)
    } catch (e) {
        return `${num} ${currency || ""}`.trim()
    }
}

const getUnitPrice = (offer) => {
    const charge =
        offer?.data?.attributes?.price__limio?.[0] || offer?.data?.price?.[0]
    if (!charge) return null
    const value = Number(charge.value)
    return Number.isFinite(value)
        ? { value, currency: charge.currencyCode || "USD" }
        : null
}

const groupOffersByTerm = groupBy(prop("group__limio"))

const ENTITIES = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    mdash: "—",
    ndash: "–",
    middot: "·",
    euro: "€",
    pound: "£",
    hellip: "…",
    uuml: "ü",
    auml: "ä",
    ouml: "ö",
    szlig: "ß",
    Uuml: "Ü",
    Auml: "Ä",
    Ouml: "Ö",
}

// Feature text arrives as rich text, so entities have to be decoded before it
// is rendered as a plain string — otherwise "&amp;" shows up literally.
const decodeEntities = (str) =>
    String(str || "")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
        .replace(/&([a-z]+);/gi, (m, name) =>
            Object.prototype.hasOwnProperty.call(ENTITIES, name) ? ENTITIES[name] : m
        )

// Splits the offer's rich-text feature list into rows, flagging the ones the
// catalog marks as a free inclusion so they can render as INCLUDED rather than
// as an ordinary bundle line. The distinction is ALLDATA's, so we keep it.
const parseFeatures = (html, includedPattern) => {
    if (!html) return []
    let re = null
    try {
        if (includedPattern?.trim()) re = new RegExp(includedPattern, "i")
    } catch (e) {
        re = null
    }
    const rows = String(html)
        .split(/<\/li>/i)
        .map((chunk) => decodeEntities(chunk.replace(/<[^>]*>/g, "")).trim())
        .filter(Boolean)
    if (rows.length === 0) return []
    return rows.map((text) => ({ text, included: re ? re.test(text) : false }))
}

// Cards read left-to-right in ascending commitment. Sort by the offer's own
// access-point count, then price, so a new market's offers land in a sensible
// order without anyone hand-ordering the page.
const cardOrder = (a, b) => {
    const ap = (o) => Number(o?.data?.attributes?.access_points__limio) || 0
    const price = (o) => {
        const c = o?.data?.attributes?.price__limio?.[0]
        return Number(c?.value) || 0
    }
    return ap(a) - ap(b) || price(a) - price(b)
}

const CheckIcon = ({ included }) => (
    <svg
        className={`ad-offers__check${included ? " ad-offers__check--included" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
    >
        <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const OfferCard = ({ offer, props, onBuy, busy }) => {
    const attributes = offer?.data?.attributes || {}
    const {
        display_name__limio: name,
        display_price__limio: displayPrice,
        detailed_display_price__limio: detailedPrice,
        display_description__limio: description,
        offer_features__limio: features,
        cta_text__limio: cta,
        best_value__limio: bestValue,
        access_points__limio: accessPoints,
    } = attributes

    const {
        bestValueLabel,
        accessPointsLabel,
        showAccessPoints,
        includedBadgeLabel,
        includedPattern,
    } = props

    const rows = parseFeatures(features, includedPattern)

    // Fall back to formatting the offer's own charge when the catalog has no
    // display_price__limio — keeps a newly-created market's offers readable
    // before anyone has written display copy for them.
    const unit = getUnitPrice(offer)
    const fallbackPrice =
        !displayPrice && unit
            ? formatMoney(unit.value, unit.currency, props.locale)
            : ""

    return (
        <article
            className={`ad-offers__card${bestValue ? " ad-offers__card--featured" : ""}`}
        >
            {bestValue && bestValueLabel?.trim() && (
                <div className="ad-offers__badge">{bestValueLabel}</div>
            )}

            <div className="ad-offers__card-head">
                <h3 className="ad-offers__plan">{name}</h3>
                {showAccessPoints && accessPoints ? (
                    <span className="ad-offers__ap-chip">
                        {fillTemplate(accessPointsLabel, { count: accessPoints })}
                    </span>
                ) : null}
            </div>

            {description && (
                <div
                    className="ad-offers__description"
                    dangerouslySetInnerHTML={{ __html: sanitize(description) }}
                />
            )}

            {displayPrice ? (
                <div
                    className="ad-offers__price"
                    dangerouslySetInnerHTML={{ __html: sanitize(displayPrice) }}
                />
            ) : fallbackPrice ? (
                <div className="ad-offers__price">
                    <p>
                        <strong>{fallbackPrice}</strong>
                    </p>
                </div>
            ) : null}
            {detailedPrice && (
                <div
                    className="ad-offers__price-detail"
                    dangerouslySetInnerHTML={{ __html: sanitize(detailedPrice) }}
                />
            )}

            {rows.length > 0 && (
                <ul className="ad-offers__features">
                    {rows.map((row, i) => (
                        <li
                            key={i}
                            className={`ad-offers__feature${row.included ? " ad-offers__feature--included" : ""}`}
                        >
                            <CheckIcon included={row.included} />
                            <span className="ad-offers__feature-text">{row.text}</span>
                            {row.included && includedBadgeLabel?.trim() && (
                                <span className="ad-offers__included-badge">
                                    {includedBadgeLabel}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
                className="ad-offers__cta"
                disabled={busy}
                onClick={() => onBuy(offer)}
            >
                {cta || "Get started"}
            </button>
        </article>
    )
}

const AdOffers = () => {
    const { offers } = useCampaign() || {}
    const basket = useBasket() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}
    const {
        headline = "",
        subheadline = "",
        groupLabels = [],
        annualSavingsLabel = "",
        emptyMessage = "",
        footnote = "",
        showContactCard = false,
        contactName = "",
        contactPrice = "",
        contactFeatures = "",
        contactCta = "",
        contactCtaHref = "#",
        componentId = "plans",
    } = props

    const {
        addOfferToBasket,
        initiateCheckout,
        navigateToCheckout,
        pageOptions,
        orderItems,
        basketLoading,
    } = basket

    const grouped = useMemo(() => {
        if (!Array.isArray(offers)) return {}
        return groupOffersByTerm(
            offers.map((offer) => ({
                ...offer,
                group__limio: offer?.data?.attributes?.group__limio || "default",
            }))
        )
    }, [offers])

    const validLabels = useMemo(() => {
        const groups = Object.keys(grouped)
        const configured = (groupLabels || []).filter((item) =>
            groups.includes(item.id)
        )
        if (configured.length > 0) return configured
        return groups.map((g) => ({ id: g, label: g }))
    }, [groupLabels, grouped])

    const [selectedGroup, setSelectedGroup] = useState("")
    const activeGroup = selectedGroup || validLabels[0]?.id || ""
    const displayedOffers = useMemo(
        () => [...(grouped[activeGroup] || [])].sort(cardOrder),
        [grouped, activeGroup]
    )

    const handleBuy = async (offer) => {
        try {
            // orderItems is only populated for the current active basket, so a
            // completed checkout correctly starts fresh.
            if (orderItems?.length > 0) {
                await addOfferToBasket({ offer, quantity: 1 })
            } else {
                await initiateCheckout({
                    order: { orderItems: [{ offer, quantity: 1 }] },
                })
            }
            if (pageOptions?.pushToCheckout !== false && navigateToCheckout) {
                await navigateToCheckout()
            }
        } catch (error) {
            console.error("ALLDATA offers: add to basket failed", error)
        }
    }

    if (!offers?.length && !isInPageBuilder) return null

    return (
        <section id={componentId} className="ad-offers">
            <div className="ad-offers__inner">
                {headline?.trim() && (
                    <h2 className="ad-offers__headline">{headline}</h2>
                )}
                {subheadline?.trim() && (
                    <p className="ad-offers__subheadline">{subheadline}</p>
                )}

                {validLabels.length > 1 && (
                    <div
                        className="ad-offers__toggle"
                        role="tablist"
                        aria-label={headline || "Billing term"}
                    >
                        {validLabels.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={activeGroup === item.id}
                                className={`ad-offers__toggle-btn${activeGroup === item.id ? " ad-offers__toggle-btn--active" : ""}`}
                                onClick={() => setSelectedGroup(item.id)}
                            >
                                {item.label}
                                {item.id === "yearly" && annualSavingsLabel?.trim() && (
                                    <span className="ad-offers__savings">
                                        {annualSavingsLabel}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {displayedOffers.length === 0 && emptyMessage?.trim() ? (
                    <p className="ad-offers__empty">{emptyMessage}</p>
                ) : (
                    <div className="ad-offers__grid">
                        {displayedOffers.map((offer, i) => (
                            <OfferCard
                                key={offer?.id || i}
                                offer={offer}
                                props={props}
                                onBuy={handleBuy}
                                busy={!!basketLoading}
                            />
                        ))}
                        {showContactCard && (
                            <article className="ad-offers__card ad-offers__card--contact">
                                <div className="ad-offers__card-head">
                                    <h3 className="ad-offers__plan">{contactName}</h3>
                                </div>
                                <div className="ad-offers__price">
                                    <p>
                                        <strong>{contactPrice}</strong>
                                    </p>
                                </div>
                                {contactFeatures && (
                                    <div
                                        className="ad-offers__features-html"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitize(contactFeatures),
                                        }}
                                    />
                                )}
                                <a
                                    className="ad-offers__cta ad-offers__cta--secondary"
                                    href={contactCtaHref || "#"}
                                >
                                    {contactCta}
                                </a>
                            </article>
                        )}
                    </div>
                )}

                {footnote && (
                    <div
                        className="ad-offers__footnote"
                        dangerouslySetInnerHTML={{ __html: sanitize(footnote) }}
                    />
                )}
            </div>
        </section>
    )
}

AdOffers.Skeleton = () => (
    <div className="ad-offers">
        <div className="ad-offers__inner">
            <div className="ad-offers__grid">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="ad-offers__card ad-offers__card--skeleton" />
                ))}
            </div>
        </div>
    </div>
)

AdOffers.Error = () => (
    <div className="ad-offers">
        <div className="ad-offers__inner">
            <p>Plans cannot be loaded right now. Please refresh the page.</p>
        </div>
    </div>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<AdOffers.Error />}>
        <AdOffers />
    </ErrorBoundary>
)

export default Wrapped
