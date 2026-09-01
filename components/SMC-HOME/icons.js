import React from "react"

const BLUE = "#0073e9"
const stroke = { fill: "none", stroke: "#fff", strokeMiterlimit: 10 }
const strokeThin = { ...stroke, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "0.91px" }

export const TrustIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" aria-hidden="true">
        <circle cx="33.5" cy="33.5" r="33.5" style={{ fill: BLUE }} />
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
            <path d="M31.18,23.68v-1.13c0-1.68-1.36-3.04-3.04-3.04h0c-1.68,0-3.04,1.36-3.04,3.04v1.13" />
            <rect x="23.01" y="23.68" width="10.25" height="9.38" />
            <path d="M29.87,28.79c0-.96-.77-1.73-1.73-1.73s-1.73.77-1.73,1.73" />
            <path d="M28.14,14.9l-11.9,2.75c0,23.52,11.9,23.89,11.9,23.89,0,0,11.9-.37,11.9-23.89l-11.9-2.75Z" />
            <polyline points="36.11 12.88 28.14 11.04 20.17 12.88" />
            <path d="M48.84,55.96c-3.89-1.04-7.95-1.46-11.98-1.23-2.66.15-5.31.58-7.97.48-2.66-.11-5.69-1.1-7.63-2.93l-7.56-7.19c-.51-.49-.53-1.31-.03-1.82h0c1.61-1.68,4.28-1.72,5.96-.11l6.64,5.81" />
            <path d="M39.7,47.94l-4.8,1.03c-1.51.32-3.05.49-4.6.49h-2.6c-1.33,0-2.41-1.08-2.41-2.41h0c0-1.33,1.08-2.41,2.41-2.41h2.28c2.1,0,4.19-.43,6.12-1.26,1.36-.58,2.7-1.19,4.15-1.55,3.96-.99,9.57.09,13.44,4.81" />
        </g>
    </svg>
)

export const VisibilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" aria-hidden="true">
        <circle cx="33.5" cy="33.5" r="33.5" style={{ fill: BLUE, strokeWidth: 0 }} />
        <line x1="43.97" y1="23.15" x2="49.46" y2="17.66" style={stroke} />
        <line x1="37.45" y1="20.6" x2="42.18" y2="15.87" style={stroke} />
        <line x1="49.2" y1="26.9" x2="51.13" y2="24.97" style={stroke} />
        <path d="M52.5,14.62c.84.84.84,2.2,0,3.04-.84.84-2.2.84-3.04,0-.84-.84-.84-2.2,0-3.04.84-.84,2.2-.84,3.04,0Z" style={stroke} />
        <path d="M45.22,12.83c.84.84.84,2.2,0,3.04-.84.84-2.2.84-3.04,0s-.84-2.2,0-3.04c.84-.84,2.2-.84,3.04,0Z" style={stroke} />
        <path d="M54.17,21.93c.84.84.84,2.2,0,3.04-.84.84-2.2.84-3.04,0-.84-.84-.84-2.2,0-3.04s2.2-.84,3.04,0Z" style={stroke} />
        <line x1="23.15" y1="43.97" x2="17.66" y2="49.46" style={stroke} />
        <line x1="17.66" y1="40.39" x2="15.87" y2="42.18" style={stroke} />
        <line x1="29.93" y1="46.17" x2="24.97" y2="51.13" style={stroke} />
        <path d="M14.62,52.5c.84.84,2.2.84,3.04,0,.84-.84.84-2.2,0-3.04-.84-.84-2.2-.84-3.04,0-.84.84-.84,2.2,0,3.04Z" style={stroke} />
        <path d="M12.83,45.22c.84.84,2.2.84,3.04,0,.84-.84.84-2.2,0-3.04-.84-.84-2.2-.84-3.04,0-.84.84-.84,2.2,0,3.04Z" style={stroke} />
        <path d="M21.93,54.17c.84.84,2.2.84,3.04,0,.84-.84.84-2.2,0-3.04-.84-.84-2.2-.84-3.04,0-.84.84-.84,2.2,0,3.04Z" style={stroke} />
        <path d="M24.29,39.57c-1.09-1.66-1.74-3.69-1.74-6.03s.67-4.34,1.83-6.08" style={stroke} />
        <path d="M42.4,27.02c2.8,3.79,2.86,8.97.15,12.83" style={stroke} />
        <circle cx="33.54" cy="33.54" r="6.85" transform="translate(-.84 66.22) rotate(-88.55)" style={stroke} />
        <path d="M52.5,33.54c-8.5-11.51-18.95-11-18.95-11,0,0-10.46-.51-18.95,11" style={stroke} />
        <path d="M14.59,33.54c8.5,11.51,18.95,11,18.95,11,0,0,10.46.51,18.95-11" style={stroke} />
    </svg>
)

export const DeliveryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" aria-hidden="true">
        <circle cx="33.5" cy="33.5" r="33.5" style={{ fill: BLUE, strokeWidth: 0 }} />
        <polyline points="39.44 32.41 29.65 37.49 12.06 28.36" style={stroke} />
        <path d="M47.23,35.87v10.81c0,1.25-1.01,2.26-2.26,2.26H14.01c-1.25,0-2.26-1.01-2.26-2.26v-18.35c0-1.25,1.01-2.26,2.26-2.26h23.23" style={stroke} />
        <circle cx="47.23" cy="26.07" r="8.01" transform="translate(-1.3 2.5) rotate(-3)" style={stroke} />
        <polyline points="43.73 26.04 46.97 28.93 51.64 23.22" style={stroke} />
    </svg>
)

export const ComplianceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 67" aria-hidden="true">
        <circle cx="33.5" cy="33.5" r="33.5" style={{ fill: BLUE, strokeWidth: 0 }} />
        <path d="M33.5,18.06l-16.13,3.73c0,31.89,16.13,32.39,16.13,32.39,0,0,16.13-.51,16.13-32.39l-16.13-3.73Z" style={strokeThin} />
        <polyline points="44.31 15.32 33.5 12.82 22.69 15.32" style={strokeThin} />
        <circle cx="33.49" cy="31.08" r="5.82" transform="translate(-6.86 9.64) rotate(-14.87)" style={strokeThin} />
        <polyline points="36.7 38.01 40.43 41.74 40.43 38.02 44.15 38.02 40.42 34.3" style={strokeThin} />
        <polyline points="30.3 37.99 26.57 41.72 26.57 38 22.85 38 26.58 34.27" style={strokeThin} />
        <path d="M31.11,31.08c0-1.31,1.07-2.38,2.38-2.38s2.38,1.07,2.38,2.38" style={strokeThin} />
    </svg>
)

export const ChevronLeft = () => (
    <svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true">
        <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const ChevronRight = () => (
    <svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true">
        <path d="m8.5 4.5 7.5 7.5-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const PlayIcon = () => (
    <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
        <path d="M66.5 7.5a8.5 8.5 0 0 0-6-6C55.3 0 34 0 34 0S12.7 0 7.5 1.5a8.5 8.5 0 0 0-6 6A88 88 0 0 0 0 24a88 88 0 0 0 1.5 16.5 8.5 8.5 0 0 0 6 6C12.7 48 34 48 34 48s21.3 0 26.5-1.5a8.5 8.5 0 0 0 6-6A88 88 0 0 0 68 24a88 88 0 0 0-1.5-16.5Z" fill="#f00" />
        <path d="M27 34.5 45 24 27 13.5Z" fill="#fff" />
    </svg>
)

export const CheckIcon = () => (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path d="m4 10.5 4 4 8-9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const CaretDown = () => (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="m2 4.5 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
