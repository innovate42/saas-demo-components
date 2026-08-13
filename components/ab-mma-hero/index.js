import React, { useMemo } from "react"
import { useUser, useSubscriptions } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/* ------------------------------------------------------------------ *
 * Self-contained helpers so this renders identically in Storybook,
 * the Page Builder and the shop.
 * ------------------------------------------------------------------ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const formatDay = (value) => {
  if (!value) return null
  const d = new Date(value)
  if (isNaN(d.getTime())) return null
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

const formatMoney = (amount, currency) => {
  if (amount === null || amount === undefined || amount === "") return null
  const n = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.-]/g, ""))
  if (isNaN(n)) return null
  const symbol = { GBP: "£", USD: "$", EUR: "€" }[currency] || "£"
  return `${symbol}${n.toFixed(2)}`
}

/** The current standard (non-discount) offer on a subscription. */
const getStandardOffer = (subscription) => {
  const entries = subscription?.offers || []
  const now = Date.now()
  const standard = entries.filter((entry) => {
    const data = entry?.data || {}
    if (data.record_subtype === "discount") return false
    const start = data.start ? new Date(data.start).getTime() : null
    const end = data.end ? new Date(data.end).getTime() : null
    if (start && start > now) return false
    if (end && end < now) return false
    return true
  })
  const chosen = standard[standard.length - 1] || entries[entries.length - 1]
  return chosen?.data?.offer || null
}

/** Next future payment on the schedule. */
const getNextPayment = (subscription) => {
  const schedule = subscription?.schedule || []
  const now = Date.now()
  const upcoming = schedule
    .filter((item) => {
      if (item?.status === "cancelled") return false
      const date = item?.data?.date ? new Date(item.data.date).getTime() : null
      return date && date >= now
    })
    .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  return upcoming[0] || null
}

/** term__limio is an object ({length, type, renewal_type…}) — never renderable. */
const formatTerm = (term) => {
  if (!term) return ""
  if (typeof term === "string") return term
  const length = term.length || 1
  const unit = String(term.type || "months").replace(/s$/, "")
  const period = length === 1 ? `Every ${unit}` : `Every ${length} ${unit}s`
  return term.renewal_type === "TERMED" ? `${period}, renews automatically` : period
}

const GeneratedCover = ({ brandName, issueLabel, lines }) => (
  <div className="abh-cover-art" role="img" aria-label={`${brandName} cover, ${issueLabel}`}>
    <div className="abh-cover-masthead">{brandName}</div>
    <div className="abh-cover-issue">{issueLabel}</div>
    <div className="abh-cover-lines">
      {lines.map((line, i) => (
        <span key={line.id || i} className="abh-cover-line">
          {line.label}
        </span>
      ))}
    </div>
    <div className="abh-cover-barcode" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <i key={i} style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1 }} />
      ))}
    </div>
  </div>
)

/* ------------------------------------------------------------------ */

