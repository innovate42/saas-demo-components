/**
 * MUI-free icon shim. Replaces `@mui/icons-material/*` (dropped in the design-system
 * migration, LI-11395) with plain inline SVGs using the same Material glyph paths and
 * the `MuiSvgIcon-root` class + `data-testid` so existing page CSS keeps targeting them.
 */
import * as React from "react"

type IconProps = {
  className?: string
  sx?: Record<string, any>
  style?: React.CSSProperties
  fontSize?: string
  [key: string]: any
}

const PATHS: Record<string, string> = {
  Add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z",
  Autorenew: "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6m6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26",
  Extension: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11",
  Cancel: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z",
  CalendarToday: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 18H4V8h16z",
  TableRows: "M21 8H3V4h18zm0 2H3v4h18zm0 6H3v4h18z",
  Error: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z",
}

function makeIcon(name: string) {
  const Icon = ({ className = "", sx, style, fontSize, ...rest }: IconProps) => {
    const merged: React.CSSProperties = {
      width: "1em",
      height: "1em",
      fontSize: fontSize === "small" ? "1.25rem" : fontSize === "large" ? "2.1875rem" : "1.5rem",
      fill: "currentColor",
      flexShrink: 0,
      ...(sx && typeof sx.color === "string" ? { color: sx.color } : {}),
      ...style,
    }
    return (
      <svg
        className={`MuiSvgIcon-root ${className}`.trim()}
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 24 24"
        data-testid={`${name}Icon`}
        style={merged}
        {...rest}
      >
        <path d={PATHS[name]} />
      </svg>
    )
  }
  Icon.displayName = `${name}Icon`
  return Icon
}

export const AddIcon = makeIcon("Add")
export const AutorenewIcon = makeIcon("Autorenew")
export const ExtensionIcon = makeIcon("Extension")
export const CancelIcon = makeIcon("Cancel")
export const CalendarTodayIcon = makeIcon("CalendarToday")
export const TableRowsIcon = makeIcon("TableRows")
export const ErrorIcon = makeIcon("Error")
