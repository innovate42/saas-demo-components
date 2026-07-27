import React, { useMemo, useState } from "react"
import { ErrorBoundary, useBasket, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { groupBy, prop } from "ramda"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

const sanitize = (str) => sanitiseHTML(str || "")

const fillTemplate = (tpl, vars) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""))

// German currency formatting: "600 €" / "12,99 €"
const formatEur = (value, currency = "EUR") => {
    const num = Number(value)
    if (!Number.isFinite(num)) return ""
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency,
        minimumFractionDigits: num % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(num)
}

const getUnitPrice = (offer) => {
    const charge = offer?.data?.attributes?.price__limio?.[0] || offer?.data?.price?.[0]
    if (!charge) return null
    const value = Number(charge.value)
    return Number.isFinite(value) ? { value, currency: charge.currencyCode || "EUR" } : null
}

const groupOffersByTerm = groupBy(prop("group__limio"))

const OfferCard = ({ offer, quantity, props, onBuy, busy }) => {
    const attributes = offer?.data?.attributes || {}
    const {
        display_name__limio: name,
        display_price__limio: displayPrice,
        detailed_display_price__limio: detailedPrice,
        offer_features__limio: features,
        cta_text__limio: cta,
        best_value__limio: bestValue,
        allow_multibuy__limio: multibuy,
        group__limio: group,
    } = attributes

    const unit = getUnitPrice(offer)
    const isYearly = group === "yearly"
    const total = unit && multibuy ? unit.value * quantity : unit?.value
    const totalTemplate = isYearly ? props.totalTemplateYearly : props.totalTemplateMonthly

    return (
        <article className={`cafeyn-offers__card${bestValue ? " cafeyn-offers__card--featured" : ""}`}>
            {bestValue && <div className="cafeyn-offers__badge">{props.bestValueLabel}</div>}
            <h3 className="cafeyn-offers__plan">{name}</h3>
            {displayPrice && (
                <div className="cafeyn-offers__price" dangerouslySetInnerHTML={{ __html: sanitize(displayPrice) }} />
            )}
            {detailedPrice && (
                <div className="cafeyn-offers__price-detail" dangerouslySetInnerHTML={{ __html: sanitize(detailedPrice) }} />
            )}
            {unit && multibuy && (
                <div className="cafeyn-offers__total">
                    {fillTemplate(totalTemplate, { total: formatEur(total, unit.currency), count: quantity })}
                </div>
            )}
            {features && (
                <div className="cafeyn-offers__features" dangerouslySetInnerHTML={{ __html: sanitize(features) }} />
            )}
            <button
                type="button"
                className="cafeyn-offers__cta"
                disabled={busy}
                onClick={() => onBuy(offer)}
            >
                {cta || "Jetzt starten"}
            </button>
        </article>
    )
}

