/**
 * MUI-free component shim. Replaces `@mui/material` (dropped in the design-system
 * migration, LI-11395) with plain React/HTML. Emits MUI-compatible class names so the
 * component's own CSS and page-level pageStyle keep targeting the same hooks.
 *
 * This is a build-unblocking stopgap for the shop until the shop-component phase of the
 * DS migration provides first-class primitives; component logic is unchanged — only the
 * import source moves from "@mui/material" to "./mui".
 */
import * as React from "react"

const SP = 8 // MUI spacing unit (px)
const px = (v: any) => (typeof v === "number" ? `${v * SP}px` : v)
const pick = <T,>(v: T | Record<string, T> | undefined): T | undefined =>
  v && typeof v === "object" ? (v as any).xs ?? Object.values(v as any)[0] : (v as any)

/** Convert a subset of MUI's `sx`/spacing props to inline style. */
function sxToStyle(sx: any = {}): React.CSSProperties {
  const s: any = {}
  const map: Record<string, string> = {
    m: "margin", mt: "marginTop", mb: "marginBottom", ml: "marginLeft", mr: "marginRight",
    mx: "marginInline", my: "marginBlock", p: "padding", pt: "paddingTop", pb: "paddingBottom",
    pl: "paddingLeft", pr: "paddingRight", px: "paddingInline", py: "paddingBlock",
    width: "width", height: "height", minWidth: "minWidth", maxWidth: "maxWidth", color: "color",
    bgcolor: "backgroundColor", backgroundColor: "backgroundColor", display: "display",
    fontWeight: "fontWeight", fontSize: "fontSize", textAlign: "textAlign", flex: "flex", gap: "gap",
  }
  for (const [k, v] of Object.entries(sx || {})) {
    if (map[k]) s[map[k]] = /^(m|p)/.test(k) && k !== "maxWidth" && k !== "minWidth" ? px(v) : v as any
  }
  return s
}

type Any = Record<string, any>
const cx = (...c: (string | undefined | false)[]) => c.filter(Boolean).join(" ")

export const Box = ({ children, className, sx, style, ...r }: Any) => (
  <div className={cx("MuiBox-root", className)} style={{ ...sxToStyle(sx), ...style }} {...r}>{children}</div>
)

export const Stack = ({ children, className, sx, style, direction, spacing, alignItems, justifyContent, ...r }: Any) => {
  const dir = pick(direction) || "column"
  const st: React.CSSProperties = {
    display: "flex", flexDirection: dir, alignItems, justifyContent,
    gap: spacing != null ? px(pick(spacing)) : undefined, ...sxToStyle(sx), ...style,
  }
  // margin props passed directly (mb, mt, ...)
  const mstyle = sxToStyle(r)
  return <div className={cx("MuiStack-root", className)} style={{ ...st, ...mstyle }}>{children}</div>
}

const VARIANT_TAG: Record<string, string> = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", h5: "h5", h6: "h6", subtitle1: "h6", subtitle2: "h6", body1: "p", body2: "p", caption: "span", overline: "span" }
export const Typography = ({ children, className, sx, style, variant = "body1", fontWeight, color, component, ...r }: Any) => {
  const Tag = (component || VARIANT_TAG[variant] || "p") as any
  const col = color && !String(color).startsWith("text.") ? color : undefined
  return <Tag className={cx("MuiTypography-root", `MuiTypography-${variant}`, className)}
    style={{ fontWeight, color: col, margin: 0, ...sxToStyle(sx), ...style }} {...r}>{children}</Tag>
}

export const Button = ({ children, className, sx, style, variant = "text", color = "primary", size, startIcon, endIcon, disabled, onClick, ...r }: Any) => {
  const vClass = variant === "contained" ? `MuiButton-contained MuiButton-contained${cap(color)}`
    : variant === "outlined" ? `MuiButton-outlined MuiButton-outlined${cap(color)}` : "MuiButton-text"
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={cx("MuiButtonBase-root", "MuiButton-root", vClass, `MuiButton-color${cap(color)}`, size && `MuiButton-size${cap(size)}`, className)}
      style={{ ...sxToStyle(sx), ...style }} {...r}>
      {startIcon && <span className="MuiButton-icon MuiButton-startIcon">{startIcon}</span>}
      {children}
      {endIcon && <span className="MuiButton-icon MuiButton-endIcon">{endIcon}</span>}
    </button>
  )
}

export const Chip = ({ label, children, className, sx, style, color = "default", size, icon, ...r }: Any) => (
  <div className={cx("MuiChip-root", "MuiChip-filled", `MuiChip-color${cap(color)}`, size && `MuiChip-size${cap(size)}`, className)}
    style={{ ...sxToStyle(sx), ...style }} {...r}>
    {icon}
    <span className="MuiChip-label">{label ?? children}</span>
  </div>
)

export const Divider = ({ className, sx, style, ...r }: Any) => (
  <hr className={cx("MuiDivider-root", className)} style={{ ...sxToStyle(sx), ...style }} {...r} />
)

