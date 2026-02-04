import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import { filterWhitelistedHTML } from "xss"
import AddToBasketButton from "./AddToBasketButton"

const sanitizeString = (str) => filterWhitelistedHTML(str)

const CheckIcon = ({ color }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
    >
        <path
            d="M16.667 5L7.5 14.167 3.333 10"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const Offer = ({
    offer,
    themeStyles,
    showImage,
    showFeatureComparison,
    isPopular,
    backgroundStyle
}) => {
    const attributes = offer?.data?.attributes || {}
    const attachments = offer?.data?.attachments || []

    const displayName = attributes.display_name__limio || "Plan"
    const displayPrice = attributes.display_price__limio || ""
    const detailedPrice = attributes.detailed_display_price__limio || ""
    const features = attributes.offer_features__limio || ""
    const description = attributes.display_description__limio || ""
    const badgeText = attributes.badge_text__limio || "Most popular"

    const image = attachments.find((attachment) => attachment.type === "image")

    const isDark = backgroundStyle === "dark"

    const featuresList = features
        .split(/<li[^>]*>|<\/li>/gi)
        .filter((item) => item.trim() && !item.includes("<ul") && !item.includes("</ul"))
        .map((item) => item.replace(/<[^>]*>/g, "").trim())
        .filter((item) => item.length > 0)

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: "360px",
                borderRadius: "16px !important",
                backgroundColor: isDark
                    ? isPopular
                        ? "rgba(255, 255, 255, 0.08) !important"
                        : "rgba(255, 255, 255, 0.04) !important"
                    : isPopular
                        ? "#ffffff !important"
                        : "rgba(255, 255, 255, 0.7) !important",
                backdropFilter: isDark ? "blur(20px) !important" : "blur(10px) !important",
                border: isPopular
                    ? `2px solid ${themeStyles.primary} !important`
                    : isDark
                        ? "1px solid rgba(255, 255, 255, 0.1) !important"
                        : "1px solid rgba(0, 0, 0, 0.06) !important",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
                overflow: "visible !important",
                "&:hover": {
                    transform: "translateY(-4px) !important",
                    boxShadow: isPopular
                        ? `0 25px 50px -12px ${themeStyles.primary}30 !important`
                        : isDark
                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5) !important"
                            : "0 25px 50px -12px rgba(0, 0, 0, 0.15) !important",
                },
            }}
        >
            {/* Popular Badge */}
            {isPopular && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: `${themeStyles.primary} !important`,
                        color: "#ffffff !important",
                        px: 2.5,
                        py: 0.5,
                        borderRadius: "20px !important",
                        fontSize: "12px !important",
                        fontWeight: "600 !important",
                        fontFamily: "'Inter', sans-serif !important",
                        letterSpacing: "0.02em !important",
                        textTransform: "uppercase !important",
                        boxShadow: `0 4px 14px 0 ${themeStyles.primary}40 !important`,
                        whiteSpace: "nowrap",
                    }}
                >
                    {badgeText}
                </Box>
            )}

            <Box sx={{ p: 4 }}>
                {/* Plan Name */}
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Inter', sans-serif !important",
                        fontWeight: "600 !important",
                        fontSize: "18px !important",
                        color: isDark ? "#ffffff !important" : `${themeStyles.text} !important`,
                        mb: 1,
                        letterSpacing: "-0.01em !important",
                    }}
                >
                    {displayName}
                </Typography>

                {/* Description */}
                {description && (
                    <Typography
                        sx={{
                            fontFamily: "'Inter', sans-serif !important",
                            fontSize: "14px !important",
                            color: isDark
                                ? "rgba(255, 255, 255, 0.6) !important"
                                : `${themeStyles.textSecondary} !important`,
                            mb: 3,
                            lineHeight: "1.5 !important",
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                    <Typography
                        component="div"
                        sx={{
                            fontFamily: "'Inter', sans-serif !important",
                            fontWeight: "700 !important",
                            fontSize: "48px !important",
                            color: isDark ? "#ffffff !important" : `${themeStyles.text} !important`,
                            lineHeight: "1 !important",
                            letterSpacing: "-0.03em !important",
                            "& span": {
                                fontSize: "48px !important",
                                fontWeight: "700 !important",
                            },
                            "& .currency": {
                                fontSize: "28px !important",
                                fontWeight: "600 !important",
                                verticalAlign: "top",
                                position: "relative",
                                top: "8px",
                            },
                            "& .period": {
                                fontSize: "16px !important",
                                fontWeight: "400 !important",
                                color: isDark
                                    ? "rgba(255, 255, 255, 0.5)"
                                    : themeStyles.textSecondary,
                            },
                        }}
                        dangerouslySetInnerHTML={{
                            __html: sanitizeString(displayPrice),
                        }}
                    />
                    {detailedPrice && (
                        <Typography
                            sx={{
                                fontFamily: "'Inter', sans-serif !important",
                                fontSize: "13px !important",
                                color: isDark
                                    ? "rgba(255, 255, 255, 0.5) !important"
                                    : `${themeStyles.textSecondary} !important`,
                                mt: 1,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeString(detailedPrice),
                            }}
                        />
                    )}
                </Box>

                {/* CTA Button */}
                <AddToBasketButton
                    offer={offer}
                    themeStyles={themeStyles}
                    isPopular={isPopular}
                />

                {/* Features List */}
                {showFeatureComparison && featuresList.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography
                            sx={{
                                fontFamily: "'Inter', sans-serif !important",
                                fontSize: "13px !important",
                                fontWeight: "600 !important",
                                color: isDark
                                    ? "rgba(255, 255, 255, 0.4) !important"
                                    : `${themeStyles.textSecondary} !important`,
                                textTransform: "uppercase !important",
                                letterSpacing: "0.05em !important",
                                mb: 2,
                            }}
                        >
                            What's included
                        </Typography>
                        <Box
                            component="ul"
                            sx={{
                                listStyle: "none !important",
                                padding: "0 !important",
                                margin: "0 !important",
                            }}
                        >
                            {featuresList.map((feature, index) => (
                                <Box
                                    component="li"
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 1.5,
                                        py: 1,
                                    }}
                                >
                                    <CheckIcon
                                        color={
                                            isPopular
                                                ? themeStyles.primary
                                                : isDark
                                                    ? "rgba(255, 255, 255, 0.5)"
                                                    : themeStyles.textSecondary
                                        }
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: "'Inter', sans-serif !important",
                                            fontSize: "14px !important",
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.8) !important"
                                                : `${themeStyles.text} !important`,
                                            lineHeight: "1.5 !important",
                                        }}
                                    >
                                        {feature}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Image */}
                {showImage && image && (
                    <Box
                        sx={{
                            mt: 3,
                            borderRadius: "8px",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={image.url}
                            alt={displayName}
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Card>
    )
}

export default Offer