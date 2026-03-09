import { useState } from "react"
import { useBasket } from "@limio/sdk"
import { useComponentStaticProps } from "../componentStaticProps"
import { getDaysNoticeGiven } from "./CancellationDate"
import type { Subscription } from "@limio/types"

type OnToast = (key: string, message: string, variant?: "success" | "error" | "warning" | "info") => void

export function useButtonActions(subscription: Subscription, onToast: OnToast) {
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  const { cancelButtonLink, minimumDaysNotice, cancellationErrorMessage, showCancellationModal, updateButtonLink, editAddOnsLink } =
    useComponentStaticProps()

  const { initiateCheckout } = useBasket()

  const handleCancelClick = () => {
    if (showCancellationModal) {
      try {
        setCancelError(null)
        const noticeDays = getDaysNoticeGiven(subscription)

        if (noticeDays > minimumDaysNotice) {
          const cancelUrl = new URL(cancelButtonLink, window.location.origin)
          cancelUrl.searchParams.set("subId", String(subscription.id))
          window.location.href = cancelUrl.toString()
        } else {
          setShowNoticeModal(true)
        }
      } catch (error) {
        console.error("Cancellation check failed:", error)
        setCancelError(cancellationErrorMessage)
      }
    } else {
      const cancelUrl = new URL(cancelButtonLink, window.location.origin)
      cancelUrl.searchParams.set("subId", String(subscription.id))
      window.location.href = cancelUrl.toString()
    }
  }

  const handleCheckoutNavigation = async (destinationLink: string, errorToastKey: string, errorLogMessage: string) => {
    setIsNavigating(true)
    try {
      const basket = await initiateCheckout({
        order: {
          order_type: "update_subscription",
          forSubscription: { id: subscription.id }
        }
      })
      const checkoutId = basket?.order?.checkoutId
      if (checkoutId) {
        window.location.href = `${destinationLink}?basket=${checkoutId}`
      } else {
        console.error(errorLogMessage, "No checkoutId returned from initiateCheckout", basket)
        onToast(errorToastKey, "Something went wrong. Please try again.", "error")
      }
    } catch (error) {
      console.error(errorLogMessage, error)
      onToast(errorToastKey, "Something went wrong. Please try again.", "error")
    } finally {
      setIsNavigating(false)
    }
  }

  const handleUpdateClick = () => handleCheckoutNavigation(updateButtonLink, "updateError", "Update subscription failed:")

  const handleEditAddOnsClick = () => handleCheckoutNavigation(editAddOnsLink, "editAddOnsError", "Edit add-ons checkout failed:")

  return {
    showNoticeModal,
    setShowNoticeModal,
    cancelError,
    isNavigating,
    handleCancelClick,
    handleUpdateClick,
    handleEditAddOnsClick
  }
}
