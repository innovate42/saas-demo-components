import React, { useState } from "react"
import * as Sentry from "@sentry/browser"
import { Button } from "@mui/material"
import { useBasket } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { addSelectionToBasket } from "../helpers"

interface Offer {
  path: string
  data: {
    attributes: {
      cta_text__limio?: string
      [key: string]: unknown
    }
  }
}

interface AddToBasketButtonProps {
  offer: Offer
  ctaGradient?: string
  ctaGradientHover?: string
  ctaTextColor?: string
}

export const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  offer,
  ctaGradient,
  ctaGradientHover,
  ctaTextColor,
}: AddToBasketButtonProps) => {
  const { addOfferToBasket, initiateCheckout, swapOffer, navigateToCheckout, pageOptions, orderItems, basketLoading } = useBasket()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  function handleAddToBasket() {
    addSelectionToBasket({
      offer,
      orderItems,
      isSubmitting,
      setIsSubmitting,
      setHasError,
      addOfferToBasket,
      initiateCheckout,
      swapOffer,
      navigateToCheckout,
      pageOptions,
      getCurrentBasketId,
      captureException: Sentry.captureException,
    })
  }

  return (
    <>
      {hasError && <p>Something went wrong. Please try again.</p>}
      <Button
        fullWidth
        variant="contained"
        onClick={handleAddToBasket}
        // Only one basket operation can run at a time; a second one throws
        disabled={isSubmitting || basketLoading}
        sx={{
          ".offer-cards-material &": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 28px",
            fontFamily: "'Ginto', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            boxShadow: "none",
            border: "none",
            borderRadius: "8rem",
            cursor: "pointer",
            transition: "background 0.2s ease-in-out",
            textTransform: "none",
            letterSpacing: "0.01em",
            background: ctaGradient,
            color: ctaTextColor,
            "&:hover:not(:disabled)": {
              background: ctaGradientHover
            },
            "&:active:not(:disabled)": {
              background: ctaGradientHover
            },
            "&:disabled": {
              opacity: 0.6,
              cursor: "not-allowed"
            }
          }
        }}
      >
        {offer.data.attributes.cta_text__limio || "Subscribe Now"}
      </Button>
    </>
  )
}
