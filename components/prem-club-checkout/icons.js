import React from "react"

// Inline SVG only — the component must not reach outside its own folder
// for assets, and remote payment-brand images would 404 on a tenant.

export const Chevron = ({ className }) => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className={className} aria-hidden="true">
    <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Caret = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Refresh = ({ className }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)

export const Tick = ({ className }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
    <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Lock = ({ className }) => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className={className} aria-hidden="true">
    <rect x="1" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const CardIcon = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
    <rect x="0.7" y="0.7" width="26.6" height="18.6" rx="2.6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M1 6.6h26" stroke="currentColor" strokeWidth="2.6" />
    <rect x="4" y="12" width="7" height="2" rx="1" fill="currentColor" />
  </svg>
)

const BankIcon = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
    <path d="M14 1.4L25.6 7H2.4L14 1.4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5.4 8.6v7M11.2 8.6v7M16.8 8.6v7M22.6 8.6v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M2 18.4h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const PayPalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.4 21l1-5.6h3.2c3.9 0 6.4-1.9 7-5.3.5-2.7-.8-4.3-3.4-4.3H7.9L5 21h1.4z"
      fill="currentColor"
      opacity="0.45"
    />
    <path
      d="M9.1 17.4l1-5.6h3.1c3.9 0 6.4-1.9 7.1-5.3.5-2.8-.9-4.5-3.6-4.5h-6.3a.8.8 0 0 0-.8.7L7 17.4h2.1z"
      fill="currentColor"
    />
  </svg>
)

// --- Brand marks -------------------------------------------------- //
// Reproductions of the Google, PayPal and Apple marks drawn as inline SVG
// so nothing has to be hosted. The Google "G" uses the real four-arc
// geometry. Each can be swapped for an official asset from the relevant
// brand centre via the *LogoUrl props.

const GoogleG = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path
      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      fill="#4285F4"
    />
    <path
      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      fill="#34A853"
    />
    <path
      d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      fill="#FBBC05"
    />
    <path
      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      fill="#EA4335"
    />
  </svg>
)

// The G Pay lockup: multicolour Google G followed by "Pay".
const GooglePayMark = ({ height = 20, tone = "#5F6368" }) => (
  <span className="pcc-brand pcc-brand--gpay" style={{ height }}>
    <GoogleG size={height} />
    <span className="pcc-brand__word" style={{ color: tone, fontSize: height * 0.86 }}>
      Pay
    </span>
  </span>
)

// PayPal: the two-P monogram in the brand blues, plus the two-tone wordmark.
const PayPalMonogram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M8.6 21.9H5.9c-.3 0-.5-.3-.5-.6L8.2 3.5c.1-.4.4-.7.9-.7h5.7c3.6 0 5.8 1.8 5.3 5.3-.6 3.9-3.3 5.9-7.1 5.9h-2.6c-.4 0-.8.3-.9.8l-.9 6.4c0 .4-.4.7-.8.7z"
      fill="#003087"
    />
    <path
      d="M19.9 8.3c.1.6.1 1.2 0 1.9-.6 4-3.4 6.2-7.3 6.2h-1.7c-.4 0-.8.3-.9.8l-1 6.3c-.1.4-.4.6-.8.6h.4c.4 0 .8-.3.9-.7l.9-6.4c.1-.4.4-.8.9-.8h2.6c3.8 0 6.5-2 7.1-5.9.3-1.8-.2-3.1-1.1-4z"
      fill="#009CDE"
    />
  </svg>
)

const PayPalMark = ({ height = 20 }) => (
  <span className="pcc-brand pcc-brand--paypal" style={{ height }}>
    <PayPalMonogram size={height} />
    <span className="pcc-brand__word" style={{ fontSize: height * 0.82 }}>
      <span style={{ color: "#003087" }}>Pay</span>
      <span style={{ color: "#009CDE" }}>Pal</span>
    </span>
  </span>
)

const AppleLogo = ({ size = 18, tone = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17.2 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.1-1.1 2.9-2.3c.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.9-3.8z"
      fill={tone}
    />
    <path
      d="M14.9 5.7c.7-.8 1.1-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 2.9-1.4z"
      fill={tone}
    />
  </svg>
)

const ApplePayMark = ({ height = 20, tone = "currentColor" }) => (
  <span className="pcc-brand pcc-brand--apay" style={{ height }}>
    <AppleLogo size={height} tone={tone} />
    <span className="pcc-brand__word" style={{ color: tone, fontSize: height * 0.86 }}>
      Pay
    </span>
  </span>
)

const TILE_MARKS = {
  card: () => <CardIcon />,
  "direct-debit": () => <BankIcon />,
  paypal: () => <PayPalMonogram size={22} />,
  "google-pay": () => <GoogleG size={22} />,
  "apple-pay": () => <AppleLogo size={22} />,
}

const LOCKUPS = {
  paypal: (props) => <PayPalMark {...props} />,
  "google-pay": (props) => <GooglePayMark {...props} />,
  "apple-pay": (props) => <ApplePayMark {...props} />,
}

// Small mark shown inside a payment-method tile. `logoUrl` lets a page
// swap in an official brand asset.
export const PaymentIcon = ({ method, logoUrl }) => {
  if (logoUrl) return <img className="pcc-brand__img" src={logoUrl} alt="" aria-hidden="true" />
  const Mark = TILE_MARKS[method]
  return Mark ? <Mark /> : null
}

// Full brand lockup for the express pay button.
export const WalletLockup = ({ method, logoUrl, tone }) => {
  if (logoUrl) return <img className="pcc-brand__img pcc-brand__img--lockup" src={logoUrl} alt="" aria-hidden="true" />
  const Lockup = LOCKUPS[method]
  return Lockup ? <Lockup tone={tone} /> : null
}