const AbMmaHero = () => {
  const props = useStaticProps() || {}
  const {
    brandName = "Today's Golfer",
    brandTagline = "",
    accentColor__limio_color: accentColor = "#0B5D33",
    accentSoftColor__limio_color: accentSoft = "#EAF3ED",
    inkColor__limio_color: ink = "#10221A",
    highlightColor__limio_color: highlight = "#D8A32B",
    bodyFont = "'Helvetica Neue', Helvetica, Arial, sans-serif",
    monoFont = "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
    headingFont = "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
    paperColor__limio_color: paper = "#F2F3F0",
    coverImage = "",
    coverLines = [],
    issueLabel = "",
    greeting = "Welcome back",
    membershipLabel = "Subscriber no.",
    deliveryHeading = "Your next issue",
    deliveryStatusText = "",
    deliveryEtaText = "",
    fulfilmentPartner = "Air Business",
    showFulfilmentPartner = true,
    actions = [],
  } = props

  const { attributes = {} } = useUser() || {}
  const { subscriptions } = useSubscriptions() || {}

  const subscription = useMemo(() => {
    const list = subscriptions || []
    return list.find((s) => s?.status === "active") || list[0] || null
  }, [subscriptions])

  const details = useMemo(() => {
    if (!subscription) return null
    const offer = getStandardOffer(subscription)
    const offerAttributes = offer?.data?.attributes || {}
    const paymentData = getNextPayment(subscription)?.data || {}
    return {
      planName:
        offerAttributes.display_name__limio || offer?.data?.name || subscription.name || "Subscription",
      term: formatTerm(offerAttributes.term__limio),
      status: subscription.status || "active",
      reference: subscription.reference || subscription.id || "",
      nextAmount: formatMoney(paymentData.amount, paymentData.currency),
      nextDate: formatDay(paymentData.date),
      started: formatDay(subscription.created),
    }
  }, [subscription])

  const firstName = attributes?.firstName || attributes?.given_name || ""
  const cancelled = details?.status === "cancelled"

  const styleVars = {
    "--abh-accent": accentColor,
    "--abh-accent-soft": accentSoft,
    "--abh-ink": ink,
    "--abh-highlight": highlight,
    "--abh-heading-font": headingFont,
    "--abh-body-font": bodyFont,
    "--abh-mono": monoFont,
    "--abh-paper": paper,
  }

  const withSubId = (url) => {
    const id = subscription?.id
    if (!url || !id) return url || "#"
    if (url.indexOf("subId=") !== -1) return url
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "subId=" + encodeURIComponent(id)
  }

  const steps = [
    { label: "Printed", note: "11 Aug", done: true },
    { label: "Dispatched", note: "12 Aug", done: true },
    { label: "With Royal Mail", note: "Due 18 Aug", done: false },
  ]

  return (
    <section className="abh" style={styleVars}>
      <div className="abh-inner">
        <header className="abh-masthead">
          <p className="abh-eyebrow">
            {greeting}
            {firstName ? `, ${firstName}` : ""}
          </p>
          <h1 className="abh-title">Your {brandName} subscription</h1>
          {brandTagline ? <p className="abh-tagline">{brandTagline}</p> : null}

          <div className="abh-metaline">
            {details?.reference ? (
              <span>
                {membershipLabel} <b>{details.reference}</b>
              </span>
            ) : null}
            {details?.started ? (
              <span>
                Subscriber since <b>{details.started}</b>
              </span>
            ) : null}
            {details?.nextDate ? (
              <span>
                Renews <b>{details.nextDate}</b>
              </span>
            ) : null}
            <span>
              Fulfilment <b>{fulfilmentPartner}</b>
            </span>
          </div>
        </header>

        <div className="abh-grid">
          <div className="abh-cover-wrap">
            {coverImage ? (
              <img className="abh-cover-img" src={coverImage} alt={`${brandName} — ${issueLabel}`} />
            ) : (
              <GeneratedCover brandName={brandName} issueLabel={issueLabel} lines={coverLines} />
            )}
            {issueLabel ? (
              <span className="abh-cover-caption">Current issue — {issueLabel}</span>
            ) : null}
          </div>

          <div>
            <div className="abh-plan-head">
              <div>
                <span className="abh-label">Current plan</span>
                <h2 className="abh-plan">{details?.planName || "Print + Digital"}</h2>
              </div>
              <span className={`abh-status ${cancelled ? "is-off" : ""}`}>
                {cancelled ? "Cancelled" : "Active"}
              </span>
            </div>

            <dl className="abh-rows">
              <div className="abh-row">
                <dt>Next payment</dt>
                <dd>
                  {details?.nextAmount ? <strong>{details.nextAmount}</strong> : <span className="abh-muted">—</span>}
                  {details?.nextDate ? <span className="abh-sub"> on {details.nextDate}</span> : null}
                </dd>
              </div>
              <div className="abh-row">
                <dt>Billing period</dt>
                <dd>{details?.term || "Monthly, rolling"}</dd>
              </div>
              <div className="abh-row">
                <dt>Delivery address</dt>
                <dd>Rockwood House, Haywards Heath RH16 3TW</dd>
              </div>
            </dl>

            {showFulfilmentPartner ? (
              <div className="abh-delivery">
                <div className="abh-delivery-head">
                  <span className="abh-label">{deliveryHeading}</span>
                  <span className="abh-partner">
                    Fulfilled by <strong>{fulfilmentPartner}</strong>
                  </span>
                </div>
                <div className="abh-track">
                  {steps.map((step) => (
                    <div key={step.label} className={`abh-step ${step.done ? "is-done" : "is-next"}`}>
                      <span className="abh-step-label">{step.label}</span>
                      <span className="abh-step-note">{step.note}</span>
                    </div>
                  ))}
                </div>
                {deliveryStatusText ? (
                  <p className="abh-delivery-text">
                    {deliveryStatusText}
                    {deliveryEtaText ? <strong> · {deliveryEtaText}</strong> : null}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {actions?.length ? (
          <nav className="abh-actions" aria-label="Manage your subscription">
            {actions.map((action, i) => (
              <a
                key={action.id || i}
                className={`abh-action ${action.icon === "cancel" ? "is-quiet" : ""}`}
                href={withSubId(action.url)}
              >
                <span className="abh-action-index" aria-hidden="true">
                  →
                </span>
                <span className="abh-action-label">{action.label}</span>
                {action.note ? <span className="abh-action-note">{action.note}</span> : <span />}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  )
}

export default AbMmaHero
