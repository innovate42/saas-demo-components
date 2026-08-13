import React, { useEffect, useMemo, useState } from "react"
import { useBasket, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/* ------------------------------------------------------------------ */

const priceOf = (offer) => {
  const value = parseFloat(offer?.data?.attributes?.price__limio?.[0]?.value)
  return isNaN(value) ? 0 : value
}

const symbolOf = (offer) => {
  const code = offer?.data?.attributes?.price__limio?.[0]?.currencyCode
  return { GBP: "£", USD: "$", EUR: "€" }[code] || "£"
}

const termOf = (offer) => {
  const term = offer?.data?.attributes?.term__limio || {}
  const length = term.length || 1
  const unit = String(term.type || "months").replace(/s$/, "")
  return { length, unit, isYear: unit === "year" }
}

/** Publishers quote everything per month so plans compare at a glance. */
const monthlyEquivalent = (offer) => {
  const { length, isYear } = termOf(offer)
  const months = isYear ? length * 12 : length
  return months > 0 ? priceOf(offer) / months : priceOf(offer)
}

const cadenceLabel = (offer) => {
  const { length, unit } = termOf(offer)
  return length === 1 ? `every ${unit}` : `every ${length} ${unit}s`
}

/** Feature lines from the offer's rich text. */
const featuresOf = (offer) => {
  const html = offer?.data?.attributes?.offer_features__limio || ""
  return (html.match(/<li[\s\S]*?<\/li>/gi) || []).map((item) => ({
    struck: /<s>|<del>/i.test(item),
    html: sanitiseHTML(item.replace(/<\/?li[^>]*>/gi, "")),
  }))
}

/* ------------------------------------------------------------------ */

const AbPricing = () => {
  const { offers } = useCampaign() || {}
  const basket = useBasket() || {}
  const { isInPageBuilder } = useLimioContext() || {}
  const props = useStaticProps() || {}

  const {
    brandName = "",
    eyebrow = "",
    headline = "",
    subheadline = "",
    coverImage = "",
    issueLabel = "",
    plansHeading = "",
    bestValueLabel = "Best value",
    ctaFallback = "Continue to checkout",
    footnote = "",
    accentColor__limio_color: accent = "#2667A7",
    accentDarkColor__limio_color: accentDark = "#1B4A7A",
    accentSoftColor__limio_color: accentSoft = "#E7EFF7",
    inkColor__limio_color: ink = "#222222",
    highlightColor__limio_color: highlight = "#F2C300",
    highlightInkColor__limio_color: highlightInk = "#222222",
    paperColor__limio_color: paper = "#F1F2F4",
    bodyFont = "'Helvetica Neue', Helvetica, Arial, sans-serif",
    monoFont = "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
    headingFont = "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
    trustPoints = [],
  } = props

  const {
    addOfferToBasket,
    initiateCheckout,
    navigateToCheckout,
    pageOptions,
    orderItems,
    basketLoading,
  } = basket

  /* Cheapest per month first — the ladder a subscriber actually compares on. */
  const plans = useMemo(() => {
    if (!Array.isArray(offers)) return []
    return [...offers].sort((a, b) => monthlyEquivalent(a) - monthlyEquivalent(b))
  }, [offers])

  const best = useMemo(
    () => plans.find((o) => o?.data?.attributes?.best_value__limio) || plans[plans.length - 1] || null,
    [plans]
  )

  const [selectedPath, setSelectedPath] = useState("")

  useEffect(() => {
    if (!selectedPath && best) setSelectedPath(best.path || best.id || "")
  }, [best, selectedPath])

  const selected = useMemo(
    () => plans.find((o) => (o.path || o.id) === selectedPath) || best || null,
    [plans, selectedPath, best]
  )

  const handleBuy = async () => {
    if (!selected) return
    try {
      if (orderItems?.length > 0) {
        await addOfferToBasket({ offer: selected, quantity: 1 })
      } else {
        await initiateCheckout({ order: { orderItems: [{ offer: selected, quantity: 1 }] } })
      }
      if (pageOptions?.pushToCheckout !== false && navigateToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error("ab-pricing: add to basket failed", error)
    }
  }

  if (!plans.length && !isInPageBuilder) return null

  const styleVars = {
    "--abp-accent": accent,
    "--abp-accent-dark": accentDark,
    "--abp-accent-soft": accentSoft,
    "--abp-ink": ink,
    "--abp-highlight": highlight,
    "--abp-highlight-ink": highlightInk,
    "--abp-paper": paper,
    "--abp-heading-font": headingFont,
    "--abp-body-font": bodyFont,
    "--abp-mono": monoFont,
  }

  const features = selected ? featuresOf(selected) : []

  return (
    <div className="abp" style={styleVars}>
      <div className="abp-inner">
        <div className="abp-cols">
          <div className="abp-choose">
            {eyebrow ? <p className="abp-eyebrow">{eyebrow}</p> : null}
            {headline ? <h1 className="abp-headline">{headline}</h1> : null}
            {subheadline ? <p className="abp-sub">{subheadline}</p> : null}

            {plansHeading ? <p className="abp-plans-heading">{plansHeading}</p> : null}

            <div className="abp-plans" role="radiogroup" aria-label={plansHeading || "Plans"}>
              {plans.map((offer, i) => {
                const path = offer.path || offer.id || String(i)
                const attributes = offer?.data?.attributes || {}
                const isSelected = (selected?.path || selected?.id) === path
                const isBest = (best?.path || best?.id) === path
                const symbol = symbolOf(offer)
                return (
                  <label key={path} className={`abp-plan ${isSelected ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="ab-plan"
                      value={path}
                      checked={isSelected}
                      onChange={() => setSelectedPath(path)}
                    />
                    <span className="abp-radio" aria-hidden="true" />
                    <span className="abp-plan-body">
                      <span className="abp-plan-top">
                        <span className="abp-plan-name">
                          {attributes.display_name__limio || offer?.data?.name || "Subscription"}
                          {isBest && bestValueLabel ? <em className="abp-flag">{bestValueLabel}</em> : null}
                        </span>
                        <span className="abp-plan-price">
                          {symbol}
                          {monthlyEquivalent(offer).toFixed(2)}
                          <span className="abp-per">/month</span>
                        </span>
                      </span>
                      <span className="abp-plan-note">
                        {symbol}
                        {priceOf(offer).toFixed(2)} {cadenceLabel(offer)}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>

            <button
              type="button"
              className="abp-cta"
              disabled={basketLoading || !selected}
              onClick={handleBuy}
            >
              {basketLoading ? "One moment…" : ctaFallback}
            </button>

            {footnote ? <p className="abp-footnote">{footnote}</p> : null}
          </div>

          <aside className="abp-aside">
            {coverImage ? (
              <img className="abp-cover" src={coverImage} alt={`${brandName} — ${issueLabel}`} />
            ) : null}
            {issueLabel ? <span className="abp-issue">On sale now — {issueLabel}</span> : null}
          </aside>
        </div>

        {features.length ? (
          <div className="abp-included">
            <p className="abp-included-head">
              What&rsquo;s included with{" "}
              {selected?.data?.attributes?.display_name__limio || "your subscription"}
            </p>
            <ul className="abp-features">
              {features.map((feature, index) => (
                <li key={index} className={feature.struck ? "is-off" : ""}>
                  <span className="abp-mark" aria-hidden="true">
                    {feature.struck ? "—" : "✓"}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: feature.html }} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {trustPoints?.length ? (
          <ul className="abp-trust">
            {trustPoints.map((point, i) => (
              <li key={point.id || i}>{point.label}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

export default AbPricing
