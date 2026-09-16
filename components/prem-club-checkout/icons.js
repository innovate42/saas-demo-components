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

const GooglePayIcon = () => (
  <svg width="40" height="20" viewBox="0 0 40 20" fill="none" aria-hidden="true">
    <path
      d="M9.9 10.3v3.6H8.1V4.9h4c1 0 1.9.3 2.6 1a3 3 0 0 1 .3 4.2l-.3.3c-.7.6-1.5 1-2.6 1H9.9zm0-3.7v2.1h2.3c.6 0 1-.2 1.4-.6a1 1 0 0 0 0-1.5c-.4-.4-.8-.6-1.4-.6H9.9z"
      fill="currentColor"
    />
    <path
      d="M19.4 7.4c1.2 0 2.1.3 2.8.9.7.6 1 1.4 1 2.5v5.1h-1.7v-1.3h-.1c-.5.9-1.3 1.3-2.3 1.3-.8 0-1.5-.2-2.1-.7a2.4 2.4 0 0 1-.8-1.9c0-.8.3-1.4.9-1.9.6-.5 1.4-.7 2.4-.7.9 0 1.6.2 2.1.5v-.4c0-.5-.2-1-.6-1.3a2 2 0 0 0-1.4-.5c-.8 0-1.4.3-1.9 1l-1.5-1c.7-1 1.8-1.6 3.2-1.6zm-2.3 6c0 .4.2.7.5 1 .3.2.7.3 1.1.3.6 0 1.1-.2 1.5-.6.5-.4.7-.9.7-1.5-.5-.3-1.1-.5-1.9-.5-.6 0-1 .1-1.4.4-.3.3-.5.6-.5.9z"
      fill="currentColor"
      transform="translate(0,-2)"
    />
    <path d="M32.9 7.6l-5.2 12h-1.8l1.9-4.2-3.4-7.8h1.9l2.5 5.9h.1l2.4-5.9h1.6z" fill="currentColor" />
    <circle cx="3.6" cy="9.4" r="3.4" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3.6 9.4h3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const ApplePayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16.4 12.6c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6 1.7-.9 2.4-1.8c.7-1.1 1-2.1 1-2.2 0 0-2-.7-2.1-3.3z"
      fill="currentColor"
    />
    <path
      d="M14.6 6.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.6.9.1 1.8-.5 2.4-1.2z"
      fill="currentColor"
    />
  </svg>
)

const PAYMENT_ICONS = {
  card: CardIcon,
  "direct-debit": BankIcon,
  paypal: PayPalIcon,
  "google-pay": GooglePayIcon,
  "apple-pay": ApplePayIcon,
}

export const PaymentIcon = ({ method }) => {
  const Glyph = PAYMENT_ICONS[method]
  return Glyph ? <Glyph /> : null
}
