import type { CSSProperties } from "react"

// Match saved-payment-methods grid layout:
// Desktop: tw-grid-cols-[350px_350px] tw-gap-6 tw-p-6 tw-w-auto
// Mobile: tw-grid-cols-1 tw-w-full tw-p-6

export const s = {
    // Centering wrapper — matches saved-payment-methods: tw-flex tw-justify-center tw-w-full
    centerWrapper: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
    } as CSSProperties,

    // Grid container matches saved-payment-methods:
    // tw-grid tw-grid-cols-1 md:tw-grid-cols-[350px_350px] tw-w-full md:tw-w-auto tw-gap-6 tw-p-6
    outerGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        width: "100%",
        gap: 24,
        padding: 24,
        boxSizing: "border-box",
    } as CSSProperties,

    // The alert card spans the full grid width (both columns on desktop)
    alertCard: (bgColor: string, borderColor: string, textColor: string): CSSProperties => ({
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 16,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 10,
        padding: "20px 24px",
        color: textColor,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        width: "100%",
        boxSizing: "border-box",
        gridColumn: "1 / -1",
    }),

    iconContainer: {
        flexShrink: 0,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.85,
    } as CSSProperties,

    iconSvg: {
        width: 28,
        height: 28,
        display: "block",
    } as CSSProperties,

    contentArea: {
        flex: "1 1 auto",
        minWidth: 0,
    } as CSSProperties,

    heading: {
        fontSize: 15,
        fontWeight: 600,
        margin: "0 0 6px",
        padding: 0,
        lineHeight: 1.4,
    } as CSSProperties,

    subline: {
        fontSize: 14,
        lineHeight: 1.5,
        margin: "0 0 16px",
        opacity: 0.85,
    } as CSSProperties,

    ctaButton: {
        display: "inline-block",
        fontSize: 14,
        fontWeight: 600,
        padding: "8px 20px",
        borderRadius: 8,
        border: "1px solid currentColor",
        textDecoration: "none",
        color: "inherit",
        background: "transparent",
        cursor: "pointer",
        lineHeight: 1.4,
    } as CSSProperties,

    // Responsive CSS matching saved-payment-methods breakpoint
    // Desktop: 2-column grid (350px 350px), auto width, centered
    // Mobile: 1-column, full width
    responsiveCss: `
        @media (min-width: 768px) {
            .expiry-alert-grid {
                grid-template-columns: 350px 350px !important;
                width: auto !important;
            }
        }
    `,

    skeleton: {
        padding: "20px 24px",
        background: "#f9fafb",
        border: "1px solid #e3e8ee",
        borderRadius: 10,
        width: "100%",
        boxSizing: "border-box",
    } as CSSProperties,

    skeletonLine: (width: string): CSSProperties => ({
        height: 14,
        background: "#e5e7eb",
        borderRadius: 4,
        width,
    }),
}
