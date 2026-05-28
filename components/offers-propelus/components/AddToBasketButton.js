import React from "react"
import { Button } from "@mui/material"
import { useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"

export const AddToBasketButton = ({ offer, primaryColor }) => {
    const { addOfferToBasket, initiateCheckout, navigateToCheckout, pageOptions } = useBasket()

    async function addSelectionToBasket() {
        try {
            const checkoutId = getCurrentBasketId()
            if (!checkoutId) {
                await initiateCheckout({ order: { orderItems: [{ offer }] } })
            } else {
                await addOfferToBasket({ offer })
            }
        } catch (e) {
            // addOfferToBasket failed — basket is likely completed/closed.
            // Start a fresh checkout instead.
            await initiateCheckout({ order: { orderItems: [{ offer }] } })
        }
        if (pageOptions?.pushToCheckout) {
            await navigateToCheckout()
        }
    }

    return (
        <Button
            fullWidth
            variant="contained"
            onClick={addSelectionToBasket}
            sx={{
                backgroundColor: `${primaryColor || "#005C99"} !important`,
                color: "#fff !important",
                fontWeight: "500 !important",
                fontSize: "14px !important",
                fontFamily: "Inter, sans-serif !important",
                textTransform: "none !important",
                padding: "6px 16px !important",
                lineHeight: "1.75 !important",
                borderRadius: "4px !important",
                minWidth: "64px !important",
                boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12) !important",
                transition: "background-color 250ms, box-shadow 250ms !important",
                "&:hover": {
                    backgroundColor: `${primaryColor || "#004A80"} !important`,
                    filter: "brightness(0.9)",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important",
                },
                "&:disabled": {
                    backgroundColor: "#f0f0f0 !important",
                    color: "#c0c0c0 !important",
                    boxShadow: "none !important",
                },
            }}
        >
            {offer.data.attributes.cta_text__limio || "Subscribe Now"}
        </Button>
    )
}