export const Card = ({ children, className, sx, style, ...r }: Any) => (
  <div className={cx("MuiPaper-root", "MuiCard-root", className)} style={{ ...sxToStyle(sx), ...style }} {...r}>{children}</div>
)
export const CardContent = ({ children, className, sx, style, ...r }: Any) => (
  <div className={cx("MuiCardContent-root", className)} style={{ ...sxToStyle(sx), ...style }} {...r}>{children}</div>
)

export const Container = ({ children, className, sx, style, maxWidth, ...r }: Any) => (
  <div className={cx("MuiContainer-root", className)} style={{ width: "100%", marginInline: "auto", ...sxToStyle(sx), ...style }} {...r}>{children}</div>
)

// Table primitives -> semantic table
export const Table = ({ children, className, sx, style, ...r }: Any) => (
  <table className={cx("MuiTable-root", className)} style={{ width: "100%", borderCollapse: "collapse", ...sxToStyle(sx), ...style }} {...r}>{children}</table>
)
export const TableBody = ({ children, className, ...r }: Any) => <tbody className={cx("MuiTableBody-root", className)} {...r}>{children}</tbody>
export const TableRow = ({ children, className, ...r }: Any) => <tr className={cx("MuiTableRow-root", className)} {...r}>{children}</tr>
export const TableCell = ({ children, className, sx, style, align, colSpan, ...r }: Any) => (
  <td className={cx("MuiTableCell-root", className)} colSpan={colSpan} style={{ textAlign: align, ...sxToStyle(sx), ...style }} {...r}>{children}</td>
)

// TextField used only as a `select` here -> native select; MenuItem -> option
export const TextField = ({ className, sx, style, select, label, value, onChange, size, children, ...r }: Any) => (
  <div className={cx("MuiFormControl-root", "MuiTextField-root", className)} style={{ display: "inline-flex", flexDirection: "column", ...sxToStyle(sx), ...style }}>
    {label && <label className="MuiInputLabel-root" style={{ fontSize: 12, color: "#6B5B4E" }}>{label}</label>}
    <select value={value} onChange={onChange}
      className={cx("MuiSelect-select", "MuiInputBase-input", size && `MuiInputBase-size${cap(size)}`)}
      style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #C9B79D", background: "#fff", font: "inherit" }} {...r}>
      {children}
    </select>
  </div>
)
export const MenuItem = ({ value, children, ...r }: Any) => <option value={value} {...r}>{children}</option>

export const Skeleton = ({ className, sx, style, variant = "text", width, height, ...r }: Any) => (
  <div className={cx("MuiSkeleton-root", `MuiSkeleton-${variant}`, className)} aria-busy="true"
    style={{ width, height, background: "rgba(0,0,0,0.08)", borderRadius: variant === "rounded" ? 12 : 4, animation: "pulse 1.5s ease-in-out infinite", ...sxToStyle(sx), ...style }} {...r} />
)

// Feedback
export const Snackbar = ({ open, children, className, style, ...r }: Any) => open ? (
  <div className={cx("MuiSnackbar-root", className)} role="presentation"
    style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 1400, ...style }} {...r}>{children}</div>
) : null
export const Alert = ({ children, className, severity = "info", style, ...r }: Any) => (
  <div className={cx("MuiAlert-root", `MuiAlert-${severity}`, className)} role="alert"
    style={{ padding: "8px 16px", borderRadius: 8, background: severity === "error" ? "#FDECEA" : severity === "success" ? "#EDF7ED" : "#E8F0FE", color: "#211712", boxShadow: "0 2px 8px rgba(0,0,0,.15)", ...style }} {...r}>{children}</div>
)

// Dialog
export const Dialog = ({ open, children, className, onClose, style, ...r }: Any) => open ? (
  <div className={cx("MuiDialog-root", className)} role="dialog" aria-modal="true"
    style={{ position: "fixed", inset: 0, zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.4)", ...style }}
    onClick={(e: any) => { if (e.target === e.currentTarget && onClose) onClose(e, "backdropClick") }} {...r}>
    <div className="MuiPaper-root MuiDialog-paper" style={{ background: "#FFFDF9", borderRadius: 16, maxWidth: 480, width: "90%", padding: 8, boxShadow: "0 10px 40px rgba(33,23,18,.2)" }}>{children}</div>
  </div>
) : null
export const DialogTitle = ({ children, className, ...r }: Any) => <h2 className={cx("MuiDialogTitle-root", className)} style={{ margin: 0, padding: "16px 24px 8px", fontFamily: '"Newsreader", Georgia, serif' }} {...r}>{children}</h2>
export const DialogContent = ({ children, className, ...r }: Any) => <div className={cx("MuiDialogContent-root", className)} style={{ padding: "8px 24px" }} {...r}>{children}</div>
export const DialogActions = ({ children, className, ...r }: Any) => <div className={cx("MuiDialogActions-root", className)} style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: 16 }} {...r}>{children}</div>

// Theming -> no-ops (tokens/CSS drive styling now)
export const ThemeProvider = ({ children }: Any) => <>{children}</>
export const createTheme = (_?: any) => ({})

function cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : "" }
