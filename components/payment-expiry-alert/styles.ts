import type { CSSProperties } from "react"

export const s = {
    container: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
        width: "100%",
        boxSizing: "border-box",
    } as CSSProperties,

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
        width: "100%",
        boxSizing: "border-box",
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

    skeleton: {
        padding: "20px 24px",
        background: "#f9fafb",
        border: "1px solid #e3e8ee",
        borderRadius: 10,
    } as CSSProperties,

    skeletonLine: (width: string): CSSProperties => ({
        height: 14,
        background: "#e5e7eb",
        borderRadius: 4,
        width,
    }),
}
