import React, { useState } from "react"
import { useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"

const AddToBasketButton = ({
    offer,
    themeStyles,
    isPopular = false
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } = useBasket()

    const ctaText = offer?.data?.attributes?.cta_text__limio || "Get started"

    async function addSelectionToBasket() {
        setIsLoading(true)
        try {
            const checkoutId = getCurrentBasketId()

            if (!checkoutId) {
                await initiateCheckout({
                    order: {
                        orderItems: [{ offer }]
                    }
                })
            } else {
                await addOfferToBasket({ offer })
            }

            if (pageOptions.pushToCheckout) {
                await navigateToCheckout()
            }
        } catch (error) {
            console.error("Error adding to basket:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant={isPopular ? "contained" : "outlined"}
            fullWidth
            onClick={addSelectionToBasket}
            disabled={isLoading}
            sx={{
                py: 1.5,
                px: 3,
                borderRadius: "10px !important",
                textTransform: "none !important",
                fontWeight: "600 !important",
                fontSize: "15px !important",
                fontFamily: "'Inter', sans-serif !important",
                letterSpacing: "-0.01em !important",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important",
                boxShadow: isPopular
                    ? `0 4px 14px 0 ${themeStyles.primary}40 !important`
                    : "none !important",
                backgroundColor: isPopular
                    ? `${themeStyles.primary} !important`
                    : "transparent !important",
                color: isPopular
                    ? "#ffffff !important"
                    : `${themeStyles.primary} !important`,
                borderColor: isPopular
                    ? "transparent !important"
                    : `${themeStyles.primary}50 !important`,
                borderWidth: "1.5px !important",
                "&:hover": {
                    transform: "translateY(-1px) !important",
                    boxShadow: isPopular
                        ? `0 6px 20px 0 ${themeStyles.primary}50 !important`
                        : `0 4px 12px 0 ${themeStyles.primary}20 !important`,
                    backgroundColor: isPopular
                        ? `${themeStyles.primaryHover} !important`
                        : `${themeStyles.primary}08 !important`,
                    borderColor: isPopular
                        ? "transparent !important"
                        : `${themeStyles.primary} !important`,
                },
                "&:disabled": {
                    opacity: "0.7 !important",
                    transform: "none !important",
                }
            }}
        >
            {isLoading ? (
                <CircularProgress
                    size={20}
                    sx={{
                        color: isPopular ? "#ffffff" : themeStyles.primary
                    }}
                />
            ) : (
                ctaText
            )}
        </Button>
    )
}

export default AddToBasketButton
