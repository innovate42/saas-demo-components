import React, { useMemo, useState } from "react"
import { useUser } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

/* Icons are inline so the component carries no font/CDN dependency. */
const Icon = ({ name }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
  }
  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  }
  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    )
  }
  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
        <path d="m3 6 9 6.5L21 6" />
      </svg>
    )
  }
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5.2l3.2 1.9" />
      </svg>
    )
  }
  if (name === "arrow") {
    return (
      <svg {...common} width="16" height="16">
        <path d="M5 12h13" />
        <path d="m12.5 6 6 6-6 6" />
      </svg>
    )
  }
  if (name === "tick") {
    return (
      <svg {...common} width="22" height="22">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  return null
}

const splitAddress = (address) =>
  String(address || "")
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean)

/** Digits only, so the tel: link works from a phone. The bracketed trunk code
    in "+44 (0)1727 890 600" is for domestic dialling and must not survive into
    an international tel: link. */
const telHref = (phone) =>
  `tel:${String(phone || "")
    .replace(/\(\s*0\s*\)/g, "")
    .replace(/[^\d+]/g, "")}`

const mapFallback = (office) =>
  office?.mapUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [office?.name, office?.address].filter(Boolean).join(", ")
  )}`

const Office = ({ office }) => {
  const lines = splitAddress(office.address)
  return (
    <div className="abc-office">
      <h3 className="abc-office-name">{office.name}</h3>

      {lines.length > 0 && (
        <div className="abc-row">
          <span className="abc-row-icon">
            <Icon name="pin" />
          </span>
          <div className="abc-row-body">
            <address className="abc-address">
              {lines.map((line, i) => (
                <span key={`${office.id || office.name}-line-${i}`}>{line}</span>
              ))}
            </address>
            <a
              className="abc-maplink"
              href={mapFallback(office)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {office.mapLabel || "View map and directions"}
              <Icon name="arrow" />
            </a>
          </div>
        </div>
      )}

      {office.phone && (
        <div className="abc-row">
          <span className="abc-row-icon">
            <Icon name="phone" />
          </span>
          <div className="abc-row-body">
            <a className="abc-strong-link" href={telHref(office.phone)}>
              {office.phone}
            </a>
          </div>
        </div>
      )}

      {office.email && (
        <div className="abc-row">
          <span className="abc-row-icon">
            <Icon name="mail" />
          </span>
          <div className="abc-row-body">
            <a className="abc-strong-link" href={`mailto:${office.email}`}>
              {office.email}
            </a>
          </div>
        </div>
      )}

      {office.hours && (
        <div className="abc-row">
          <span className="abc-row-icon">
            <Icon name="clock" />
          </span>
          <div className="abc-row-body">
            <p className="abc-muted">{office.hours}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AbContact(limioProps) {
  const props = { ...useStaticProps(), ...(limioProps || {}) }
  const {
    eyebrow = "Customer services",
    heading = "Contact us",
    standfirst = "",
    accentColor__limio_color: accentColor = "#2667A7",
    accentSoftColor__limio_color: accentSoftColor = "#E7EFF7",
    inkColor__limio_color: inkColor = "#222222",
    headingFont = "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
    bodyFont = "'Helvetica Neue', Helvetica, Arial, sans-serif",
    monoFont = "'Roboto Mono', ui-monospace, Menlo, Consolas, monospace",
    officesHeading = "Where to find us",
    offices = [],
    showForm = true,
    formHeading = "Send us a message",
    formIntro = "",
    subjects = [],
    consentText = "",
    privacyNote = "",
    submitLabel = "Send message",
    successHeading = "Thanks — we've got it",
    successBody = "",
  } = props

  const { attributes = {} } = useUser() || {}

  /* Prefill from the signed-in subscriber when there is one — this page is
     authenticated, so on the account journey the form is nearly done already. */
  const [form, setForm] = useState(() => ({
    name: [attributes.firstName, attributes.lastName].filter(Boolean).join(" "),
    email: attributes.email || "",
    subscriberNo: "",
    subject: "",
    message: "",
    consent: false,
  }))
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const subjectOptions = useMemo(
    () => (subjects || []).filter((s) => s && (s.label || s.id)),
    [subjects]
  )

  const set = (field) => (event) => {
    const value =
      event.target.type === "checkbox" ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = "Please tell us your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Please enter a valid email address."
    if (!form.subject) next.subject = "Please choose a subject."
    if (!form.message.trim()) next.message = "Please tell us how we can help."
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSent(true)
  }

  const style = {
    "--abc-accent": accentColor,
    "--abc-accent-soft": accentSoftColor,
    "--abc-ink": inkColor,
    "--abc-heading-font": headingFont,
    "--abc-body-font": bodyFont,
    "--abc-mono": monoFont,
  }

  return (
    <section className="abc" style={style}>
      <div className="abc-inner">
        <header className="abc-masthead">
          {eyebrow && <p className="abc-eyebrow">{eyebrow}</p>}
          <h2 className="abc-title">{heading}</h2>
          {standfirst && <p className="abc-standfirst">{standfirst}</p>}
        </header>

        <div className={`abc-grid${showForm ? "" : " abc-grid-single"}`}>
          <div className="abc-col">
            <h4 className="abc-section-label">{officesHeading}</h4>
            {(offices || []).map((office, i) => (
              <Office key={office.id || office.name || i} office={office} />
            ))}
          </div>

          {showForm && (
            <div className="abc-col abc-col-form">
              <h4 className="abc-section-label">{formHeading}</h4>

              {sent ? (
                <div className="abc-success" role="status">
                  <span className="abc-success-mark">
                    <Icon name="tick" />
                  </span>
                  <h3 className="abc-success-heading">{successHeading}</h3>
                  {successBody && <p className="abc-muted">{successBody}</p>}
                  <dl className="abc-receipt">
                    <div>
                      <dt>Reference</dt>
                      <dd>
                        TG-
                        {String(Date.now()).slice(-6)}
                      </dd>
                    </div>
                    <div>
                      <dt>Reply to</dt>
                      <dd>{form.email}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className="abc-link-button"
                    onClick={() => setSent(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="abc-form" onSubmit={onSubmit} noValidate>
                  {formIntro && <p className="abc-muted abc-form-intro">{formIntro}</p>}

                  <div className="abc-field">
                    <label htmlFor="abc-name">Your name</label>
                    <input
                      id="abc-name"
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      aria-invalid={errors.name ? "true" : undefined}
                    />
                    {errors.name && <p className="abc-error">{errors.name}</p>}
                  </div>

                  <div className="abc-field-row">
                    <div className="abc-field">
                      <label htmlFor="abc-email">Email address</label>
                      <input
                        id="abc-email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        aria-invalid={errors.email ? "true" : undefined}
                      />
                      {errors.email && <p className="abc-error">{errors.email}</p>}
                    </div>
                    <div className="abc-field">
                      <label htmlFor="abc-subno">
                        Subscriber no. <span className="abc-optional">optional</span>
                      </label>
                      <input
                        id="abc-subno"
                        type="text"
                        value={form.subscriberNo}
                        onChange={set("subscriberNo")}
                        placeholder="e.g. TG1234567"
                      />
                    </div>
                  </div>

                  <div className="abc-field">
                    <label htmlFor="abc-subject">What's it about?</label>
                    <select
                      id="abc-subject"
                      value={form.subject}
                      onChange={set("subject")}
                      aria-invalid={errors.subject ? "true" : undefined}
                    >
                      <option value="">Choose a subject</option>
                      {subjectOptions.map((s) => (
                        <option key={s.id || s.label} value={s.id || s.label}>
                          {s.label || s.id}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <p className="abc-error">{errors.subject}</p>}
                  </div>

                  <div className="abc-field">
                    <label htmlFor="abc-message">How can we help?</label>
                    <textarea
                      id="abc-message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      aria-invalid={errors.message ? "true" : undefined}
                    />
                    {errors.message && <p className="abc-error">{errors.message}</p>}
                  </div>

                  {consentText && (
                    <label className="abc-consent" htmlFor="abc-consent">
                      <input
                        id="abc-consent"
                        type="checkbox"
                        checked={form.consent}
                        onChange={set("consent")}
                      />
                      <span>{consentText}</span>
                    </label>
                  )}

                  <button type="submit" className="abc-submit">
                    {submitLabel}
                  </button>

                  {privacyNote && <p className="abc-privacy">{privacyNote}</p>}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
