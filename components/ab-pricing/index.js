import React, { useMemo } from "react"
import { useBasket, useCampaign, useLimioContext, sanitiseHTML } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/* ------------------------------------------------------------------ */

const priceOf = (offer) => {
  const charge = offer?.data?.attributes?.price__limio?.[0]
  const value = parseFloat(charge?.value)
  return isNaN(value) ? 0 : value
}

const currencyOf = (offer) => {
  const code = offer?.data?.attributes?.price__limio?.[0]?.currencyCode
  return { GBP: "£", USD: "$", EUR: "€" }[code] || "£"
}

/** "a month" / "a year" from the offer's term. */
const cadenceOf = (offer) => {
  const term = offer?.data?.attributes?.term__limio || {}
  const length = term.length || 1
  const unit = String(term.type || "months").replace(/s$/, "")
  if (length === 1) return unit === "year" ? "a year" : `a ${unit}`
  return `every ${length} ${unit}s`
}

const Mark = ({ struck }) => (
  <span className="abp-feature-tick" aria-hidden="true">{struck ? "—" : "✓"}</span>
)

/** Pull <li> text out of the offer's rich-text feature list. */
const featuresOf = (offer) => {
  const html = offer?.data?.attributes?.offer_features__limio || ""
  if (!html) return []
  const items = html.match(/<li[\s\S]*?<\/li>/gi) || []
  return items.map((item) => ({
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
    bestValueLabel = "Most popular",
    ctaFallback = "Subscribe",
    accentColor__limio_color: accent = "#0B5D33",
    accentDarkColor__limio_color: accentDark = "#073B20",
    accentSoftColor__limio_color: accentSoft = "#EAF3ED",
    inkColor__limio_color: ink = "#10221A",
    highlightColor__limio_color: highlight = "#D8A32B",
    highlightInkColor__limio_color: highlightInk = "#16240B",
    paperColor__limio_color: paper = "#F6F5F1",
    headingFont = "'Archivo', 'Helvetica Neue', Arial, sans-serif",
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

  /* Cheapest first, so the ladder reads naturally left to right. */
  const plans = useMemo(() => {
    if (!Array.isArray(offers)) return []
    return [...offers].sort((a, b) => priceOf(a) - priceOf(b))
  }, [offers])

  const handleBuy = async (offer) => {
    try {
      if (orderItems?.length > 0) {
        await addOfferToBasket({ offer, quantity: 1 })
      } else {
        await initiateCheckout({ order: { orderItems: [{ offer, quantity: 1 }] } })
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
  }

  return (
    <div className="abp" style={styleVars}>
      {/* ---------------- Hero ---------------- */}
      <section className="abp-hero">
        <div className="abp-hero-inner">
          <div className="abp-hero-copy">
            {eyebrow ? <p className="abp-eyebrow">{eyebrow}</p> : null}
            {headline ? <h1 className="abp-headline">{headline}</h1> : null}
            {subheadline ? <p className="abp-sub">{subheadline}</p> : null}
            {trustPoints?.length ? (
              <ul className="abp-trust">
                {trustPoints.map((point, i) => (
                  <li key={point.id || i}>
                    <span className="abp-trust-tick" aria-hidden="true">✓</span>
                    {point.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="abp-hero-art">
            {coverImage ? (
              <>
                <img className="abp-cover" src={coverImage} alt={`${brandName} — ${issueLabel}`} />
                {issueLabel ? <span className="abp-issue">{issueLabel}</span> : null}
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- Plans ---------------- */}
      <section className="abp-plans">
        {plansHeading ? <h2 className="abp-plans-heading">{plansHeading}</h2> : null}

        <div className="abp-grid">
          {plans.map((offer, i) => {
            const attributes = offer?.data?.attributes || {}
            const best = !!attributes.best_value__limio
            const features = featuresOf(offer)
            const symbol = currencyOf(offer)
            const amount = priceOf(offer)
            return (
              <article
                key={offer?.id || offer?.path || i}
                className={`abp-card ${best ? "is-best" : ""}`}
              >
                <span className="abp-badge">{best ? bestValueLabel : " "}</span>

                <h3 className="abp-card-name">
                  {attributes.display_name__limio || offer?.data?.name || "Subscription"}
                </h3>

                <p className="abp-price">
                  <span className="abp-price-value">
                    {symbol}
                    {amount.toFixed(2)}
                  </span>
                  <span className="abp-price-cadence">{cadenceOf(offer)}</span>
                </p>

                {attributes.detailed_display_price__limio ? (
                  <div
                    className="abp-blurb"
                    dangerouslySetInnerHTML={{
                      __html: sanitiseHTML(attributes.detailed_display_price__limio),
                    }}
                  />
                ) : null}

                {features.length ? (
                  <ul className="abp-features">
                    {features.map((feature, index) => (
                      <li key={index} className={feature.struck ? "is-off" : ""}>
                        <Mark struck={feature.struck} />
                        <span dangerouslySetInnerHTML={{ __html: feature.html }} />
                      </li>
                    ))}
                  </ul>
                ) : null}

                <button
                  type="button"
                  className="abp-cta"
                  disabled={basketLoading}
                  onClick={() => handleBuy(offer)}
                >
                  {basketLoading ? "One moment…" : attributes.cta_text__limio || ctaFallback}
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default AbPricing
