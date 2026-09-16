import React, { useEffect, useMemo, useRef, useState } from "react"
import { useStaticProps } from "./componentStaticProps"
import { getClub } from "./clubs"
import { Caret, Chevron, Lock, PaymentIcon, Refresh, Tick } from "./icons"
import "./index.css"

// ------------------------------------------------------------------ //
// Visual replica of the Tottenham Hotspur membership checkout, themed
// per Premier League club. Every control is interactive — payment
// method tiles, the step accordion, assignment, the promo code — but
// nothing is wired to a basket or a payment provider: Submit only shows
// a confirmation panel. This is a demo mockup, not a checkout.
// ------------------------------------------------------------------ //

const PAYMENT_METHODS = [
  { id: "card", label: "Card", prop: "showCard" },
  { id: "direct-debit", label: "Direct Debit", prop: "showDirectDebit" },
  { id: "paypal", label: "PayPal", prop: "showPayPal" },
  { id: "google-pay", label: "Google Pay", prop: "showGooglePay" },
  { id: "apple-pay", label: "Apple Pay", prop: "showApplePay" },
]

const COUNTRIES = [
  ["GB", "United Kingdom"],
  ["IE", "Ireland"],
  ["US", "United States"],
  ["AU", "Australia"],
  ["CA", "Canada"],
  ["FR", "France"],
  ["DE", "Germany"],
  ["ES", "Spain"],
  ["IT", "Italy"],
  ["NL", "Netherlands"],
  ["NO", "Norway"],
  ["SE", "Sweden"],
  ["ZA", "South Africa"],
]

