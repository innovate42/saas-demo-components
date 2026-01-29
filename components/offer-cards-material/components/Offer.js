// @flow
import React from "react";
import { sanitizeString } from "../../source/utils/string";
import { AddToBasketButton } from "./AddToBasketButton";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const Offer = ({
                   offer,
                   showImage,
                   offerWidth,
                   primaryColor,
                   freeTrialLink,
                   backgroundColor,
                   pillColor,
                   pillTextColor,
                   borderColor,
                   textColor,
                   cardBackground
               }) => {
    const attachments =
        offer.data.attachments?.filter((x) => x.type.includes("image")) || [];
    const hasAttachments = attachments.length > 0;

    const {
        display_name__limio,
        display_price__limio,
        detailed_display_price__limio,
        offer_features__limio,
        best_value__limio,
        display_description__limio,
    } = offer.data.attributes;

    const bestValueText = display_description__limio || "Most popular";

    console.log(offer.data.attributes);

    return (
        <Card
            sx={{
                position: "relative",
                backgroundColor: best_value__limio ? backgroundColor : cardBackground,
                borderRadius: "12px",
                px: 3,
                pt: 7,
                pb: 4,
                mx: 1.5,
                my: 2,
                minWidth: `${offerWidth * 10}em`,
                maxWidth: `${offerWidth * 10}em`,
                border: best_value__limio
                    ? `1.5px solid ${borderColor} !important`
                    : "1px solid #EFEAE3 !important",
                boxShadow: best_value__limio
                    ? "0px 4px 12px rgba(0, 0, 0, 0.08)"
                    : "0px 2px 6px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontFamily: `"Inter", system-ui, sans-serif`,
            }}
        >
            {best_value__limio && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: pillColor,
                        color: pillTextColor,
                        fontSize: "12px",
                        fontWeight: 600,
                        px: 2.5,
                        py: 0.5,
                        borderRadius: "999px",
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: 0.5,
                        textTransform: "none",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {bestValueText}
                </Box>
            )}

            <CardContent sx={{ p: 0 }}>
                <Typography
                    align="center"
                    sx={{
                        fontWeight: 600,
                        fontSize: "17px",
                        color: textColor,
                        mb: 1,
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    {display_name__limio}
                </Typography>

                <Box textAlign="center" mb={1.5}>
                    <Typography
                        component="div"
                        sx={{
                            fontWeight: 700,
                            fontSize: "26px",
                            lineHeight: 1.2,
                            color: textColor,
                            fontFamily: "Inter, sans-serif",
                            mb: 1,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: sanitizeString(display_price__limio),
                        }}
                    />
                    {detailed_display_price__limio && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#A3A3A3",
                                fontSize: "13px",
                                fontWeight: 400,
                                fontFamily: "Inter, sans-serif",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeString(detailed_display_price__limio),
                            }}
                        />
                    )}
                </Box>

                {showImage && hasAttachments && (
                    <Box display="flex" justifyContent="center" my={2}>
                        <Box
                            component="img"
                            src={attachments[0].url}
                            alt="Offer"
                            sx={{ maxWidth: "60%", objectFit: "contain", borderRadius: 2 }}
                        />
                    </Box>
                )}

                <Box mt={4} display="flex" flexDirection="column" gap={1}>
                    <AddToBasketButton
                        offer={offer}
                        primaryColor={primaryColor}
                    />

                </Box>

                {freeTrialLink && (
                    <Typography
                        variant="caption"
                        align="center"
                        display="block"
                        sx={{
                            color: "#999",
                            fontSize: "12px",
                            mt: 2,
                            fontFamily: "Inter, sans-serif",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: sanitizeString(freeTrialLink),
                        }}
                    />
                )}
                <Typography
                    variant="caption"
                    display="block"
                    sx={{
                        color: "#1F1F1F",
                        fontSize: "14px",
                        mt: 2,
                        fontFamily: "Inter, sans-serif",
                    }}
                    dangerouslySetInnerHTML={{
                        __html: sanitizeString(offer_features__limio),
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default Offer;
