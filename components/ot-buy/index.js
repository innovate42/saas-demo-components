import React, { useEffect, useMemo, useState } from "react"
import { ErrorBoundary, useBasket, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { ERPS, INDUSTRIES, PARTNERS } from "./data"
import "./index.css"

// One page, three currencies. The shopper picks a region in ot-header; it sets
// the currency (USD by default) and the data centre the order is provisioned
// in. ot-header shares it through localStorage + an "ot-region-change" event.
const REGIONS = {
    NA: { label: "Americas", currency: "USD", dataCentre: "North America", partnerRegion: "NA" },
    UK: { label: "United Kingdom", currency: "GBP", dataCentre: "EMEA (UK)", partnerRegion: "EMEA" },
    EU: { label: "Europe", currency: "EUR", dataCentre: "EMEA (EU)", partnerRegion: "EMEA" },
    APAC: { label: "Asia-Pacific", currency: "USD", dataCentre: "Asia-Pacific", partnerRegion: "APAC" },
}
const LOCALE = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" }

const money = (value, currency) => {
    const n = Number(value)
    if (!Number.isFinite(n)) return ""
    try {
        return new Intl.NumberFormat(LOCALE[currency] || "en-US", {
            style: "currency",
            currency: currency || "USD",
            minimumFractionDigits: n % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
        }).format(n)
    } catch (e) {
        return `${n} ${currency}`
    }
}

const attrs = (o) => o?.data?.attributes || {}
const charge = (o) => attrs(o).price__limio?.[0] || {}
const priceOf = (o) => Number(charge(o).value) || 0
const currencyOf = (o) => charge(o).currencyCode || "USD"
const sanitize = (s) => sanitiseHTML(s || "")

const readRegion = () => {
    try {
        const fromUrl = new URLSearchParams(window.location.search).get("region")
        if (fromUrl && REGIONS[fromUrl.toUpperCase()]) return fromUrl.toUpperCase()
        const stored = window.localStorage.getItem("ot-region")
        if (stored && REGIONS[stored]) return stored
    } catch (e) {
        // storage blocked
    }
    return "NA"
}

const featureRows = (html) =>
    String(html || "")
        .split(/<\/li>/i)
        .filter((chunk) => /<li[\s>]/i.test(chunk))
        .map((chunk) => chunk.replace(/^[\s\S]*?<li[^>]*>/i, "").trim())
        .filter((row) => row.replace(/<[^>]*>/g, "").trim())

const Check = () => (
    <svg viewBox="0 0 24 24" className="ot-buy__tick" aria-hidden="true">
        <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const Step = ({ n, title, hint, children }) => (
    <section className="ot-buy__step">
        <div className="ot-buy__step-head">
            <span className="ot-buy__step-n">{n}</span>
            <div>
                <h2 className="ot-buy__step-title">{title}</h2>
                {hint && <p className="ot-buy__step-hint">{hint}</p>}
            </div>
        </div>
        {children}
    </section>
)

const OtBuy = () => {
    const { offers = [], addOns = [] } = useCampaign() || {}
    const basket = useBasket() || {}
    const { isInPageBuilder } = useLimioContext() || {}
    const props = useStaticProps() || {}
    const {
        mode = "tradinggrid",
        kicker = "",
        headline = "",
        subheadline = "",
        erpTitle = "",
        erpHint = "",
        partnerTitle = "",
        partnerHint = "",
        planTitle = "",
        planHint = "",
        onboardingTitle = "",
        onboardingHint = "",
        diyTitle = "",
        diyBody = "",
        guidedTitle = "",
        guidedBody = "",
        premiumLabel = "",
        enterpriseThreshold = 15,
        enterpriseHref = "/ot-enterprise",
        enterpriseNudge = "",
        promoHint = "",
        termsNote = "",
        ctaLabel = "Continue to checkout",
        monthlyLabel = "Monthly",
        annualLabel = "Annual",
        annualSaving = "2 months free",
        featuresLabel = "View features",
    } = props

    const showErp = mode === "tradinggrid"

    const [region, setRegion] = useState("NA")
    const [term, setTerm] = useState("monthly")
    const [erp, setErp] = useState("")
    const [selected, setSelected] = useState([])
    const [custom, setCustom] = useState("")
    const [query, setQuery] = useState("")
    const [industry, setIndustry] = useState("")
    const [allRegions, setAllRegions] = useState(false)
    const [chosenPlan, setChosenPlan] = useState("")
    const [onboarding, setOnboarding] = useState("diy")
    const [premium, setPremium] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")
    const [showFeatures, setShowFeatures] = useState(false)

    useEffect(() => {
        setRegion(readRegion())
        // the region is picked in ot-header; follow it live and reset the partner
        // picks, which are region-specific
        const onChange = (e) => {
            if (e?.detail && REGIONS[e.detail]) {
                setRegion(e.detail)
                setSelected([])
            }
        }
        window.addEventListener("ot-region-change", onChange)
        return () => window.removeEventListener("ot-region-change", onChange)
    }, [])

    const r = REGIONS[region]
    const currency = r.currency

    const plans = useMemo(
        () =>
            offers
                .filter((o) => currencyOf(o) === currency)
                .filter((o) => (attrs(o).group__limio || "monthly") === term)
                .filter((o) => !attrs(o).product_family__limio || attrs(o).product_family__limio === mode)
                .sort((a, b) => (attrs(a).tier_rank__limio || 0) - (attrs(b).tier_rank__limio || 0)),
        [offers, currency, term, mode]
    )

    const addon = (key) =>
        addOns.find(
            (a) =>
                attrs(a).addon_key__limio === key &&
                currencyOf(a) === currency &&
                ["onetime", term].includes(attrs(a).group__limio || term)
        )

    const count = selected.length
    // Recommend the cheapest way to cover every selected partner: a bigger
    // bundle, or a smaller one topped up with additional-partner add-ons.
    const partnerUnit = priceOf(addon("extra_trading_partner"))
    const costFor = (p) => {
        const missing = Math.max(0, count - (attrs(p).trading_partners__limio || 0))
        if (missing === 0) return priceOf(p)
        return partnerUnit ? priceOf(p) + missing * partnerUnit : Infinity
    }
    const recommended = useMemo(() => {
        if (plans.length === 0) return null
        return plans.reduce((best, p) => (costFor(p) < costFor(best) ? p : best), plans[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plans, count, partnerUnit])

    // A plan the shopper picked by hand wins, but only while it still exists in
    // the current currency/term; otherwise fall back to the recommendation.
    const plan =
        plans.find((p) => attrs(p).display_name__limio === chosenPlan) || recommended
    const included = attrs(plan).trading_partners__limio || 0
    const extra = Math.max(0, count - included)
    const erpInfo = ERPS.find((e) => e.id === erp)
    const needsAdapter = showErp && erpInfo?.adapter

    const lines = []
    if (plan) lines.push({ label: attrs(plan).display_name__limio, amount: priceOf(plan), recurring: true })
    const erpAddon = needsAdapter ? addon("erp_adapter") : null
    if (erpAddon) lines.push({ label: `ERP adapter · ${erpInfo.name}`, amount: priceOf(erpAddon), recurring: true })
    const partnerAddon = extra > 0 ? addon("extra_trading_partner") : null
    if (partnerAddon)
        lines.push({ label: `${extra} additional partner${extra > 1 ? "s" : ""}`, amount: priceOf(partnerAddon) * extra, recurring: true })
    const premiumAddon = premium ? addon("premium_support") : null
    if (premiumAddon) lines.push({ label: "Premium support", amount: priceOf(premiumAddon), recurring: true })
    const guidedAddon = onboarding === "guided" ? addon("guided_onboarding") : null
    if (guidedAddon) lines.push({ label: "Guided onboarding", amount: priceOf(guidedAddon), recurring: false })

    const recurringTotal = lines.filter((l) => l.recurring).reduce((s, l) => s + l.amount, 0)
    const oneOffTotal = lines.filter((l) => !l.recurring).reduce((s, l) => s + l.amount, 0)
    const per = term === "yearly" ? "year" : "month"

    const visiblePartners = useMemo(() => {
        const q = query.trim().toLowerCase()
        return PARTNERS.filter((p) => allRegions || p.region === r.partnerRegion)
            .filter((p) => !industry || p.industry === industry)
            .filter((p) => !q || p.name.toLowerCase().includes(q) || p.industry.toLowerCase().includes(q))
            .sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || a.name.localeCompare(b.name))
    }, [query, industry, allRegions, r.partnerRegion])

    const toggle = (name) =>
        setSelected((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : [...cur, name]))

    const addCustom = () => {
        const name = custom.trim()
        if (name && !selected.includes(name)) setSelected([...selected, name])
        setCustom("")
    }

    const docsNeeded = Array.from(
        new Set(selected.flatMap((n) => PARTNERS.find((p) => p.name === n)?.docs || []))
    )

    const ready = !!plan && count > 0 && (!showErp || !!erp)
    const overThreshold = count > Number(enterpriseThreshold || 15)

    const checkout = async () => {
        if (!ready || busy) return
        setBusy(true)
        setError("")
        const { initiateCheckout, addOfferToBasket, updateCustomField, navigateToCheckout } = basket
        // Add-ons are added after the plan, under the plan's basket line: an
        // add-on's parentId must be that line's id, which initiateCheckout only
        // assigns once the checkout exists. With the offer id instead, the cart
        // hides the add-on and Zuora drops it from the subscription.
        const addOns = [
            erpAddon && [erpAddon, 1],
            partnerAddon && [partnerAddon, extra],
            premiumAddon && [premiumAddon, 1],
            guidedAddon && [guidedAddon, 1],
        ].filter(Boolean)

        // Everything provisioning needs travels on the order as custom fields:
        // they land in order.customFields, the entitlement webhook and the
        // Salesforce order event.
        const fields = {
            OT_Product: mode === "tradinggrid" ? "Trading Grid Foundation" : "B2B Integration Essentials",
            OT_ERP: erpInfo ? erpInfo.name : "n/a (web portal)",
            OT_ERP_Adapter: erpAddon ? "yes" : "no",
            OT_TradingPartners: selected.join("; ").slice(0, 255),
            OT_PartnerCount: String(count),
            OT_Documents: docsNeeded.join(", ").slice(0, 255),
            OT_Region: region,
            OT_DataCentre: r.dataCentre,
            OT_Onboarding: onboarding === "guided" ? "Guided onboarding" : "Self-service",
        }
        try {
            window.sessionStorage.setItem(
                "ot-selection",
                JSON.stringify({
                    ...fields,
                    partners: selected,
                    // read back by ot-onboarding's "Order complete" card
                    plan: attrs(plan).display_name__limio || "",
                    total: recurringTotal,
                    oneOff: oneOffTotal,
                    currency,
                    per,
                })
            )
        } catch (e) {
            // storage blocked: the order still carries the fields
        }
        try {
            const started = await initiateCheckout({
                order: { orderItems: [{ offer: plan, quantity: 1 }], customFields: fields },
            })
            const lines = (started && started.order && started.order.orderItems) || []
            const planLine = lines.find((i) => i && i.offer && i.offer.id === plan.id) || lines[0]
            if (addOns.length && !(planLine && planLine.id)) throw new Error("ot-buy: no plan line to attach add-ons to")
            for (const [offer, quantity] of addOns) {
                await addOfferToBasket({ offer, quantity, type: "add_on", parentId: planLine.id })
            }
            if (typeof updateCustomField === "function") {
                Object.entries(fields).forEach(([k, v]) => updateCustomField(k, v))
            }
            if (navigateToCheckout) await navigateToCheckout()
        } catch (e) {
            console.error("ot-buy: checkout failed", e)
            setError("We could not start your checkout. Please try again.")
            setBusy(false)
        }
    }

    if (!offers.length && !isInPageBuilder) return null

    return (
        <div className={`ot-buy ot-buy--${mode}`}>
            <div className="ot-buy__hero">
                <div className="ot-buy__hero-inner">
                    {kicker && <p className="ot-buy__kicker">{kicker}</p>}
                    {headline && <h1 className="ot-buy__headline">{headline}</h1>}
                    {subheadline && (
                        <div className="ot-buy__sub" dangerouslySetInnerHTML={{ __html: sanitize(subheadline) }} />
                    )}
                </div>
            </div>

            <div className="ot-buy__layout">
                <div className="ot-buy__main">
                    {showErp && (
                        <Step n={1} title={erpTitle} hint={erpHint}>
                            <div className="ot-buy__erps">
                                {ERPS.map((e) => (
                                    <button
                                        key={e.id}
                                        type="button"
                                        className={`ot-buy__erp${erp === e.id ? " ot-buy__erp--on" : ""}`}
                                        onClick={() => setErp(e.id)}
                                    >
                                        <span className="ot-buy__erp-badge" style={{ background: e.color }}>
                                            {e.short}
                                        </span>
                                        <span className="ot-buy__erp-name">{e.name}</span>
                                        {!e.adapter && (
                                            <span className="ot-buy__erp-tag ot-buy__erp-tag--muted">File / API connection</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Step>
                    )}

                    <Step n={showErp ? 2 : 1} title={partnerTitle} hint={partnerHint}>
                        <div className="ot-buy__filters">
                            <input
                                className="ot-buy__search"
                                type="search"
                                placeholder="Search retailers, distributors, manufacturers…"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <label className="ot-buy__all">
                                <input type="checkbox" checked={allRegions} onChange={(e) => setAllRegions(e.target.checked)} />
                                Show partners in all regions
                            </label>
                        </div>
                        <div className="ot-buy__chips">
                            <button
                                type="button"
                                className={`ot-buy__chip${industry === "" ? " ot-buy__chip--on" : ""}`}
                                onClick={() => setIndustry("")}
                            >
                                All industries
                            </button>
                            {INDUSTRIES.map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`ot-buy__chip${industry === i ? " ot-buy__chip--on" : ""}`}
                                    onClick={() => setIndustry(i)}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                        <div className="ot-buy__partners">
                            {visiblePartners.map((p) => {
                                const on = selected.includes(p.name)
                                return (
                                    <button
                                        key={p.name}
                                        type="button"
                                        className={`ot-buy__partner${on ? " ot-buy__partner--on" : ""}`}
                                        onClick={() => toggle(p.name)}
                                        aria-pressed={on}
                                    >
                                        <span className="ot-buy__box">{on && <Check />}</span>
                                        <span className="ot-buy__partner-body">
                                            <span className="ot-buy__partner-name">
                                                {p.name}
                                                {p.popular && <span className="ot-buy__popular">Popular</span>}
                                            </span>
                                        </span>
                                    </button>
                                )
                            })}
                            {visiblePartners.length === 0 && (
                                <p className="ot-buy__empty">No pre-connected partner matches. Add it below and we will connect it for you.</p>
                            )}
                        </div>
                        <div className="ot-buy__custom">
                            <input
                                type="text"
                                placeholder="Can't find a partner? Type its name"
                                value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                            />
                            <button type="button" onClick={addCustom} className="ot-buy__secondary">
                                Add partner
                            </button>
                        </div>
                        {count > 0 && (
                            <div className="ot-buy__selected">
                                <strong>{count} selected:</strong>
                                {selected.map((n) => (
                                    <span key={n} className="ot-buy__pill">
                                        {n}
                                        <button type="button" aria-label={`Remove ${n}`} onClick={() => toggle(n)}>
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </Step>

                    <Step n={showErp ? 3 : 2} title={planTitle} hint={planHint}>
                        <div className="ot-buy__terms" role="tablist">
                            <button
                                type="button"
                                className={`ot-buy__term${term === "monthly" ? " ot-buy__term--on" : ""}`}
                                onClick={() => setTerm("monthly")}
                            >
                                {monthlyLabel}
                            </button>
                            <button
                                type="button"
                                className={`ot-buy__term${term === "yearly" ? " ot-buy__term--on" : ""}`}
                                onClick={() => setTerm("yearly")}
                            >
                                {annualLabel} <span className="ot-buy__saving">{annualSaving}</span>
                            </button>
                        </div>
                        <div className="ot-buy__plans">
                            {plans.map((p) => {
                                const a = attrs(p)
                                const isRec = recommended && p.id === recommended.id
                                const isOn = plan && p.id === plan.id
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className={`ot-buy__plan${isOn ? " ot-buy__plan--on" : ""}`}
                                        onClick={() => setChosenPlan(a.display_name__limio)}
                                    >
                                        {isRec && count > 0 && (
                                            <span className="ot-buy__rec">Recommended for {count} partner{count > 1 ? "s" : ""}</span>
                                        )}
                                        <span className="ot-buy__plan-name">{a.display_name__limio}</span>
                                        <span
                                            className="ot-buy__plan-price"
                                            dangerouslySetInnerHTML={{ __html: sanitize(a.display_price__limio) }}
                                        />
                                        <span className="ot-buy__plan-detail">
                                            {a.trading_partners__limio ? `${a.trading_partners__limio} partners · ` : ""}
                                            billed {term === "yearly" ? "annually" : "monthly"}
                                        </span>
                                        {showFeatures && (
                                            <ul className="ot-buy__plan-features">
                                                {featureRows(a.offer_features__limio).map((f, i) => (
                                                    <li key={i}>
                                                        <Check />
                                                        <span dangerouslySetInnerHTML={{ __html: sanitize(f) }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </button>
                                )
                            })}
                            {plans.length === 0 && <p className="ot-buy__empty">Plans load from the catalog in the live shop.</p>}
                        </div>
                        {plans.length > 0 && featuresLabel && (
                            <button
                                type="button"
                                className="ot-buy__features-toggle"
                                aria-expanded={showFeatures}
                                onClick={() => setShowFeatures(!showFeatures)}
                            >
                                {showFeatures ? "Hide features" : featuresLabel}
                                <span className={`ot-buy__chev${showFeatures ? " ot-buy__chev--up" : ""}`} aria-hidden="true">⌄</span>
                            </button>
                        )}
                        {overThreshold && enterpriseNudge && (
                            <div className="ot-buy__nudge">
                                <span dangerouslySetInnerHTML={{ __html: sanitize(enterpriseNudge) }} />
                                <a href={enterpriseHref}>Talk to our team →</a>
                            </div>
                        )}
                    </Step>

                    <Step n={showErp ? 4 : 3} title={onboardingTitle} hint={onboardingHint}>
                        <div className="ot-buy__onboard">
                            <button
                                type="button"
                                className={`ot-buy__option${onboarding === "diy" ? " ot-buy__option--on" : ""}`}
                                onClick={() => setOnboarding("diy")}
                            >
                                <span className="ot-buy__option-title">{diyTitle}</span>
                                <span className="ot-buy__option-body">{diyBody}</span>
                                <span className="ot-buy__option-price">Included</span>
                            </button>
                            <button
                                type="button"
                                className={`ot-buy__option${onboarding === "guided" ? " ot-buy__option--on" : ""}`}
                                onClick={() => setOnboarding("guided")}
                            >
                                <span className="ot-buy__option-title">{guidedTitle}</span>
                                <span className="ot-buy__option-body">{guidedBody}</span>
                                <span className="ot-buy__option-price">
                                    {addon("guided_onboarding") ? `${money(priceOf(addon("guided_onboarding")), currency)} one-off` : ""}
                                </span>
                            </button>
                        </div>
                        <label className="ot-buy__premium">
                            <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} />
                            <span>
                                {premiumLabel}
                                {addon("premium_support") && (
                                    <strong> +{money(priceOf(addon("premium_support")), currency)}/{per}</strong>
                                )}
                            </span>
                        </label>
                    </Step>
                </div>

                <aside className="ot-buy__summary">
                    <h3>Your order</h3>
                    {showErp && (
                        <p className="ot-buy__sum-meta">
                            ERP: <strong>{erpInfo ? erpInfo.name : "choose your ERP"}</strong>
                        </p>
                    )}
                    <p className="ot-buy__sum-meta">
                        Trading partners: <strong>{count || "none yet"}</strong>
                    </p>
                    <p className="ot-buy__sum-meta">
                        Data centre: <strong>{r.dataCentre}</strong>
                    </p>
                    <ul className="ot-buy__lines">
                        {lines.map((l, i) => (
                            <li key={i}>
                                <span>{l.label}</span>
                                <span>
                                    {money(l.amount, currency)}
                                    {l.recurring ? `/${per === "month" ? "mo" : "yr"}` : ""}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="ot-buy__total">
                        <span>Total</span>
                        <span>
                            {money(recurringTotal, currency)}/{per}
                        </span>
                    </div>
                    {oneOffTotal > 0 && (
                        <div className="ot-buy__total ot-buy__total--small">
                            <span>Due today, one-off</span>
                            <span>{money(oneOffTotal, currency)}</span>
                        </div>
                    )}
                    <button type="button" className="ot-buy__cta" disabled={!ready || busy} onClick={checkout}>
                        {busy ? "Preparing your checkout…" : ctaLabel}
                    </button>
                    {!ready && (
                        <p className="ot-buy__sum-hint">
                            {showErp && !erp ? "Pick your ERP and " : "Pick "}at least one trading partner to continue.
                        </p>
                    )}
                    {error && <p className="ot-buy__error">{error}</p>}
                    {promoHint && <div className="ot-buy__promo" dangerouslySetInnerHTML={{ __html: sanitize(promoHint) }} />}
                    {termsNote && <div className="ot-buy__terms-note" dangerouslySetInnerHTML={{ __html: sanitize(termsNote) }} />}
                </aside>
            </div>
        </div>
    )
}

const Wrapped = () => (
    <ErrorBoundary fallback={<div className="ot-buy"><p className="ot-buy__error">The store could not load. Please refresh.</p></div>}>
        <OtBuy />
    </ErrorBoundary>
)

export default Wrapped
