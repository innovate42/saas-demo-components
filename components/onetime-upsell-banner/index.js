import React from "react"
import {
  useUser,
  useSubscriptions,
  useComponentProps,
  getPropsFromPackageJson,
  sanitiseHTML,
  useLimioContext,
} from "@limio/sdk"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles"
import { CssBaseline, Button, Box, Typography } from "@mui/material"
import xss from "xss"
import packageData from "./package.json"
import "./fonts.css"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

// Palette mirrors offer-cards-material so the banner sits visually next to it.
const themeStyles = {
  orange: {
    primary: "#E16A00",
    background: "#FEF1E9",
    cardBackground: "#FFFBF7",
    pillBackground: "#FBE9D8",
    pillText: "#B84C00",
    borderColor: "#E16A00",
    text: "#6B3E26",
  },
  blue: {
    primary: "#005C99",
    background: "#EAF3FB",
    cardBackground: "#F4F9FD",
    pillBackground: "#D0E7F8",
    pillText: "#004A80",
    borderColor: "#0073C2",
    text: "#003355",
  },
  red: {
    primary: "#C62828",
    background: "#FDECEA",
    cardBackground: "#FEF6F6",
    pillBackground: "#F9D3D3",
    pillText: "#8B0000",
    borderColor: "#B71C1C",
    text: "#5C1C1C",
  },
  green: {
    primary: "#2E7D32",
    background: "#E7F5EC",
    cardBackground: "#F3FAF5",
    pillBackground: "#D2EBDD",
    pillText: "#1B5E20",
    borderColor: "#388E3C",
    text: "#1B3D1B",
  },
  black: {
    primary: "#333333",
    background: "#F6F6F6",
    cardBackground: "#FDFDFD",
    pillBackground: "#DCDCDC",
    pillText: "#111111",
    borderColor: "#222222",
    text: "#111111",
  },
  grey: {
    primary: "#6E6E6E",
    background: "#FAFAFA",
    cardBackground: "#FFFFFF",
    pillBackground: "#ECECEC",
    pillText: "#5C5C5C",
    borderColor: "#BBBBBB",
    text: "#3C3C3C",
  },
}

const theme = createTheme({
  typography: {
    fontFamily: `'Inter', 'system-ui', 'Helvetica Neue', Arial, sans-serif`,
  },
})

// ---------- Pure helpers (exported for unit testing) ----------

/**
 * An offer is "one-time" if every price entry is type "onetime",
 * or if autoRenew__limio is explicitly false.
 */
export const isOneTimeOffer = (offerAttrs = {}) => {
  const prices = offerAttrs.price__limio || []
  const allOnetimePrices = prices.length > 0 && prices.every((p) => p?.type === "onetime")
  const autoRenewFalse = offerAttrs.autoRenew__limio === false
  return allOnetimePrices || autoRenewFalse
}

const getCurrentNonDiscountOffer = (sub) =>
  (sub?.offers || []).find((o) => o?.data?.record_subtype !== "discount")

const getOfferAttributes = (sub) => {
  const off = getCurrentNonDiscountOffer(sub)
  return off?.data?.offer?.data?.attributes
}

const isActiveSubscription = (sub) => {
  const status = (sub?.status || "").toLowerCase()
  // No status set => assume active (real SDK and mocks differ here)
  return status === "" || status === "active"
}

/** Count of active subscriptions whose current (non-discount) offer is one-time. */
export const countOnetimeOnlySubs = (subscriptions = []) =>
  subscriptions
    .filter(isActiveSubscription)
    .filter((s) => {
      const attrs = getOfferAttributes(s)
      return attrs && isOneTimeOffer(attrs)
    }).length

/** True if at least one active subscription has a recurring current offer. */
export const hasAnyRecurringSub = (subscriptions = []) =>
  subscriptions.filter(isActiveSubscription).some((s) => {
    const attrs = getOfferAttributes(s)
    return attrs && !isOneTimeOffer(attrs)
  })

// ---------------------------------------------------------------

const OnetimeUpsellBanner = () => {
  const props = useComponentProps(defaultProps)
  const {
    headingTemplate,
    subheading__limio_richtext,
    ctaLabel,
    learnMoreUrl,
    themeColor,
    minCourses,
  } = props

  const { isInPageBuilder } = useLimioContext() || {}
  const { loginStatus, loaded } = useUser()
  const { subscriptions } = useSubscriptions()

  // Wait for user data to load (except in the page builder, where we always render).
  if (!loaded && !isInPageBuilder) return null

  // Real SDK uses "logged_in"; some mocks return "logged-in" — accept both.
  const isLoggedIn = loginStatus === "logged_in" || loginStatus === "logged-in"
  if (!isLoggedIn && !isInPageBuilder) return null

  const subs = Array.isArray(subscriptions) ? subscriptions : []
  const onetimeCount = countOnetimeOnlySubs(subs)
  const threshold = Number(minCourses) || 1

  const eligible =
    isInPageBuilder ||
    (subs.length > 0 && onetimeCount >= threshold && !hasAnyRecurringSub(subs))
  if (!eligible) return null

  const palette = themeStyles[themeColor] || themeStyles.orange
  const displayCount = onetimeCount || 0
  const heading = (
    headingTemplate ||
    "You have {count} courses so far. You could save money by buying a subscription."
  ).replace("{count}", String(displayCount))

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          className="onetime-upsell-banner oub-banner"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: palette.background,
            border: `1px solid ${palette.borderColor}`,
            color: palette.text,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="div"
              sx={{
                fontWeight: 600,
                color: palette.text,
                fontSize: { xs: "1rem", sm: "1.0625rem" },
                lineHeight: 1.4,
              }}
            >
              {heading}
            </Typography>
            {subheading__limio_richtext && (
              <Box
                className="oub-subheading"
                sx={{ mt: 0.5, color: palette.text, opacity: 0.85, fontSize: "0.9375rem" }}
                dangerouslySetInnerHTML={{
                  __html:
                    sanitiseHTML(subheading__limio_richtext) ||
                    xss(subheading__limio_richtext),
                }}
              />
            )}
          </Box>
          <Button
            variant="contained"
            href={learnMoreUrl || "#"}
            disableElevation
            sx={{
              flexShrink: 0,
              bgcolor: palette.primary,
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              px: 3,
              py: 1,
              alignSelf: { xs: "flex-start", sm: "center" },
              "&:hover": { bgcolor: palette.borderColor },
            }}
          >
            {ctaLabel || "Learn more"}
          </Button>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default OnetimeUpsellBanner
