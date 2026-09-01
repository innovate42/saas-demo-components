import React from "react"

// Stroke-based 24x24 icons drawn to match the portal's line-art nav set.
const S = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round"
}

const Svg = ({ children, viewBox = "0 0 24 24" }) => (
    <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">{children}</svg>
)

export const ShieldLogo = () => (
    <Svg>
        <path d="M12 2.6 3.9 5v6.1c0 5 3.4 8.8 8.1 10.3 4.7-1.5 8.1-5.3 8.1-10.3V5L12 2.6Z" fill="currentColor" />
        <path d="M8.4 11.9l2.6 2.6 4.9-5.2" fill="none" stroke="#16202c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const DashboardIcon = () => (
    <Svg>
        <rect x="3" y="3" width="8" height="8" rx="1.2" fill="currentColor" />
        <rect x="13" y="3" width="8" height="5" rx="1.2" fill="currentColor" />
        <rect x="3" y="13" width="8" height="8" rx="1.2" fill="currentColor" />
        <rect x="13" y="10" width="8" height="11" rx="1.2" fill="currentColor" />
    </Svg>
)

export const GlobeIcon = () => (
    <Svg>
        <circle cx="12" cy="12" r="9" {...S} />
        <path d="M3 12h18M12 3c2.4 2.5 3.6 5.6 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.6-3.6-9S9.6 5.5 12 3Z" {...S} />
    </Svg>
)

export const ClipboardCheckIcon = () => (
    <Svg>
        <path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" {...S} />
        <rect x="9" y="2.6" width="6" height="3.4" rx="1" {...S} />
        <path d="M8.8 13.2l2.2 2.2 4.2-4.4" {...S} />
    </Svg>
)

export const AlertCircleIcon = () => (
    <Svg>
        <circle cx="12" cy="12" r="9" {...S} />
        <path d="M12 7.6v5.2" {...S} />
        <circle cx="12" cy="16.4" r="0.9" fill="currentColor" />
    </Svg>
)

export const LockCircleIcon = () => (
    <Svg>
        <circle cx="12" cy="12" r="9" {...S} />
        <rect x="8.6" y="11.4" width="6.8" height="5.4" rx="1.2" {...S} />
        <path d="M10.2 11.4v-1.6a1.8 1.8 0 0 1 3.6 0v1.6" {...S} />
    </Svg>
)

export const DomainsIcon = () => (
    <Svg>
        <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2" {...S} />
        <path d="M8.4 4.6v14.8" {...S} />
        <path d="M11.4 9.2h6.4M11.4 12h6.4M11.4 14.8h4" {...S} />
    </Svg>
)

export const BreachIcon = () => (
    <Svg>
        <path d="M12 2.8 4.6 5.1v5.8c0 4.7 3.1 8.3 7.4 9.7 4.3-1.4 7.4-5 7.4-9.7V5.1L12 2.8Z" {...S} />
        <circle cx="12" cy="11" r="2.7" {...S} />
        <path d="m14 13 2.2 2.3" {...S} />
    </Svg>
)

export const LookalikeIcon = () => (
    <Svg>
        <circle cx="10.6" cy="10.6" r="6.4" {...S} />
        <path d="M4.6 9.2h12M10.6 4.2c1.7 1.8 2.6 4 2.6 6.4s-.9 4.6-2.6 6.4c-1.7-1.8-2.6-4-2.6-6.4s.9-4.6 2.6-6.4Z" {...S} />
        <path d="m15.4 15.4 4.4 4.4" {...S} />
    </Svg>
)