const toNumber = (value) => {
  const parsed = parseFloat(String(value == null ? "" : value).replace(/[^0-9.-]/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}

const pick = (override, fallback) => {
  const value = typeof override === "string" ? override.trim() : override
  return value === "" || value == null ? fallback : value
}

// Strips the tag soup a `richtext` prop arrives as, so terms copy can be
// rendered as plain paragraphs without dangerouslySetInnerHTML.
const stripHtml = (html) =>
  String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

const Field = ({ label, required, children, span = 12 }) => (
  <div className={`pcc-field pcc-field--${span}`}>
    <label className="pcc-label">
      {label}
      {required ? <span className="pcc-required"> *</span> : null}
    </label>
    {children}
  </div>
)

const TextField = ({ label, required, span, value, onChange, type = "text", placeholder, maxLength }) => (
  <Field label={label} required={required} span={span}>
    <input
      className="pcc-input"
      type={type}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
    />
  </Field>
)

// ------------------------------------------------------------------ //
// Payment panels
// ------------------------------------------------------------------ //

const CardPanel = () => {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" })
  const set = (key) => (value) => setCard((current) => ({ ...current, [key]: value }))

  const formatNumber = (raw) =>
    raw
      .replace(/[^0-9]/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim()

  const formatExpiry = (raw) => {
    const digits = raw.replace(/[^0-9]/g, "").slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  return (
    <div className="pcc-pay-panel">
      <div className="pcc-pay-panel__head">
        <Lock className="pcc-pay-panel__lock" />
        <span>Card details are encrypted and never stored by the club.</span>
      </div>
      <div className="pcc-grid">
        <TextField
          label="Card number"
          required
          span={12}
          value={card.number}
          placeholder="1234 1234 1234 1234"
          onChange={(value) => set("number")(formatNumber(value))}
        />
        <TextField
          label="Expiry"
          required
          span={6}
          value={card.expiry}
          placeholder="MM/YY"
          onChange={(value) => set("expiry")(formatExpiry(value))}
        />
        <TextField
          label="Security code"
          required
          span={6}
          value={card.cvc}
          placeholder="CVC"
          onChange={(value) => set("cvc")(value.replace(/[^0-9]/g, "").slice(0, 4))}
        />
        <TextField label="Name on card" required span={12} value={card.name} onChange={set("name")} />
      </div>
    </div>
  )
}

const DirectDebitPanel = () => {
  const [account, setAccount] = useState({ name: "", sortCode: "", number: "" })
  const set = (key) => (value) => setAccount((current) => ({ ...current, [key]: value }))

  const formatSortCode = (raw) =>
    raw
      .replace(/[^0-9]/g, "")
      .slice(0, 6)
      .replace(/(.{2})/g, "$1-")
      .replace(/-$/, "")

  return (
    <div className="pcc-pay-panel">
      <div className="pcc-pay-panel__head">
        <Lock className="pcc-pay-panel__lock" />
        <span>Payments are protected by the Direct Debit Guarantee.</span>
      </div>
      <div className="pcc-grid">
        <TextField label="Account holder name" required span={12} value={account.name} onChange={set("name")} />
        <TextField
          label="Sort code"
          required
          span={6}
          value={account.sortCode}
          placeholder="00-00-00"
          onChange={(value) => set("sortCode")(formatSortCode(value))}
        />
        <TextField
          label="Account number"
          required
          span={6}
          value={account.number}
          placeholder="00000000"
          onChange={(value) => set("number")(value.replace(/[^0-9]/g, "").slice(0, 8))}
        />
      </div>
      <p className="pcc-pay-panel__note">
        The first collection will be taken within 5 working days. You will be notified of the collection date in
        advance.
      </p>
    </div>
  )
}

const WalletPanel = ({ method, label }) => {
  const copy = {
    paypal: "You will be redirected to PayPal to approve this payment. Your membership is confirmed as soon as you return.",
    "google-pay": "Pay with a card saved to your Google account. You will be asked to confirm before anything is charged.",
    "apple-pay": "Pay with a card in your Apple Wallet. Confirm with Face ID, Touch ID or your passcode.",
  }[method]

  return (
    <div className="pcc-pay-panel">
      <button type="button" className={`pcc-wallet-btn pcc-wallet-btn--${method}`}>
        <PaymentIcon method={method} />
        <span>{label}</span>
      </button>
      <p className="pcc-pay-panel__note">{copy}</p>
    </div>
  )
}

// ------------------------------------------------------------------ //
// Step scaffolding
// ------------------------------------------------------------------ //

const StepHeader = ({ index, title, state, onEdit, onOpen }) => (
  <div
    className={`pcc-step-header pcc-step-header--${state}`}
    role="button"
    tabIndex={0}
    onClick={state === "collapsed" ? onOpen : undefined}
    onKeyDown={(event) => {
      if (state === "collapsed" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault()
        onOpen()
      }
    }}
  >
    <div className="pcc-step-header__row">
      <span className="pcc-step-header__index">{state === "collapsed" ? <Tick /> : index}</span>
      <h3 className="pcc-step-header__title">{title}</h3>
      {state === "collapsed" ? (
        <button
          type="button"
          className="pcc-step-header__edit"
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          Edit
        </button>
      ) : null}
    </div>
  </div>
)

const StepContinue = ({ label, onClick, disabled }) => (
  <div className="pcc-step-continue">
    <button type="button" className="pcc-step-continue__btn" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  </div>
)

// ------------------------------------------------------------------ //

const PremClubCheckout = () => {
  const props = useStaticProps()
  const club = getClub(props.club)

  const symbol = props.currencySymbol || "£"
  const planName = pick(props.planName, club.planName)
  const planDescription = pick(props.planDescription, club.planDescription)
  const quantity = Math.max(1, toNumber(pick(props.quantity, 1)) || 1)
  const unitPrice = toNumber(pick(props.price, club.price))
  const unitFee = toNumber(pick(props.transactionFee, club.fee))
  const ddDiscount = toNumber(club.ddDiscount)

  const methods = PAYMENT_METHODS.filter((method) => props[method.prop] !== false)
  const fallbackMethod = methods.length ? methods[0].id : "card"
  const initialMethod = methods.some((method) => method.id === props.defaultPaymentMethod)
    ? props.defaultPaymentMethod
    : fallbackMethod

  const [method, setMethod] = useState(initialMethod)
  const [step, setStep] = useState(1)
  const [completed, setCompleted] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const [customer, setCustomer] = useState({
    firstName: props.customerFirstName || "",
    lastName: props.customerLastName || "",
    phone: "",
    email: props.customerEmail || "",
    address1: "",
    address2: "",
    city: "",
    country: "GB",
    postalCode: "",
  })
  const setCustomerField = (key) => (value) => setCustomer((current) => ({ ...current, [key]: value }))

  const [assignType, setAssignType] = useState("")
  const [assignConfirmed, setAssignConfirmed] = useState(false)
  const [assignOpen, setAssignOpen] = useState(true)
  const [recipient, setRecipient] = useState("")

  const [terms, setTerms] = useState(false)
  const [marketing, setMarketing] = useState(true)

  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState("")

  const rootRef = useRef(null)

  // Props are edited live in Experience Manager — keep the selected
  // method valid when a club's method set changes underneath us.
  useEffect(() => {
    if (!methods.some((entry) => entry.id === method)) setMethod(fallbackMethod)
  }, [methods.map((entry) => entry.id).join(","), method, fallbackMethod])

  const theme = useMemo(
    () => ({
      "--pcc-primary": pick(props.primaryColor, club.primary),
      "--pcc-on-primary": pick(props.onPrimaryColor, club.onPrimary),
      "--pcc-secondary": pick(props.secondaryColor, club.secondary),
      "--pcc-accent": pick(props.accentColor, club.accent),
      "--pcc-on-accent": pick(props.onAccentColor, club.onAccent),
      "--pcc-surface": club.surface,
      "--pcc-surface-alt": club.surfaceAlt,
      "--pcc-text": club.text,
      "--pcc-muted": club.muted,
      "--pcc-border": club.border,
      "--pcc-radius": pick(props.cornerRadius, club.radius),
      "--pcc-font-display": pick(props.displayFont, club.display),
      "--pcc-font-body": pick(props.bodyFont, club.body),
      "--pcc-display-weight": club.displayWeight,
      "--pcc-display-transform": club.displayTransform,
      "--pcc-display-spacing": club.displaySpacing,
    }),
    [club, props.primaryColor, props.onPrimaryColor, props.secondaryColor, props.accentColor, props.onAccentColor, props.cornerRadius, props.displayFont, props.bodyFont]
  )

  const money = (value) =>
    `${symbol}${value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const subtotal = unitPrice * quantity
  const fees = unitFee * quantity
  const ddSaving = method === "direct-debit" && ddDiscount > 0 ? Math.min(ddDiscount, subtotal) : 0
  const promoSaving = promo ? Math.min(promo.amount, Math.max(0, subtotal - ddSaving)) : 0
  const total = Math.max(0, subtotal + fees - ddSaving - promoSaving)

  const assignmentEnabled = props.showAssignmentStep !== false
  const steps = assignmentEnabled ? ["payment", "assignment", "review"] : ["payment", "review"]
  const stepNumber = (name) => steps.indexOf(name) + 1
  const lastStep = steps.length

  const stateFor = (name) => {
    const number = stepNumber(name)
    if (step === number) return "active"
    return completed[name] ? "collapsed" : "pending"
  }

  const goTo = (number) => {
    setStep(number)
    if (rootRef.current && typeof rootRef.current.scrollIntoView === "function") {
      rootRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const confirmStep = (name) => {
    setCompleted((current) => ({ ...current, [name]: true }))
    const next = stepNumber(name) + 1
    goTo(next > lastStep ? lastStep : next)
  }

  const applyPromo = () => {
    const entered = promoInput.trim()
    if (!entered) return
    const expected = String(props.promoCode || "").trim()
    if (expected && entered.toLowerCase() === expected.toLowerCase()) {
      setPromo({ code: entered.toUpperCase(), amount: toNumber(props.promoDiscount) })
      setPromoError("")
      setPromoInput("")
    } else {
      setPromo(null)
      setPromoError("That code isn't valid for this membership.")
    }
  }

  const ddNote = String(props.directDebitNote || "")
    .replace(/\{symbol\}/g, symbol)
    .replace(/\{amount\}/g, String(ddDiscount))

  const backUrl = pick(props.backUrl, club.site)
  const initials = `${(customer.firstName || " ")[0] || ""}${(customer.lastName || " ")[0] || ""}`.toUpperCase()

  const paymentPanel = () => {
    if (method === "card") return <CardPanel />
    if (method === "direct-debit") return <DirectDebitPanel />
    const label = (methods.find((entry) => entry.id === method) || {}).label || "Pay"
    return <WalletPanel method={method} label={method === "paypal" ? "Pay with PayPal" : label} />
  }

  return (
    <div className="pcc-root" style={theme} ref={rootRef}>
      <nav className="pcc-header">
        <a className="pcc-header__back" href={backUrl}>
          <Chevron className="pcc-header__chevron" />
          {props.backLabel}
        </a>
        <div className="pcc-header__right">
          <span className="pcc-header__club">{club.name}</span>
          {props.crestUrl ? (
            <img className="pcc-header__crest" src={props.crestUrl} alt={`${club.name} crest`} />
          ) : (
            <span className="pcc-header__roundel" aria-hidden="true">
              {club.initials}
            </span>
          )}
          <span className="pcc-header__avatar" role="button" tabIndex={0} aria-label="User menu">
            {initials || "—"}
          </span>
        </div>
      </nav>

      <div className="pcc-body">
        <div className="pcc-col pcc-col--form">
          <a className="pcc-breadcrumb" href={props.breadcrumbUrl}>
            <Chevron className="pcc-breadcrumb__chevron" />
            {props.breadcrumbLabel}
          </a>

          <form
            className="pcc-form"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            {/* ---- Step 1: payment ---- */}
            <StepHeader
              index={stepNumber("payment")}
              title="Payment Details"
              state={stateFor("payment")}
              onEdit={() => goTo(stepNumber("payment"))}
              onOpen={() => goTo(stepNumber("payment"))}
            />

            {step === stepNumber("payment") ? (
              <div className="pcc-step-body">
                <div className="pcc-methods">
                  {methods.map((entry) => {
                    const selected = entry.id === method
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        aria-pressed={selected}
                        className={`pcc-method${selected ? " pcc-method--selected" : ""}`}
                        onClick={() => setMethod(entry.id)}
                      >
                        <span className="pcc-method__icon">
                          <PaymentIcon method={entry.id} />
                        </span>
                        <span className="pcc-method__label">{entry.label}</span>
                      </button>
                    )
                  })}
                </div>

                {ddNote && ddDiscount > 0 && methods.some((entry) => entry.id === "direct-debit") ? (
                  <p className="pcc-dd-note">{ddNote}</p>
                ) : null}

                <div className="pcc-grid">
                  <TextField
                    label="First name"
                    required
                    span={6}
                    value={customer.firstName}
                    onChange={setCustomerField("firstName")}
                  />
                  <TextField
                    label="Last name"
                    required
                    span={6}
                    value={customer.lastName}
                    onChange={setCustomerField("lastName")}
                  />
                  <TextField
                    label="Contact Number"
                    span={12}
                    type="tel"
                    value={customer.phone}
                    onChange={setCustomerField("phone")}
                  />
                  <TextField
                    label="Email Address"
                    required
                    span={12}
                    type="email"
                    value={customer.email}
                    onChange={setCustomerField("email")}
                  />
                  <TextField
                    label="Address"
                    required
                    span={12}
                    maxLength={35}
                    value={customer.address1}
                    onChange={setCustomerField("address1")}
                  />
                  <TextField
                    label="Address Line 2"
                    span={12}
                    maxLength={35}
                    value={customer.address2}
                    onChange={setCustomerField("address2")}
                  />
                  <TextField
                    label="Town/City"
                    required
                    span={6}
                    maxLength={35}
                    value={customer.city}
                    onChange={setCustomerField("city")}
                  />
                  <Field label="Country" required span={6}>
                    <select
                      className="pcc-input pcc-select"
                      value={customer.country}
                      onChange={(event) => setCustomerField("country")(event.target.value)}
                    >
                      {COUNTRIES.map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <TextField
                    label="Postcode"
                    required
                    span={12}
                    maxLength={12}
                    value={customer.postalCode}
                    onChange={setCustomerField("postalCode")}
                  />
                </div>

                {paymentPanel()}

                <StepContinue label="Confirm" onClick={() => confirmStep("payment")} />
              </div>
            ) : null}

            {/* ---- Step 2: assignment ---- */}
            {assignmentEnabled ? (
              <>
                <StepHeader
                  index={stepNumber("assignment")}
                  title="Assignment Details"
                  state={stateFor("assignment")}
                  onEdit={() => goTo(stepNumber("assignment"))}
                  onOpen={() => goTo(stepNumber("assignment"))}
                />

                {step === stepNumber("assignment") ? (
                  <div className="pcc-step-body">
                    <p className="pcc-assign__subtitle">
                      Each membership must be assigned to an account holder in your network.
                    </p>
                    <div className="pcc-assign__banner">
                      The person you're assigning to must register an account and must be part of your network.{" "}
                      <a href={pick(props.networkUrl, `${club.site}/join`)} target="_blank" rel="noopener noreferrer">
                        Create an account
                      </a>{" "}
                      /{" "}
                      <a
                        href={pick(props.addToNetworkUrl, `${club.site}/my-account`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Add to network
                      </a>
                    </div>

                    <div className="pcc-assign__offer">
                      <div className="pcc-assign__offer-head">
                        <span className="pcc-assign__badge">1</span>
                        <div className="pcc-assign__offer-info">
                          <span className="pcc-assign__offer-name">{planName}</span>
                          <span className="pcc-assign__offer-label">{planDescription}</span>
                        </div>
                        <span
                          className={`pcc-assign__tag${assignConfirmed ? " pcc-assign__tag--assigned" : ""}`}
                        >
                          {assignConfirmed ? "Assigned" : "Unassigned"}
                        </span>
                        <button
                          type="button"
                          className="pcc-assign__caret-btn"
                          aria-expanded={assignOpen}
                          aria-label={assignOpen ? "Collapse assignment" : "Expand assignment"}
                          onClick={() => setAssignOpen((open) => !open)}
                        >
                          <Caret className={`pcc-assign__caret${assignOpen ? " pcc-assign__caret--open" : ""}`} />
                        </button>
                      </div>

                      {assignOpen ? (
                        <div className="pcc-assign__panel">
                          <div className="pcc-assign__cards">
                            <label
                              className={`pcc-assign__card${assignType === "self" ? " pcc-assign__card--on" : ""}`}
                            >
                              <input
                                type="radio"
                                name="pcc-assign"
                                value="self"
                                checked={assignType === "self"}
                                onChange={() => {
                                  setAssignType("self")
                                  setAssignConfirmed(false)
                                }}
                              />
                              <span className="pcc-assign__card-body">
                                <span className="pcc-assign__card-title">Assign to myself</span>
                                <span className="pcc-assign__card-sub">
                                  {`${customer.firstName} ${customer.lastName}`.trim() || "Account holder"}
                                  <span className="pcc-assign__diamond" aria-hidden="true" />
                                  CRN {props.customerCrn}
                                </span>
                              </span>
                            </label>

                            <label
                              className={`pcc-assign__card${assignType === "network" ? " pcc-assign__card--on" : ""}`}
                            >
                              <input
                                type="radio"
                                name="pcc-assign"
                                value="network"
                                checked={assignType === "network"}
                                onChange={() => {
                                  setAssignType("network")
                                  setAssignConfirmed(false)
                                }}
                              />
                              <span className="pcc-assign__card-body">
                                <span className="pcc-assign__card-title">Assign to my network</span>
                                <span className="pcc-assign__card-sub">Choose a recipient</span>
                              </span>
                            </label>
                          </div>

                          {assignType === "network" ? (
                            <div className="pcc-assign__recipient">
                              <select
                                className="pcc-input pcc-select"
                                value={recipient}
                                onChange={(event) => {
                                  setRecipient(event.target.value)
                                  setAssignConfirmed(false)
                                }}
                              >
                                <option value="">Select a network member…</option>
                                <option value="1">Alex Donoghue — CRN 5540318</option>
                                <option value="2">Jamie Donoghue — CRN 5540322</option>
                                <option value="3">Robin Hale — CRN 5602911</option>
                              </select>
                            </div>
                          ) : null}

                          <div className="pcc-assign__confirm-row">
                            <button
                              type="button"
                              className="pcc-assign__confirm-btn"
                              disabled={!assignType || (assignType === "network" && !recipient) || assignConfirmed}
                              onClick={() => {
                                setAssignConfirmed(true)
                                setAssignOpen(false)
                              }}
                            >
                              {assignConfirmed ? "Assigned" : "Confirm Assignment"}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <StepContinue
                      label="Confirm"
                      onClick={() => confirmStep("assignment")}
                      disabled={!assignConfirmed}
                    />
                  </div>
                ) : null}
              </>
            ) : null}

            {/* ---- Final step: review ---- */}
            <StepHeader
              index={stepNumber("review")}
              title="Order Review"
              state={stateFor("review")}
              onEdit={() => goTo(stepNumber("review"))}
              onOpen={() => goTo(stepNumber("review"))}
            />

            {step === stepNumber("review") ? (
              <div className="pcc-step-body">
                <div className="pcc-terms">
                  {stripHtml(props.termsText).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                  <label className="pcc-check">
                    <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
                    <span>I accept the Terms and Conditions</span>
                  </label>
                </div>

                <div className="pcc-terms">
                  <p>{props.marketingText}</p>
                  <label className="pcc-check">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(event) => setMarketing(event.target.checked)}
                    />
                    <span>Yes</span>
                  </label>
                </div>

                <button type="submit" className="pcc-submit" disabled={!terms}>
                  {props.submitLabel}
                </button>

                {submitted ? (
                  <p className="pcc-submitted">
                    This is a demo checkout — nothing has been charged and no order was placed.
                  </p>
                ) : null}
              </div>
            ) : null}
          </form>
        </div>

        {/* ---- Order summary ---- */}
        <aside className="pcc-col pcc-col--summary">
          <div className="pcc-summary">
            <div className="pcc-summary__head">
              <h2 className="pcc-summary__heading">Order Summary</h2>
              <span className="pcc-summary__renew">
                <Refresh className="pcc-summary__refresh" />
                {props.autoRenewLabel}
              </span>
            </div>

            <ul className="pcc-summary__items">
              <li className="pcc-summary__item">
                <div className="pcc-summary__item-body">
                  <div className="pcc-summary__item-name">{planName}</div>
                  <div className="pcc-summary__item-desc">{planDescription}</div>
                  <div className="pcc-summary__item-qty">Qty {quantity}</div>
                </div>
                <div className="pcc-summary__item-price">{money(unitPrice * quantity)}</div>
              </li>
            </ul>

            {props.showPromoCode !== false ? (
              <div className="pcc-promo">
                {promo ? (
                  <div className="pcc-promo__applied">
                    <span className="pcc-promo__applied-code">
                      <Tick className="pcc-promo__tick" />
                      {promo.code} applied
                    </span>
                    <button
                      type="button"
                      className="pcc-promo__remove"
                      onClick={() => {
                        setPromo(null)
                        setPromoError("")
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="pcc-promo__row">
                    <input
                      className="pcc-promo__input"
                      type="text"
                      value={promoInput}
                      placeholder={props.promoPlaceholder}
                      aria-label="Promo code"
                      onChange={(event) => {
                        setPromoInput(event.target.value)
                        setPromoError("")
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          applyPromo()
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="pcc-promo__btn"
                      onClick={applyPromo}
                      disabled={!promoInput.trim()}
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError ? <p className="pcc-promo__error">{promoError}</p> : null}
              </div>
            ) : null}

            <div className="pcc-divider" />

            <div className="pcc-summary__totals">
              <div className="pcc-summary__row">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              {fees > 0 ? (
                <div className="pcc-summary__row pcc-summary__row--muted">
                  <span>
                    Transaction Fee
                    <span className="pcc-summary__fee-detail">{` (${quantity} × ${money(unitFee)})`}</span>
                  </span>
                  <span>{money(fees)}</span>
                </div>
              ) : null}
              {ddSaving > 0 ? (
                <div className="pcc-summary__row pcc-summary__row--save">
                  <span>Direct Debit discount</span>
                  <span>−{money(ddSaving)}</span>
                </div>
              ) : null}
              {promoSaving > 0 ? (
                <div className="pcc-summary__row pcc-summary__row--save">
                  <span>Promo {promo.code}</span>
                  <span>−{money(promoSaving)}</span>
                </div>
              ) : null}
              <div className="pcc-divider" />
              <div className="pcc-summary__row pcc-summary__row--total">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default PremClubCheckout
