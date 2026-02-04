import React, { useState, useMemo } from "react"
import { useCampaign } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { groupBy, prop } from "ramda"
import Offer from "./components/Offer"

import "./index.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"

const theme = createTheme({
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
})

const themeColors = {
    purple: {
        primary: "#635BFF",
        primaryHover: "#5851EA",
        gradientStart: "#635BFF",
        gradientMid: "#A855F7",
        gradientEnd: "#EC4899",
        text: "#0A2540",
        textSecondary: "#425466",
        background: "#F6F9FC",
        meshColors: ["#635BFF20", "#A855F720", "#EC489920", "#F6F9FC"],
    },
    blue: {
        primary: "#0073E6",
        primaryHover: "#005BBB",
        gradientStart: "#0073E6",
        gradientMid: "#00A3FF",
        gradientEnd: "#00D4FF",
        text: "#0A2540",
        textSecondary: "#425466",
        background: "#F0F9FF",
        meshColors: ["#0073E620", "#00A3FF20", "#00D4FF20", "#F0F9FF"],
    },
    indigo: {
        primary: "#4F46E5",
        primaryHover: "#4338CA",
        gradientStart: "#4F46E5",
        gradientMid: "#7C3AED",
        gradientEnd: "#A855F7",
        text: "#1E1B4B",
        textSecondary: "#4B5563",
        background: "#EEF2FF",
        meshColors: ["#4F46E520", "#7C3AED20", "#A855F720", "#EEF2FF"],
    },
    emerald: {
        primary: "#059669",
        primaryHover: "#047857",
        gradientStart: "#059669",
        gradientMid: "#10B981",
        gradientEnd: "#34D399",
        text: "#064E3B",
        textSecondary: "#4B5563",
        background: "#ECFDF5",
        meshColors: ["#05966920", "#10B98120", "#34D39920", "#ECFDF5"],
    },
    slate: {
        primary: "#475569",
        primaryHover: "#334155",
        gradientStart: "#475569",
        gradientMid: "#64748B",
        gradientEnd: "#94A3B8",
        text: "#0F172A",
        textSecondary: "#64748B",
        background: "#F8FAFC",
        meshColors: ["#47556920", "#64748B20", "#94A3B820", "#F8FAFC"],
    },
}

const groupOffers = groupBy(prop("group__limio"))

