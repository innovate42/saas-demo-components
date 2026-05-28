import React, { useMemo, useState } from "react"
import { useCampaign } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import Offer from "./components/Offer.js"
import * as R from "ramda"
import "./fonts.css"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { StyledEngineProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import {
    Box,
    Button,
    MenuItem,
    Select,
    Typography,
    FormControl,
} from "@mui/material"

const themeStyles = {
    orange: {
        primary: "#E16A00",
        background: "#FEF1E9",
        cardBackground: "#FFFBF7",
        pillBackground: "#FBE9D8",
        pillText: "#B84C00",
        borderColor: "#E16A00",
        text: "#6B3E26",
        gatingBg: "#FFF8F3",
        gatingBorder: "#F5C9A0",
    },
    blue: {
        primary: "#005C99",
        background: "#EAF3FB",
        cardBackground: "#F4F9FD",
        pillBackground: "#D0E7F8",
        pillText: "#004A80",
        borderColor: "#0073C2",
        text: "#003355",
        gatingBg: "#EAF4FB",
        gatingBorder: "#A8D4F0",
    },
    red: {
        primary: "#C62828",
        background: "#FDECEA",
        cardBackground: "#FEF6F6",
        pillBackground: "#F9D3D3",
        pillText: "#8B0000",
        borderColor: "#B71C1C",
        text: "#5C1C1C",
        gatingBg: "#FDF2F2",
        gatingBorder: "#F5AAAA",
    },
    green: {
        primary: "#2E7D32",
        background: "#E7F5EC",
        cardBackground: "#F3FAF5",
        pillBackground: "#D2EBDD",
        pillText: "#1B5E20",
        borderColor: "#388E3C",
        text: "#1B3D1B",
        gatingBg: "#EDF7EF",
        gatingBorder: "#A5D6A7",
    },
    black: {
        primary: "#333333",
        background: "#F6F6F6",
        cardBackground: "#FDFDFD",
        pillBackground: "#DCDCDC",
        pillText: "#111111",
        borderColor: "#222222",
        text: "#111111",
        gatingBg: "#F5F5F5",
        gatingBorder: "#CCCCCC",
    },
    grey: {
        primary: "#6E6E6E",
        background: "#FAFAFA",
        cardBackground: "#FFFFFF",
        pillBackground: "#ECECEC",
        pillText: "#5C5C5C",
        borderColor: "#BBBBBB",
        text: "#3C3C3C",
        gatingBg: "#F7F7F7",
        gatingBorder: "#DDDDDD",
    },
}

const muiTheme = createTheme({
    typography: {
        fontFamily: "'Inter', 'system-ui', 'Helvetica Neue', Arial, sans-serif",
    },
})

function groupOffers(offers, groupLabels) {
    const groups = R.groupBy(R.path(["data", "attributes", "group__limio"]), offers)
    const order = groupLabels.map((g) => g.id)

    const reordered = {}
    order.forEach((key) => {
        if (groups[key]) reordered[key] = groups[key]
    })

    return Object.keys(reordered).map((groupId) => {
        const def = groupLabels.find((g) => g.id === groupId) || { id: groupId, label: groupId }
        return { id: groupId, label: def.label, offers: reordered[groupId] }
    })
}

export const OffersPropelus = () => {
    const props = useStaticProps() || {}
    const {
        heading = "Propelus Plans and Packages",
        subheading = "Find the best course or subscription for you",
        componentId = "offers-propelus",
        showImage = true,
        offerWidth = 2,
        themeColor = "blue",
        showGroupedOffers = false,
        groupLabels = [],
        freeTrialLink,
        gatingHeading = "Select your location and profession",
        gatingSubheading = "Please select the state or country where you are licensed/certified.",
        gatingPrefixLabel = "I'm a",
        gatingStateLabel = "Pick your location",
        gatingRoleLabel = "Pick your profession",
        continueButtonText = "Continue",
        roleLabels = [],
        stateLabels = [],
    } = props

    const { offers } = useCampaign() || {}
    const themeSet = themeStyles[themeColor] || themeStyles.blue

    // Gating state
    const [gatingMode, setGatingMode] = useState(true)
    const [pendingRole, setPendingRole] = useState("")
    const [pendingState, setPendingState] = useState("")
    const [activeRole, setActiveRole] = useState("")
    const [activeState, setActiveState] = useState("")

    // Derive unique role/state values from all offers
    const allRoles = useMemo(() => {
        const seen = new Set()
        ;(offers || []).forEach((o) => {
            const val = o?.data?.attributes?.role
            const arr = Array.isArray(val) ? val : val ? [val] : []
            arr.forEach((v) => seen.add(v))
        })
        return Array.from(seen)
    }, [offers])

    const allStates = useMemo(() => {
        const seen = new Set()
        ;(offers || []).forEach((o) => {
            const val = o?.data?.attributes?.state
            const arr = Array.isArray(val) ? val : val ? [val] : []
            arr.forEach((v) => seen.add(v))
        })
        return Array.from(seen)
    }, [offers])

    const getRoleLabel = (id) =>
        (roleLabels || []).find((r) => r.id === id)?.label || id

    const getStateLabel = (id) =>
        (stateLabels || []).find((s) => s.id === id)?.label || id

    // Filter offers to those matching both active role and state
    const filteredOffers = useMemo(() => {
        return (offers || []).filter((o) => {
            const attrs = o?.data?.attributes || {}
            const roles = [].concat(attrs.role || [])
            const states = [].concat(attrs.state || [])
            if (activeRole && !roles.includes(activeRole)) return false
            if (activeState && !states.includes(activeState)) return false
            return true
        })
    }, [offers, activeRole, activeState])

    const offerGroups = useMemo(
        () => groupOffers(filteredOffers, groupLabels || []),
        [filteredOffers, groupLabels]
    )

    const [selectedGroup, setSelectedGroup] = useState()
    React.useEffect(() => {
        if (!selectedGroup && offerGroups.length > 0) {
            setSelectedGroup(offerGroups[0]?.id)
        }
    }, [offerGroups, selectedGroup])

    const selectedGroupOffers =
        offerGroups.find((g) => g.id === selectedGroup)?.offers || []

    const hasBestValue = selectedGroupOffers.some(
        (o) => o.data.attributes.best_value__limio
    )

    const canContinue = pendingRole !== "" && pendingState !== ""

    const handleContinue = () => {
        setActiveRole(pendingRole)
        setActiveState(pendingState)
        setSelectedGroup(undefined)
        setGatingMode(false)
    }

    const handleReset = () => {
        setPendingRole(activeRole)
        setPendingState(activeState)
        setGatingMode(true)
    }

    const selectSx = {
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        minWidth: "180px",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: themeSet.gatingBorder,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: themeSet.primary,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: themeSet.primary,
        },
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <section id={componentId} className="offers-propelus">

                    {gatingMode ? (
                        /* ── Gating screen ── */
                        <Box
                            sx={{
                                backgroundColor: themeSet.gatingBg,
                                minHeight: "calc(100vh - 60px)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                px: { xs: 3, md: 4 },
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                                    fontWeight: 800,
                                    letterSpacing: "-0.01em",
                                    color: "#111827",
                                    mb: 1.5,
                                    fontFamily: "Inter, sans-serif",
                                    lineHeight: 1.2,
                                }}
                            >
                                {gatingHeading}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "15px",
                                    color: "#6B7280",
                                    fontFamily: "Inter, sans-serif",
                                    mb: 5,
                                }}
                            >
                                {gatingSubheading}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: { xs: 1.5, md: 2 },
                                    flexWrap: "wrap",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "15px",
                                        color: "#374151",
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {gatingPrefixLabel}
                                </Typography>

                                {/* State / location dropdown */}
                                <FormControl size="small">
                                    <Select
                                        value={pendingState}
                                        onChange={(e) => setPendingState(e.target.value)}
                                        displayEmpty
                                        sx={selectSx}
                                    >
                                        <MenuItem value="" disabled>
                                            <em style={{ color: "#9CA3AF", fontStyle: "normal" }}>
                                                {gatingStateLabel}
                                            </em>
                                        </MenuItem>
                                        {allStates.map((s) => (
                                            <MenuItem key={s} value={s}>
                                                {getStateLabel(s)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Role / profession dropdown */}
                                <FormControl size="small">
                                    <Select
                                        value={pendingRole}
                                        onChange={(e) => setPendingRole(e.target.value)}
                                        displayEmpty
                                        sx={selectSx}
                                    >
                                        <MenuItem value="" disabled>
                                            <em style={{ color: "#9CA3AF", fontStyle: "normal" }}>
                                                {gatingRoleLabel}
                                            </em>
                                        </MenuItem>
                                        {allRoles.map((r) => (
                                            <MenuItem key={r} value={r}>
                                                {getRoleLabel(r)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    disabled={!canContinue}
                                    onClick={handleContinue}
                                    sx={{
                                        backgroundColor: `${themeSet.primary} !important`,
                                        color: "#FFFFFF !important",
                                        fontFamily: "Inter, sans-serif !important",
                                        fontWeight: "600 !important",
                                        fontSize: "15px !important",
                                        textTransform: "none !important",
                                        px: "28px !important",
                                        py: "9px !important",
                                        borderRadius: "8px !important",
                                        boxShadow: "none !important",
                                        whiteSpace: "nowrap",
                                        "&:hover": {
                                            filter: "brightness(0.9)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15) !important",
                                        },
                                        "&.Mui-disabled": {
                                            backgroundColor: "#D1D5DB !important",
                                            color: "#9CA3AF !important",
                                        },
                                    }}
                                >
                                    {continueButtonText}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        /* ── Offers view ── */
                        <Box
                            sx={{
                                py: { xs: 8, lg: 16 },
                                px: { xs: 4, lg: 6 },
                                maxWidth: "1280px",
                                margin: "0 auto",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box sx={{ textAlign: "center", maxWidth: "768px", mx: "auto", mb: 8 }}>
                                <Box
                                    component="h2"
                                    sx={{
                                        fontSize: "2.25rem",
                                        fontWeight: 800,
                                        letterSpacing: "-0.01em",
                                        lineHeight: 1.2,
                                        color: "#111827",
                                        mb: 2,
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                >
                                    {heading}
                                </Box>
                                <Box
                                    component="p"
                                    sx={{
                                        fontSize: "1.125rem",
                                        fontWeight: 300,
                                        color: "#6B7280",
                                        fontFamily: "Inter, sans-serif",
                                        lineHeight: 1.6,
                                        m: 0,
                                        mb: 2,
                                    }}
                                >
                                    {subheading}
                                </Box>
                                <Box
                                    component="button"
                                    onClick={handleReset}
                                    sx={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: themeSet.primary,
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        textDecoration: "underline",
                                        p: 0,
                                        "&:hover": { opacity: 0.75 },
                                    }}
                                >
                                    Choose a different state or profession
                                </Box>
                            </Box>

                            {showGroupedOffers ? (
                                <>
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "9999px",
                                            backgroundColor: themeSet.pillBackground,
                                            border: `1px solid ${themeSet.borderColor}`,
                                            boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
                                            p: 0.5,
                                            mb: hasBestValue ? "60px" : 4,
                                            mx: "auto",
                                        }}
                                    >
                                        {offerGroups.map((group, i) => {
                                            const selected = selectedGroup === group.id
                                            return (
                                                <Button
                                                    key={`${group.id}-${i}`}
                                                    onClick={() => setSelectedGroup(group.id)}
                                                    sx={{
                                                        textTransform: "none !important",
                                                        fontSize: "14px !important",
                                                        fontWeight: `${selected ? 600 : 400} !important`,
                                                        borderRadius: "9999px !important",
                                                        padding: "10px 24px !important",
                                                        minWidth: "auto !important",
                                                        backgroundColor: `${selected ? themeSet.cardBackground : "transparent"} !important`,
                                                        color: `${selected ? themeSet.primary : themeSet.text} !important`,
                                                        border: `${selected ? `1.5px solid ${themeSet.primary}` : "1px solid transparent"} !important`,
                                                        boxShadow: selected ? "0px 2px 6px rgba(0,0,0,0.05) !important" : "none !important",
                                                        fontFamily: "'Inter', sans-serif !important",
                                                        "&:hover": {
                                                            backgroundColor: `${selected ? themeSet.cardBackground : "#F3F3F3"} !important`,
                                                            color: `${themeSet.primary} !important`,
                                                        },
                                                    }}
                                                >
                                                    {group.label}
                                                </Button>
                                            )
                                        })}
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            justifyContent: "center",
                                            gap: "1rem",
                                            width: "100%",
                                            margin: "0 auto",
                                        }}
                                    >
                                        {selectedGroupOffers.length > 0 ? (
                                            selectedGroupOffers.map((offer, i) => (
                                                <Offer
                                                    key={`${offer.path}-${i}`}
                                                    offer={offer}
                                                    showImage={showImage}
                                                    offerWidth={offerWidth}
                                                    primaryColor={themeSet.primary}
                                                    freeTrialLink={freeTrialLink}
                                                    backgroundColor={themeSet.background}
                                                    pillColor={themeSet.pillBackground}
                                                    pillTextColor={themeSet.pillText}
                                                    borderColor={themeSet.borderColor}
                                                    textColor={themeSet.text}
                                                    cardBackground={themeSet.cardBackground}
                                                />
                                            ))
                                        ) : (
                                            <Typography sx={{ color: "#6B7280", py: 4 }}>
                                                No offers match your selection.
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        gap: "1rem",
                                        width: "100%",
                                        margin: "0 auto",
                                    }}
                                >
                                    {filteredOffers.length > 0 ? (
                                        filteredOffers.map((offer, i) => (
                                            <Offer
                                                key={`${offer.path}-${i}`}
                                                offer={offer}
                                                showImage={showImage}
                                                offerWidth={offerWidth}
                                                primaryColor={themeSet.primary}
                                                freeTrialLink={freeTrialLink}
                                                backgroundColor={themeSet.background}
                                                pillColor={themeSet.pillBackground}
                                                pillTextColor={themeSet.pillText}
                                                borderColor={themeSet.borderColor}
                                                textColor={themeSet.text}
                                                cardBackground={themeSet.cardBackground}
                                            />
                                        ))
                                    ) : (
                                        <Typography sx={{ color: "#6B7280", py: 4 }}>
                                            No offers match your selection.
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </section>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default OffersPropelus
