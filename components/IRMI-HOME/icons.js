import React from "react"

// Thin-stroke SVGs standing in for the Font Awesome Light / Brands glyphs
// used on the source page. All inherit currentColor.

const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round"
}

export const BarsIcon = ({ size = 22 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path {...stroke} d="M3 6h18M3 12h18M3 18h18" />
    </svg>
)

export const SearchIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle {...stroke} cx="10.5" cy="10.5" r="7" />
        <path {...stroke} d="M15.8 15.8 21 21" />
    </svg>
)

export const CartIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path {...stroke} d="M1.5 2.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h9.7a1.6 1.6 0 0 0 1.6-1.2l1.7-7H5.1" />
        <circle {...stroke} cx="9" cy="20" r="1.6" />
        <circle {...stroke} cx="18" cy="20" r="1.6" />
    </svg>
)

export const ArrowRight = ({ size = 14 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path fill="currentColor" d="M11.3 3.3 9.9 4.7l4.3 4.3H1.5v2h12.7l-4.3 4.3 1.4 1.4 6.7-6.7z" />
    </svg>
)

export const PlayIcon = ({ size = 78 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 70" aria-hidden="true">
        <rect x="0" y="0" width="100" height="70" rx="10" fill="rgba(20,20,20,0.78)" />
        <path fill="#ffffff" d="M40 22l24 13-24 13z" />
    </svg>
)

export const FacebookIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.02H7.9v-2.92h2.54v-2.22c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.92h-2.33V22C18.34 21.25 22 17.08 22 12.06z" />
    </svg>
)

export const TwitterIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M22 5.9c-.75.33-1.55.55-2.4.66a4.2 4.2 0 0 0 1.83-2.32c-.8.48-1.7.83-2.65 1.02a4.16 4.16 0 0 0-7.1 3.8A11.8 11.8 0 0 1 3.1 4.7a4.16 4.16 0 0 0 1.29 5.56c-.68-.02-1.32-.21-1.88-.52a4.17 4.17 0 0 0 3.34 4.14c-.61.17-1.26.2-1.9.08a4.17 4.17 0 0 0 3.89 2.9A11.75 11.75 0 0 1 2 19.3a16.6 16.6 0 0 0 8.98 2.64c10.85 0 16.83-9.15 16.46-17.35" />
    </svg>
)

export const LinkedInIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2zM8.34 18.9H5.56V9.9h2.78zM6.95 8.67a1.61 1.61 0 1 1 0-3.23 1.61 1.61 0 0 1 0 3.23zM18.91 18.9h-2.77v-4.4c0-1.05-.02-2.4-1.46-2.4-1.47 0-1.69 1.14-1.69 2.32v4.48h-2.78V9.9h2.66v1.23h.04a2.92 2.92 0 0 1 2.63-1.44c2.81 0 3.33 1.85 3.33 4.26z" />
    </svg>
)

export const YouTubeIcon = ({ size = 20 }) => (
    <svg className="irmi-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM9.96 15.02V8.98L15.2 12z" />
    </svg>
)