const AnimatedBackground = ({ themeStyles, backgroundStyle }) => {
    if (backgroundStyle === "minimal") {
        return (
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: themeStyles.background,
                    zIndex: 0,
                }}
            />
        )
    }

    if (backgroundStyle === "dark") {
        return (
            <>
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#0A0A0F",
                        zIndex: 0,
                    }}
                />
                <Box
                    className="stripe-gradient-orb stripe-gradient-orb-1"
                    sx={{
                        position: "absolute",
                        width: "800px",
                        height: "800px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${themeStyles.gradientStart}30 0%, transparent 70%)`,
                        filter: "blur(80px)",
                        top: "-20%",
                        right: "-10%",
                        zIndex: 0,
                    }}
                />
                <Box
                    className="stripe-gradient-orb stripe-gradient-orb-2"
                    sx={{
                        position: "absolute",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${themeStyles.gradientMid}25 0%, transparent 70%)`,
                        filter: "blur(60px)",
                        bottom: "-10%",
                        left: "-5%",
                        zIndex: 0,
                    }}
                />
                <Box
                    className="stripe-gradient-orb stripe-gradient-orb-3"
                    sx={{
                        position: "absolute",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${themeStyles.gradientEnd}20 0%, transparent 70%)`,
                        filter: "blur(40px)",
                        top: "40%",
                        left: "30%",
                        zIndex: 0,
                    }}
                />
            </>
        )
    }

    if (backgroundStyle === "mesh") {
        return (
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: themeStyles.background,
                    backgroundImage: `
                        radial-gradient(at 0% 0%, ${themeStyles.meshColors[0]} 0px, transparent 50%),
                        radial-gradient(at 100% 0%, ${themeStyles.meshColors[1]} 0px, transparent 50%),
                        radial-gradient(at 100% 100%, ${themeStyles.meshColors[2]} 0px, transparent 50%),
                        radial-gradient(at 0% 100%, ${themeStyles.meshColors[0]} 0px, transparent 50%)
                    `,
                    zIndex: 0,
                }}
            />
        )
    }

    // Animated gradient (default)
    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: themeStyles.background,
                    zIndex: 0,
                }}
            />
            <Box
                className="stripe-gradient-orb stripe-gradient-orb-1"
                sx={{
                    position: "absolute",
                    width: "1000px",
                    height: "1000px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${themeStyles.gradientStart}25 0%, transparent 70%)`,
                    filter: "blur(100px)",
                    top: "-30%",
                    right: "-20%",
                    zIndex: 0,
                }}
            />
            <Box
                className="stripe-gradient-orb stripe-gradient-orb-2"
                sx={{
                    position: "absolute",
                    width: "800px",
                    height: "800px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${themeStyles.gradientMid}20 0%, transparent 70%)`,
                    filter: "blur(80px)",
                    bottom: "-20%",
                    left: "-10%",
                    zIndex: 0,
                }}
            />
            <Box
                className="stripe-gradient-orb stripe-gradient-orb-3"
                sx={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${themeStyles.gradientEnd}15 0%, transparent 70%)`,
                    filter: "blur(60px)",
                    top: "50%",
                    left: "40%",
                    zIndex: 0,
                }}
            />
        </>
    )
}

const BillingToggle = ({
    groupLabels,
    selectedGroup,
    onSelectGroup,
    annualSavingsLabel,
    themeStyles,
    isDark,
}) => {
    return (
        <Box
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.04)",
                borderRadius: "12px",
                p: 0.5,
                position: "relative",
            }}
        >
            {groupLabels.map((label, index) => (
                <Box
                    key={label}
                    onClick={() => onSelectGroup(label)}
                    sx={{
                        position: "relative",
                        px: 3,
                        py: 1.25,
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        backgroundColor:
                            selectedGroup === label
                                ? isDark
                                    ? "rgba(255, 255, 255, 0.12)"
                                    : "#ffffff"
                                : "transparent",
                        boxShadow:
                            selectedGroup === label
                                ? isDark
                                    ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                                    : "0 2px 8px rgba(0, 0, 0, 0.08)"
                                : "none",
                        "&:hover": {
                            backgroundColor:
                                selectedGroup === label
                                    ? isDark
                                        ? "rgba(255, 255, 255, 0.12)"
                                        : "#ffffff"
                                    : isDark
                                        ? "rgba(255, 255, 255, 0.04)"
                                        : "rgba(0, 0, 0, 0.02)",
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'Inter', sans-serif !important",
                            fontSize: "14px !important",
                            fontWeight: selectedGroup === label ? "600 !important" : "500 !important",
                            color: isDark
                                ? selectedGroup === label
                                    ? "#ffffff !important"
                                    : "rgba(255, 255, 255, 0.6) !important"
                                : selectedGroup === label
                                    ? `${themeStyles.text} !important`
                                    : `${themeStyles.textSecondary} !important`,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {label}
                    </Typography>
                    {/* Annual savings badge */}
                    {index === groupLabels.length - 1 && annualSavingsLabel && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "-8px",
                                right: "-12px",
                                backgroundColor: `${themeStyles.primary} !important`,
                                color: "#ffffff !important",
                                px: 1,
                                py: 0.25,
                                borderRadius: "6px !important",
                                fontSize: "10px !important",
                                fontWeight: "700 !important",
                                fontFamily: "'Inter', sans-serif !important",
                                letterSpacing: "0.02em !important",
                                textTransform: "uppercase !important",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {annualSavingsLabel}
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    )
}

const OfferCardsStripe = () => {
    const { offers } = useCampaign()
    const {
        heading,
        subheading,
        componentId,
        themeColor,
        backgroundStyle,
        showImage,
        groupLabels,
        showGroupedOffers,
        annualSavingsLabel,
        showFeatureComparison,
    } = useStaticProps()

    const themeStyles = themeColors[themeColor] || themeColors.purple
    const isDark = backgroundStyle === "dark"

    // Group offers and determine initial selection
    const groupedOffers = useMemo(() => {
        if (!offers || !Array.isArray(offers)) return {}

        const groups = groupOffers(
            offers.map((offer) => ({
                ...offer,
                group__limio: offer?.data?.attributes?.group__limio || "default",
            }))
        )
        return groups
    }, [offers])

    const orderedGroupLabels = useMemo(() => {
        const existingGroups = Object.keys(groupedOffers)
        if (groupLabels && groupLabels.length > 0) {
            return groupLabels.filter((label) => existingGroups.includes(label))
        }
        return existingGroups
    }, [groupLabels, groupedOffers])

    const [selectedGroup, setSelectedGroup] = useState(orderedGroupLabels[0] || "")

    const displayedOffers = useMemo(() => {
        if (showGroupedOffers && selectedGroup && groupedOffers[selectedGroup]) {
            return groupedOffers[selectedGroup]
        }
        return offers || []
    }, [showGroupedOffers, selectedGroup, groupedOffers, offers])

    // Determine which offer should be marked as popular
    const popularOfferIndex = useMemo(() => {
        const bestValueIndex = displayedOffers.findIndex(
            (offer) => offer?.data?.attributes?.best_value__limio === true
        )
        if (bestValueIndex !== -1) return bestValueIndex
        // Default to middle offer for 3+ cards, otherwise first
        return displayedOffers.length >= 3 ? 1 : 0
    }, [displayedOffers])

    if (!offers || offers.length === 0) {
        return null
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    id={componentId}
                    className="offer-cards-stripe"
                    sx={{
                        position: "relative",
                        width: "100%",
                        minHeight: "100vh",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: { xs: 8, lg: 12 },
                        px: { xs: 2, sm: 4, lg: 6 },
                    }}
                >
                    <AnimatedBackground
                        themeStyles={themeStyles}
                        backgroundStyle={backgroundStyle}
                    />

                    {/* Content */}
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            maxWidth: "1280px",
                            mx: "auto",
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                textAlign: "center",
                                mb: { xs: 6, lg: 8 },
                            }}
                        >
                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: "'Inter', sans-serif !important",
                                    fontWeight: "700 !important",
                                    fontSize: { xs: "32px", sm: "40px", lg: "48px" },
                                    color: isDark
                                        ? "#ffffff !important"
                                        : `${themeStyles.text} !important`,
                                    mb: 2,
                                    letterSpacing: "-0.03em !important",
                                    lineHeight: "1.1 !important",
                                }}
                            >
                                {heading}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Inter', sans-serif !important",
                                    fontSize: { xs: "16px", lg: "18px" },
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.7) !important"
                                        : `${themeStyles.textSecondary} !important`,
                                    maxWidth: "600px",
                                    mx: "auto",
                                    lineHeight: "1.6 !important",
                                }}
                            >
                                {subheading}
                            </Typography>

                            {/* Billing Toggle */}
                            {showGroupedOffers && orderedGroupLabels.length > 1 && (
                                <Box sx={{ mt: 5 }}>
                                    <BillingToggle
                                        groupLabels={orderedGroupLabels}
                                        selectedGroup={selectedGroup}
                                        onSelectGroup={setSelectedGroup}
                                        annualSavingsLabel={annualSavingsLabel}
                                        themeStyles={themeStyles}
                                        isDark={isDark}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Cards Grid */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: { xs: 3, lg: 4 },
                                alignItems: "stretch",
                            }}
                        >
                            {displayedOffers.map((offer, index) => (
                                <Box
                                    key={offer?.id || index}
                                    sx={{
                                        flex: {
                                            xs: "1 1 100%",
                                            sm: "1 1 calc(50% - 16px)",
                                            lg: displayedOffers.length <= 3
                                                ? "0 1 360px"
                                                : "1 1 calc(25% - 24px)",
                                        },
                                        maxWidth: "360px",
                                        display: "flex",
                                    }}
                                >
                                    <Offer
                                        offer={offer}
                                        themeStyles={themeStyles}
                                        showImage={showImage}
                                        showFeatureComparison={showFeatureComparison}
                                        isPopular={index === popularOfferIndex}
                                        backgroundStyle={backgroundStyle}
                                    />
                                </Box>
                            ))}
                        </Box>

                        {/* Trust indicators */}
                        <Box
                            sx={{
                                textAlign: "center",
                                mt: { xs: 6, lg: 8 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "'Inter', sans-serif !important",
                                    fontSize: "13px !important",
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.4) !important"
                                        : `${themeStyles.textSecondary} !important`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Secure checkout
                                </span>
                                <span style={{ opacity: 0.3 }}>•</span>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                        <line x1="1" y1="10" x2="23" y2="10" />
                                    </svg>
                                    Cancel anytime
                                </span>
                                <span style={{ opacity: 0.3 }}>•</span>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    24/7 support
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default OfferCardsStripe
