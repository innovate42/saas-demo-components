import React, { useMemo, useState } from "react"
import { useSubscriptions } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/** Current standard (non-discount) offer on the subscription. */
const getStandardOffer = (subscription) => {
  const entries = subscription?.offers || []
  const now = Date.now()
  const active = entries.filter((entry) => {
    const data = entry?.data || {}
    if (data.record_subtype === "discount") return false
    const start = data.start ? new Date(data.start).getTime() : null
    const end = data.end ? new Date(data.end).getTime() : null
    if (start && start > now) return false
    if (end && end < now) return false
    return true
  })
  return (active[active.length - 1] || entries[entries.length - 1])?.data?.offer || null
}

const AbCancel = () => {
  const props = useStaticProps() || {}
  const {
    eyebrow = "",
    offerLabel = "",
    heading = "",
    subheading = "",
    continueLabel = "Continue",
    backLabel = "",
    backUrl = "",
    planSummaryLabel = "",
    reasons = [],
    accentColor__limio_color: accent = "#0B5D33",
    accentSoftColor__limio_color: accentSoft = "#EAF3ED",
    inkColor__limio_color: ink = "#10221A",
    paperColor__limio_color: paper = "#F6F5F1",
    bodyFont = "'Helvetica Neue', Helvetica, Arial, sans-serif",
    monoFont = "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
    headingFont = "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
  } = props

  const { subscriptions } = useSubscriptions() || {}
  const [selected, setSelected] = useState("")

  const subscription = useMemo(() => {
    const list = subscriptions || []
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
    const subId = params?.get("subId")
    if (subId) {
      const match = list.find((s) => s?.id === subId)
      if (match) return match
    }
    const labelOf = (sub) => {
      const out = []
      for (const entry of sub?.offers || []) {
        const l = entry?.data?.offer?.data?.attributes?.label__limio
        if (Array.isArray(l)) out.push(...l)
        else if (l) out.push(l)
      }
      return out
    }
    const branded = offerLabel ? list.filter((s) => labelOf(s).indexOf(offerLabel) !== -1) : []
    const pick = (arr) => arr.find((s) => s?.status === "active") || arr[0] || null
    return pick(branded) || pick(list)
  }, [subscriptions, offerLabel])

  const planName = useMemo(() => {
    const offer = getStandardOffer(subscription)
    return offer?.data?.attributes?.display_name__limio || offer?.data?.name || subscription?.name || ""
  }, [subscription])

  const chosen = reasons.find((reason) => (reason.id || reason.label) === selected)

  /* Keep subId on the destination — the change-plan and save-offer pages both
     resolve which subscription they are acting on from the query string. */
  const destination = useMemo(() => {
    if (!chosen?.url) return null
    const id = subscription?.id
    if (!id) return chosen.url
    const sep = chosen.url.indexOf("?") === -1 ? "?" : "&"
    return `${chosen.url}${sep}subId=${encodeURIComponent(id)}&reason=${encodeURIComponent(chosen.id || "")}`
  }, [chosen, subscription])

  const styleVars = {
    "--abc-accent": accent,
    "--abc-accent-soft": accentSoft,
    "--abc-ink": ink,
    "--abc-paper": paper,
    "--abc-heading-font": headingFont,
    "--abc-body-font": bodyFont,
    "--abc-mono": monoFont,
  }

  return (
    <section className="abc" style={styleVars}>
      <div className="abc-inner">
        <header className="abc-head">
          {eyebrow ? <p className="abc-eyebrow">{eyebrow}</p> : null}
          {heading ? <h1 className="abc-title">{heading}</h1> : null}
          {subheading ? <p className="abc-sub">{subheading}</p> : null}
        </header>

        {planName && planSummaryLabel ? (
          <div className="abc-plan">
            <span className="abc-plan-label">{planSummaryLabel}</span>
            <span className="abc-plan-name">{planName}</span>
          </div>
        ) : null}

        <div className="abc-reasons" role="radiogroup" aria-label={heading}>
          {reasons.map((reason, i) => {
            const value = reason.id || reason.label || String(i)
            const isSelected = selected === value
            return (
              <label key={value} className={`abc-reason ${isSelected ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="cancel-reason"
                  value={value}
                  checked={isSelected}
                  onChange={() => setSelected(value)}
                />
                <span className="abc-radio" aria-hidden="true" />
                <span className="abc-reason-text">
                  <span className="abc-reason-label">{reason.label}</span>
                  {reason.description ? (
                    <span className="abc-reason-desc">{reason.description}</span>
                  ) : null}
                </span>
              </label>
            )
          })}
        </div>

        <div className="abc-actions">
          <a
            className={`abc-continue ${destination ? "" : "is-disabled"}`}
            href={destination || "#"}
            aria-disabled={destination ? "false" : "true"}
            onClick={(event) => {
              if (!destination) event.preventDefault()
            }}
          >
            {continueLabel}
          </a>
          {backUrl && backLabel ? (
            <a className="abc-back" href={backUrl}>
              {backLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AbCancel
