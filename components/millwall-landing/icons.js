// Inline replacements for the eticketing icon font. All inherit currentColor.

import React from "react"

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export const ExternalIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path {...stroke} d="M14 4h6v6" />
    <path {...stroke} d="M20 4 11 13" />
    <path {...stroke} d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </svg>
)

export const SignInIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle {...stroke} cx="12" cy="8" r="3.9" />
    <path {...stroke} d="M4.4 20.2c.6-3.8 3.8-6.3 7.6-6.3s7 2.5 7.6 6.3" />
  </svg>
)

export const BasketIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path {...stroke} d="M3.5 7.5h17l-1.6 11a1.6 1.6 0 0 1-1.6 1.4H6.7a1.6 1.6 0 0 1-1.6-1.4z" />
    <path {...stroke} d="M8.4 7.5a3.6 3.6 0 0 1 7.2 0" />
  </svg>
)

export const ChevronIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path {...stroke} strokeWidth="2.6" d="m5 8.5 7 7 7-7" />
  </svg>
)

// The "Powered by" mark in the footer, drawn as a wordmark so the footer
// keeps its shape without pulling in Ticketmaster's own 60-path SVG.
export const TicketmasterWordmark = ({ width = 130 }) => (
  <svg
    width={width}
    height={width * 0.138}
    viewBox="0 0 130 18"
    role="img"
    aria-label="Ticketmaster"
  >
    <text
      x="0"
      y="14"
      fill="currentColor"
      fontFamily="Barlow, 'Helvetica Neue', Helvetica, Arial, sans-serif"
      fontSize="15"
      fontWeight="700"
      letterSpacing="-0.3"
    >
      ticketmaster
    </text>
  </svg>
)