const CafeynOffers = () => {
    const { offers } = useCampaign() || {}
    const basket = useBasket() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}
    const {
        headline = "",
        subheadline = "",
        groupLabels = [],
        annualSavingsLabel = "",
        quantityLabel = "",
        quantityHint = "",
        minQuantity = 1,
        maxQuantity = 10,
        defaultQuantity = 5,
        showEnterpriseCard = true,
        enterpriseName = "",
        enterprisePrice = "",
        enterpriseFeatures = "",
        enterpriseCta = "",
        enterpriseCtaHref = "#",
        componentId = "plaene",
    } = props

    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions, orderItems, basketLoading } = basket

    const min = Number(minQuantity) || 1
    const max = Number(maxQuantity) || 10
    const clamp = (n) => Math.min(max, Math.max(min, n))
    const [quantity, setQuantity] = useState(() => clamp(Number(defaultQuantity) || 1))

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
        const configured = (groupLabels || []).filter((item) => groups.includes(item.id))
        if (configured.length > 0) return configured
        return groups.map((g) => ({ id: g, label: g }))
    }, [groupLabels, grouped])

    const [selectedGroup, setSelectedGroup] = useState("")
    const activeGroup = selectedGroup || validLabels[validLabels.length - 1]?.id || ""
    const displayedOffers = grouped[activeGroup] || []

    const handleBuy = async (offer) => {
        try {
            // orderItems is only populated for the current active basket, so a
            // completed checkout correctly starts fresh (see cebroker-offer-cards).
            const multibuy = offer?.data?.attributes?.allow_multibuy__limio
            const qty = multibuy ? quantity : 1
            if (orderItems?.length > 0) {
                await addOfferToBasket({ offer, quantity: qty })
            } else {
                await initiateCheckout({ order: { orderItems: [{ offer, quantity: qty }] } })
            }
            if (pageOptions?.pushToCheckout !== false && navigateToCheckout) {
                await navigateToCheckout()
            }
        } catch (error) {
            console.error("Cafeyn offers: add to basket failed", error)
        }
    }

    if (!offers?.length && !isInPageBuilder) return null

    return (
        <section id={componentId} className="cafeyn-offers">
            <div className="cafeyn-offers__inner">
                {headline?.trim() && <h2 className="cafeyn-offers__headline">{headline}</h2>}
                {subheadline?.trim() && <p className="cafeyn-offers__subheadline">{subheadline}</p>}

                <div className="cafeyn-offers__toolbar">
                    {validLabels.length > 1 && (
                        <div className="cafeyn-offers__toggle" role="tablist" aria-label={headline}>
                            {validLabels.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeGroup === item.id}
                                    className={`cafeyn-offers__toggle-btn${activeGroup === item.id ? " cafeyn-offers__toggle-btn--active" : ""}`}
                                    onClick={() => setSelectedGroup(item.id)}
                                >
                                    {item.label}
                                    {item.id === "yearly" && annualSavingsLabel?.trim() && (
                                        <span className="cafeyn-offers__savings">{annualSavingsLabel}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="cafeyn-offers__stepper-wrap">
                        {quantityLabel?.trim() && <span className="cafeyn-offers__stepper-label">{quantityLabel}</span>}
                        <div className="cafeyn-offers__stepper">
                            <button
                                type="button"
                                aria-label="Weniger Lizenzen"
                                disabled={quantity <= min}
                                onClick={() => setQuantity((q) => clamp(q - 1))}
                            >
                                −
                            </button>
                            <span className="cafeyn-offers__stepper-count">{quantity}</span>
                            <button
                                type="button"
                                aria-label="Mehr Lizenzen"
                                disabled={quantity >= max}
                                onClick={() => setQuantity((q) => clamp(q + 1))}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="cafeyn-offers__grid">
                    {displayedOffers.map((offer, i) => (
                        <OfferCard
                            key={offer?.id || i}
                            offer={offer}
                            quantity={quantity}
                            props={props}
                            onBuy={handleBuy}
                            busy={!!basketLoading}
                        />
                    ))}
                    {showEnterpriseCard && (
                        <article className="cafeyn-offers__card cafeyn-offers__card--enterprise">
                            <h3 className="cafeyn-offers__plan">{enterpriseName}</h3>
                            <div className="cafeyn-offers__price">
                                <p><strong>{enterprisePrice}</strong></p>
                            </div>
                            {enterpriseFeatures && (
                                <div
                                    className="cafeyn-offers__features"
                                    dangerouslySetInnerHTML={{ __html: sanitize(enterpriseFeatures) }}
                                />
                            )}
                            <a className="cafeyn-offers__cta cafeyn-offers__cta--secondary" href={enterpriseCtaHref || "#"}>
                                {enterpriseCta}
                            </a>
                        </article>
                    )}
                </div>

                {quantityHint?.trim() && <p className="cafeyn-offers__hint">{quantityHint}</p>}
            </div>
        </section>
    )
}

CafeynOffers.Skeleton = () => (
    <div className="cafeyn-offers">
        <div className="cafeyn-offers__inner">
            <div className="cafeyn-offers__grid">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="cafeyn-offers__card cafeyn-offers__card--skeleton" />
                ))}
            </div>
        </div>
    </div>
)

CafeynOffers.Error = () => (
    <div className="cafeyn-offers">
        <div className="cafeyn-offers__inner">
            <p>Die Pläne können gerade nicht geladen werden. Bitte laden Sie die Seite neu.</p>
        </div>
    </div>
)

const Wrapped = () => (
    <ErrorBoundary fallback={<CafeynOffers.Error />}>
        <CafeynOffers />
    </ErrorBoundary>
)

export default Wrapped
