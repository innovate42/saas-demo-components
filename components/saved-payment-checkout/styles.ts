import type { CSSProperties } from "react"

const text = "#1a1f36"
const textMuted = "#697386"
const border = "#e3e8ee"
const card = "#ffffff"
const selected = "#16a34a"
const selectedBg = "#f0fdf4"
const expired = "#dc2626"
const expiring = "#ea580c"
const warningBg = "#fff7ed"
const warningBorder = "#fed7aa"
const warningText = "#9a3412"

const visuallyHidden: CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
    opacity: 0,
}

export const s = {
    container: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        color: text,
        WebkitFontSmoothing: "antialiased",
        width: "100%",
        boxSizing: "border-box",
    } as CSSProperties,

    heading: {
        fontSize: 15,
        fontWeight: 600,
        margin: "0 0 12px",
        padding: 0,
        color: text,
        lineHeight: 1.4,
    } as CSSProperties,

    fieldset: {
        border: "none",
        margin: 0,
        padding: 0,
        minWidth: 0,
        width: "100%",
    } as CSSProperties,

    legend: visuallyHidden,

    cardList: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
    } as CSSProperties,

    card: (isSelected: boolean): CSSProperties => ({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        background: isSelected ? selectedBg : card,
        border: `2px solid ${isSelected ? selected : border}`,
        borderRadius: 10,
        padding: "16px 20px",
        margin: 0,
        boxShadow: isSelected ? `0 0 0 1px ${selected}` : "0 1px 3px rgba(0,0,0,0.06)",
        cursor: "pointer",
        width: "100%",
        textAlign: "left" as const,
        lineHeight: 1.4,
        boxSizing: "border-box",
        position: "relative",
    }),

    radioInput: visuallyHidden,

    cardBody: {
        flex: "1 1 auto",
        minWidth: 0,
    } as CSSProperties,

    cardHeader: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    } as CSSProperties,

    cardInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
    } as CSSProperties,

    cardTopRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    } as CSSProperties,

    cardLabel: {
        fontSize: 14,
        fontWeight: 600,
        color: text,
    } as CSSProperties,

    cardNumber: {
        fontSize: 14,
        fontWeight: 500,
        color: textMuted,
        letterSpacing: "0.02em",
    } as CSSProperties,

    icon: {
        width: 40,
        height: 28,
        minWidth: 40,
        maxWidth: 40,
        minHeight: 28,
        maxHeight: 28,
        color: textMuted,
        flexShrink: 0,
        overflow: "hidden",
    } as CSSProperties,

    iconSvg: {
        width: 40,
        height: 28,
        display: "block",
    } as CSSProperties,

    expiry: (status: "valid" | "expiring-soon" | "expired"): CSSProperties => ({
        fontSize: 13,
        color: status === "expired" ? expired : status === "expiring-soon" ? expiring : textMuted,
        fontWeight: status === "valid" ? 400 : 500,
        marginTop: 2,
    }),

    cardFooter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTop: `1px solid ${border}`,
    } as CSSProperties,

    holder: {
        fontSize: 13,
        color: textMuted,
    } as CSSProperties,

    checkIndicator: (isSelected: boolean): CSSProperties => ({
        flexShrink: 0,
        width: 20,
        height: 20,
        minWidth: 20,
        maxWidth: 20,
        color: isSelected ? selected : border,
    }),

    checkSvg: {
        width: 20,
        height: 20,
        display: "block",
    } as CSSProperties,

    addMethodLink: {
        display: "block",
        marginTop: 12,
        fontSize: 13,
        fontWeight: 500,
        color: textMuted,
        textDecoration: "none",
        textAlign: "center" as const,
        padding: 10,
        border: `1px dashed ${border}`,
        borderRadius: 8,
    } as CSSProperties,

    warning: {
        background: warningBg,
        border: `1px solid ${warningBorder}`,
        borderRadius: 10,
        padding: "14px 20px",
        fontSize: 14,
        color: warningText,
        lineHeight: 1.5,
    } as CSSProperties,

    skeleton: {
        padding: "16px 20px",
        background: card,
        border: `1px solid ${border}`,
        borderRadius: 10,
    } as CSSProperties,

    skeletonLine: (width: string): CSSProperties => ({
        height: 14,
        background: "#e5e7eb",
        borderRadius: 4,
        width,
    }),
}
