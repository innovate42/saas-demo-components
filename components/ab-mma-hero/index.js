import React, { useMemo } from "react"
import { useUser, useSubscriptions } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/* ------------------------------------------------------------------ *
 * Small inline helpers — this component is deliberately self-contained
 * so it renders identically in Storybook, the Page Builder and the shop.
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
  const symbols = { GBP: "£", USD: "$", EUR: "€" }
  const symbol = symbols[currency] || "£"
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
      const status = item?.status
      if (status === "cancelled") return false
      const date = item?.data?.date ? new Date(item.data.date).getTime() : null
      return date && date >= now
    })
    .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  return upcoming[0] || null
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

const Icon = ({ name }) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  }
  switch (name) {
    case "plan":
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h10" />
        </svg>
      )
    case "delivery":
      return (
        <svg {...common}>
          <path d="M3 8h11v9H3zM14 11h4l3 3v3h-7z" />
          <circle cx="7" cy="19" r="1.6" />
          <circle cx="17.5" cy="19" r="1.6" />
        </svg>
      )
    case "billing":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
          <path d="M2.5 10h19" />
        </svg>
      )
    case "cancel":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 9l6 6M15 9l-6 6" />
        </svg>
      )
    case "gift":
      return (
        <svg {...common}>
          <rect x="3" y="9" width="18" height="12" rx="1.5" />
          <path d="M3 13h18M12 9v12M12 9S9.5 4 7.5 5.5 9 9 12 9zM12 9s2.5-5 4.5-3.5S15 9 12 9z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

/* ------------------------------------------------------------------ *
 * Generated magazine cover — used when no cover image is supplied.
 * ------------------------------------------------------------------ */

const GeneratedCover = ({ brandName, issueLabel, lines, headingFont }) => (
  <div className="abh-cover-art" role="img" aria-label={`${brandName} cover, ${issueLabel}`}>
    <div className="abh-cover-masthead" style={{ fontFamily: headingFont }}>
      {brandName}
    </div>
    <div className="abh-cover-issue">{issueLabel}</div>
    <div className="abh-cover-lines">
      {lines.map((line, i) => (
        <span key={line.id || i} className={`abh-cover-line abh-cover-line-${i % 3}`}>
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
    headingFont = '"Georgia", "Times New Roman", serif',
    coverImage = "",
    coverLines = [],
    issueLabel = "",
    greeting = "Welcome back",
    membershipLabel = "Subscriber number",
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
    const nextPayment = getNextPayment(subscription)
    const paymentData = nextPayment?.data || {}
    return {
      planName:
        offerAttributes.display_name__limio ||
        offer?.data?.name ||
        subscription.name ||
        "Subscription",
      term: offerAttributes.term__limio || "",
      status: subscription.status || "active",
      reference: subscription.reference || subscription.id || "",
      nextAmount: formatMoney(paymentData.amount, paymentData.currency),
      nextDate: formatDay(paymentData.date),
      started: formatDay(subscription.created),
    }
  }, [subscription])

  const firstName = attributes?.firstName || attributes?.given_name || ""

  const styleVars = {
    "--abh-accent": accentColor,
    "--abh-accent-soft": accentSoft,
    "--abh-ink": ink,
    "--abh-highlight": highlight,
    "--abh-heading-font": headingFont,
  }

  const steps = [
    { label: "Printed", done: true },
    { label: "Dispatched", done: true },
    { label: "On its way", done: false },
  ]

  return (
    <section className="abh" style={styleVars}>
      <div className="abh-inner">
        {/* ---------- Masthead ---------- */}
        <header className="abh-masthead">
          <div>
            <p className="abh-eyebrow">
              {greeting}
              {firstName ? `, ${firstName}` : ""}
            </p>
            <h1 className="abh-title">Your {brandName} subscription</h1>
            {brandTagline ? <p className="abh-tagline">{brandTagline}</p> : null}
          </div>
          {details?.reference ? (
            <div className="abh-ref">
              <span className="abh-ref-label">{membershipLabel}</span>
              <span className="abh-ref-value">{details.reference}</span>
            </div>
          ) : null}
        </header>

        {/* ---------- Main card ---------- */}
        <div className="abh-grid">
          <div className="abh-cover-wrap">
            {coverImage ? (
              <img className="abh-cover-img" src={coverImage} alt={`${brandName} — ${issueLabel}`} />
            ) : (
              <GeneratedCover
                brandName={brandName}
                issueLabel={issueLabel}
                lines={coverLines}
                headingFont={headingFont}
              />
            )}
            <span className="abh-cover-badge">{issueLabel}</span>
          </div>

          <div className="abh-panel">
            <div className="abh-panel-head">
              <div>
                <span className="abh-label">Current plan</span>
                <h2 className="abh-plan">{details?.planName || "Print + Digital"}</h2>
              </div>
              <span className={`abh-pill abh-pill-${details?.status === "cancelled" ? "off" : "on"}`}>
                {details?.status === "cancelled" ? "Cancelled" : "Active"}
              </span>
            </div>

            <dl className="abh-rows">
              <div className="abh-row">
                <dt>Next payment</dt>
                <dd>
                  {details?.nextAmount ? (
                    <strong>{details.nextAmount}</strong>
                  ) : (
                    <span className="abh-muted">—</span>
                  )}
                  {details?.nextDate ? <span className="abh-sub"> on {details.nextDate}</span> : null}
                </dd>
              </div>
              <div className="abh-row">
                <dt>Billing period</dt>
                <dd>{details?.term || "Monthly, rolling"}</dd>
              </div>
              <div className="abh-row">
                <dt>Subscriber since</dt>
                <dd>{details?.started || "—"}</dd>
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
                <div className="abh-track" role="list">
                  {steps.map((step, i) => (
                    <div
                      key={step.label}
                      role="listitem"
                      className={`abh-step ${step.done ? "is-done" : "is-next"}`}
                    >
                      <span className="abh-dot">{step.done ? <Check /> : null}</span>
                      <span className="abh-step-label">{step.label}</span>
                      {i < steps.length - 1 ? <span className="abh-bar" aria-hidden="true" /> : null}
                    </div>
                  ))}
                </div>
                <p className="abh-delivery-text">
                  {deliveryStatusText}
                  {deliveryEtaText ? <strong> · {deliveryEtaText}</strong> : null}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* ---------- Quick actions ---------- */}
        {actions?.length ? (
          <nav className="abh-actions" aria-label="Manage your subscription">
            {actions.map((action, i) => (
              <a
                key={action.id || i}
                className={`abh-action ${action.icon === "cancel" ? "is-quiet" : ""}`}
                href={action.url || "#"}
              >
                <span className="abh-action-icon">
                  <Icon name={action.icon} />
                </span>
                <span className="abh-action-label">{action.label}</span>
                <span className="abh-action-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </section>
  )
}

export default AbMmaHero
