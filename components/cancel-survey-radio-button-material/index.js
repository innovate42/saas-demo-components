import React, { useState } from "react"
import { sanitiseHTML, useBasket } from "@limio/sdk"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles"
import { CssBaseline, Box, Typography, Button, Radio, FormControlLabel, RadioGroup, TextField, Divider } from "@mui/material"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/800.css"

const themeStyles = {
    orange: {
        primary: "#E16A00",
        radioChecked: "#E16A00",
        buttonBg: "#E16A00",
        buttonHover: "#C45E00",
    },
    blue: {
        primary: "#005C99",
        radioChecked: "#005C99",
        buttonBg: "#005C99",
        buttonHover: "#004A80",
    },
    green: {
        primary: "#2E7D32",
        radioChecked: "#2E7D32",
        buttonBg: "#2E7D32",
        buttonHover: "#1B5E20",
    },
    red: {
        primary: "#C62828",
        radioChecked: "#C62828",
        buttonBg: "#C62828",
        buttonHover: "#8B0000",
    },
    black: {
        primary: "#333333",
        radioChecked: "#333333",
        buttonBg: "#333333",
        buttonHover: "#111111",
    },
}

const muiTheme = createTheme({
    typography: {
        fontFamily: `'Inter', 'system-ui', 'Helvetica Neue', Arial, sans-serif`,
    },
})