export const GearIcon = () => (
    <Svg>
        <path d="M19.4 13.1a7.6 7.6 0 0 0 0-2.2l1.9-1.4-1.9-3.3-2.2.9a7.7 7.7 0 0 0-1.9-1.1L15 3.6h-3.8l-.3 2.4a7.7 7.7 0 0 0-1.9 1.1l-2.2-.9L4.9 9.5l1.9 1.4a7.6 7.6 0 0 0 0 2.2l-1.9 1.4 1.9 3.3 2.2-.9c.6.5 1.2.8 1.9 1.1l.3 2.4H15l.3-2.4c.7-.3 1.3-.6 1.9-1.1l2.2.9 1.9-3.3-1.9-1.4Z" {...S} />
        <circle cx="13.1" cy="12" r="2.7" {...S} />
    </Svg>
)

export const AccountIcon = () => (
    <Svg>
        <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.4" fill="currentColor" />
        <circle cx="12" cy="10" r="2.7" fill="none" stroke="#16202c" strokeWidth="1.6" />
        <path d="M7.4 17.6a4.9 4.9 0 0 1 9.2 0" fill="none" stroke="#16202c" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
)

export const UsersIcon = () => (
    <Svg>
        <circle cx="8.8" cy="9.4" r="2.9" fill="currentColor" />
        <circle cx="16.4" cy="10.2" r="2.3" fill="currentColor" />
        <path d="M3.2 17.8c0-2.6 2.5-4.4 5.6-4.4s5.6 1.8 5.6 4.4v.8H3.2v-.8Z" fill="currentColor" />
        <path d="M15.4 14.2c2.8 0 5.4 1.3 5.4 3.6v.8h-4.5" fill="currentColor" />
    </Svg>
)

export const BellIcon = () => (
    <Svg>
        <path d="M18.2 16.4V11a6.2 6.2 0 1 0-12.4 0v5.4L4.2 18.4h15.6l-1.6-2Z" fill="currentColor" />
        <path d="M10.1 20.2a2 2 0 0 0 3.8 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
)

export const CollapseIcon = () => (
    <Svg>
        <path d="M4 6.6h16M4 17.4h16" {...S} />
        <path d="M20 12h-8.6" {...S} />
        <path d="m8 12 3 2.6M8 12l3-2.6" {...S} />
    </Svg>
)

export const SearchIcon = () => (
    <Svg>
        <circle cx="10.8" cy="10.8" r="6.2" {...S} />
        <path d="m15.4 15.4 4.2 4.2" {...S} />
    </Svg>
)

export const PlusIcon = () => (
    <Svg>
        <path d="M12 5.4v13.2M5.4 12h13.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
)

export const PencilIcon = () => (
    <Svg>
        <path d="M4.6 19.4h3.1L18.5 8.6a1.8 1.8 0 0 0 0-2.5l-.6-.6a1.8 1.8 0 0 0-2.5 0L4.6 16.3v3.1Z" {...S} />
        <path d="m14.4 7 2.6 2.6" {...S} />
    </Svg>
)

export const TrashIcon = () => (
    <Svg>
        <path d="M4.8 6.8h14.4" {...S} />
        <path d="M9.4 6.8V5.2a1.4 1.4 0 0 1 1.4-1.4h2.4a1.4 1.4 0 0 1 1.4 1.4v1.6" {...S} />
        <path d="M6.6 6.8l.9 12a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12" {...S} />
        <path d="M10.4 10.4v6.4M13.6 10.4v6.4" {...S} />
    </Svg>
)

export const SortArrowIcon = () => (
    <Svg viewBox="0 0 16 16">
        <path d="M8 3v10M8 13l-3.2-3.4M8 13l3.2-3.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const CaretDownIcon = () => (
    <Svg viewBox="0 0 12 12">
        <path d="m2.4 4.6 3.6 3.6 3.6-3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const ScrollUpIcon = () => (
    <Svg viewBox="0 0 12 12">
        <path d="m2.6 7.4 3.4-3.4 3.4 3.4Z" fill="currentColor" />
    </Svg>
)

export const ScrollDownIcon = () => (
    <Svg viewBox="0 0 12 12">
        <path d="m2.6 4.6 3.4 3.4 3.4-3.4Z" fill="currentColor" />
    </Svg>
)