const CancelSurveyRadioButtonMaterial = ({
    title,
    subtitle,
    reasonsHeading,
    reasons,
    otherReasonLabel,
    otherReasonValue,
    otherReasonUrl,
    showOtherReason,
    captureOtherReasonText,
    otherReasonCaptureTextLabel,
    showImage,
    imageUrl,
    cancelButtonText,
    keepSubscriptionButtonText,
    keepSubscriptionUrl,
    themeColor = "orange",
}) => {
    const { initiateCheckout } = useBasket()
    const [selectedReason, setSelectedReason] = useState(null)
    const [otherReasonText, setOtherReasonText] = useState("")

    const ts = themeStyles[themeColor] || themeStyles.orange

    const otherReason = {
        label: otherReasonLabel,
        value: otherReasonValue,
        url: otherReasonUrl,
    }

    const allReasons = showOtherReason ? [...(reasons || []), otherReason] : (reasons || [])

    const onCancel = async () => {
        const subId = new URLSearchParams(window.location.search).get("subId")
        const url = new URL(selectedReason.url, window.location.origin)
        url.searchParams.set("subId", subId)
        url.searchParams.set("reason", selectedReason.value)

        if (selectedReason?.createBasket__limio_boolean) {
            const basket = await initiateCheckout({
                order: {
                    order_type: "update_subscription",
                    forSubscription: { id: subId },
                },
            })
            url.searchParams.set("basket", basket.order.checkoutId)
        }

        window.location.assign(url.toString())
    }

    const onKeepSubscription = () => {
        window.location.assign(keepSubscriptionUrl)
    }

    const radioSx = {
        color: "#D1D5DB",
        "&.Mui-checked": { color: ts.radioChecked },
        padding: "6px 9px",
    }

    const labelTypographySx = {
        fontSize: "0.9375rem",
        fontWeight: 400,
        color: "#374151",
        fontFamily: "Inter, sans-serif",
        lineHeight: 1.5,
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <Box
                    sx={{
                        py: { xs: 6, md: 10 },
                        px: { xs: 3, md: 6 },
                        maxWidth: "900px",
                        margin: "0 auto",
                        fontFamily: "Inter, sans-serif",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                    }}
                >
                    {/* Two-column layout */}
                    <Box sx={{ display: "flex", gap: 4, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                        {/* Left: form content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* h1 */}
                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: "2.25rem",
                                    fontWeight: 800,
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.2,
                                    color: "#111827",
                                    fontFamily: "Inter, sans-serif",
                                    mb: 2,
                                    textAlign: "left",
                                }}
                            >
                                {title}
                            </Typography>

                            {/* Subtitle */}
                            <Typography
                                component="p"
                                sx={{
                                    fontSize: "1.125rem",
                                    fontWeight: 300,
                                    color: "#6B7280",
                                    lineHeight: 1.6,
                                    fontFamily: "Inter, sans-serif",
                                    mb: 4,
                                    textAlign: "left",
                                }}
                                dangerouslySetInnerHTML={{ __html: sanitiseHTML(subtitle) }}
                            />

                            {/* h2 — reasons heading */}
                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: "1.125rem",
                                    fontWeight: 600,
                                    color: "#111827",
                                    fontFamily: "Inter, sans-serif",
                                    mb: 2,
                                    textAlign: "left",
                                }}
                                dangerouslySetInnerHTML={{ __html: sanitiseHTML(reasonsHeading) }}
                            />

                            {/* Radio group */}
                            <RadioGroup
                                value={selectedReason?.value || ""}
                                onChange={(e) => {
                                    const found = allReasons.find((r) => r.value === e.target.value)
                                    setSelectedReason(found || null)
                                }}
                            >
                                {allReasons.map((r) => (
                                    <FormControlLabel
                                        key={r.value}
                                        value={r.value}
                                        control={<Radio sx={radioSx} />}
                                        label={
                                            <Typography sx={labelTypographySx}>{r.label}</Typography>
                                        }
                                        sx={{ mb: 0.25, alignItems: "center" }}
                                    />
                                ))}
                            </RadioGroup>

                            {/* Other reason text capture */}
                            {captureOtherReasonText &&
                                selectedReason?.value === otherReason.value && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            component="label"
                                            htmlFor="other-reason-text"
                                            sx={{
                                                display: "block",
                                                fontSize: "0.9375rem",
                                                fontWeight: 500,
                                                color: "#111827",
                                                fontFamily: "Inter, sans-serif",
                                                mb: 1,
                                            }}
                                        >
                                            {otherReasonCaptureTextLabel}
                                        </Typography>
                                        <TextField
                                            id="other-reason-text"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            value={otherReasonText}
                                            onChange={(e) => setOtherReasonText(e.target.value)}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    fontSize: "0.9375rem",
                                                    fontFamily: "Inter, sans-serif",
                                                    borderRadius: "8px",
                                                    "& fieldset": { borderColor: "#D1D5DB" },
                                                    "&:hover fieldset": { borderColor: "#9CA3AF" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: ts.primary,
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                        </Box>

                        {/* Right: image */}
                        {showImage && imageUrl && (
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    display: { xs: "none", sm: "flex" },
                                    alignItems: "flex-start",
                                    pt: 1,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={imageUrl}
                                    role="presentation"
                                    sx={{
                                        maxWidth: "320px",
                                        width: "100%",
                                        borderRadius: "12px",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ my: 4, borderColor: "#E5E7EB" }} />

                    {/* Action buttons */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {/* Keep subscription — primary action */}
                        <Button
                            onClick={onKeepSubscription}
                            variant="contained"
                            sx={{
                                backgroundColor: `${ts.buttonBg} !important`,
                                color: "#FFFFFF !important",
                                fontWeight: "600 !important",
                                fontSize: "0.9375rem !important",
                                fontFamily: "'Inter', sans-serif !important",
                                textTransform: "none !important",
                                borderRadius: "8px !important",
                                px: "24px !important",
                                py: "10px !important",
                                boxShadow: "none !important",
                                letterSpacing: "0 !important",
                                "&:hover": {
                                    backgroundColor: `${ts.buttonHover} !important`,
                                    boxShadow: "none !important",
                                },
                            }}
                        >
                            {keepSubscriptionButtonText}
                        </Button>

                        {/* Cancel — secondary / destructive */}
                        <Button
                            onClick={onCancel}
                            disabled={selectedReason == null}
                            variant="outlined"
                            sx={{
                                backgroundColor: "#FFFFFF !important",
                                border: "1px solid #D1D5DB !important",
                                color: "#374151 !important",
                                fontWeight: "500 !important",
                                fontSize: "0.9375rem !important",
                                fontFamily: "'Inter', sans-serif !important",
                                textTransform: "none !important",
                                borderRadius: "8px !important",
                                px: "24px !important",
                                py: "10px !important",
                                boxShadow: "none !important",
                                letterSpacing: "0 !important",
                                "&:hover": {
                                    backgroundColor: "#F9FAFB !important",
                                    borderColor: "#9CA3AF !important",
                                },
                                "&.Mui-disabled": {
                                    backgroundColor: "#F3F4F6 !important",
                                    color: "#9CA3AF !important",
                                    borderColor: "#E5E7EB !important",
                                },
                            }}
                        >
                            {cancelButtonText}
                        </Button>
                    </Box>
                </Box>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default CancelSurveyRadioButtonMaterial
