import * as React from "react"
import { useState, Suspense } from "react"
import { useLimioContext, useCampaign, ErrorBoundary } from "@limio/sdk"
import * as R from "ramda"
import { checkCurrentSchedule, checkPreviousSchedule, getCurrentOffer, getSubscriptionWithDiscountData } from "@limio/shop/src/shop/helpers/checks"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.ts"
import { Button, LoadingSpinner, LoadingSkeleton } from "@limio/design-system"
import ConfirmDialog from "./components/ConfirmDialog"
import SubscriptionFeatures from "./components/SubscriptionFeatures.tsx"
import AdditionalButtons from "./components/AdditionalButtons.js"
import { filterOffers } from "./helpers"
import { parseString, encodeDates } from "@limio/shop/src/helpers/string.ts"
import { getCurrentAddress } from "@limio/shop/src/shop/address/helpers"
import { getCurrentPayment } from "@limio/shop/src/shop/payment_method/helpers"
import { useComponentStaticProps } from "./componentStaticProps"
import {
  useLimioUserSubscription,
  useLimioUser,
  useLimioUserSubscriptionAddresses,
  useLimioUserSubscriptionPaymentMethods,
  useOrderPreview
} from "@limio/internal-checkout-sdk"
import { sanitiseHTML } from "@limio/sdk"
import type { Offer, LimioObject, Schedule } from "@limio/types"

import "./index.css"

export function LoadOffer() {
  // gets the offer
  const params = new URL(window.location).searchParams
  const subIdParam = params.get("subId") || ""
  const reason = params.get("reason")
  const { isInPageBuilder } = useLimioContext()

  const pageCampaign = useCampaign()

  const { user } = useLimioUser()

  const {
    imageUrl,
    redirectUrl,
    processChangeSub,
    redirectToConfirmationUrl,
    heading,
    subheading__limio_richtext,
    offerLineText,
    confirmOfferButtonLabel,
    imagePosition,
    componentId
  } = useComponentStaticProps()

  const { userSubscription } = useLimioUserSubscription(subIdParam)

  const { addresses } = useLimioUserSubscriptionAddresses(subIdParam)

  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subIdParam)

  const { data: billingDetails } = getCurrentAddress("billing", addresses)
  const paymentMethod = getCurrentPayment(payment_methods)

  const { schedule, mode } = userSubscription

  const nextSchedule: LimioObject<Schedule> | null | undefined = checkCurrentSchedule(schedule)
  const prevSchedule: LimioObject<Schedule> | null | undefined = checkPreviousSchedule(schedule)

  const subscriptionOffer = getCurrentOffer(userSubscription)
  const filteredOffers = filterOffers(pageCampaign.offers, subscriptionOffer)
  let offer = filteredOffers[0] //chooses the first offer available if multiple are present.

  const description = R.path(["data", "attributes", "offer_features__limio"], offer)
  const imageSource = R.path(["attachments", 0, "url"], offer) || imageUrl

  // When in pagebuilder, always take the offer attached to the cancel save campaign to avoid pagebuilder rendering errors when the discount offer term doesn't match the mock data
  if (isInPageBuilder) {
    offer = pageCampaign.offers.find((offer) => offer.data?.record_subtype === "discount")
  }
  const discount = offer.data.attributes.discount__limio

  // Previewing order to get discount amount
  const subscriptionId = userSubscription.id || subIdParam
  const order_type = "add_offer"
  const effectiveDate = nextSchedule?.data?.schedule_date
  const order = {
    order_type,
    mode,
    change_type: reason ? "cancel_save" : order_type,
    subscriptionId: subscriptionId,
    external_id: subscriptionId,
    offer,
    billingDetails,
    data: {
      reason: {
        id: reason
      }
    },
    effectiveDate,
    userDetails: user?.attributes,
    quantity: 1,
    source: "shop",
    __spec_version: "2",
    process_immediately: true
  } as const

  const { schedule: previewSchedule } = useOrderPreview(order)

  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const subscriptionOfferData = getSubscriptionWithDiscountData(userSubscription, nextSchedule, previewSchedule, discount, params)

  const handleSubmit = async (newOffer: Partial<Offer>) => {
    const params = new URL(window.location).searchParams
    const reason = params.get("reason")
    const order_type = "add_offer"
    const effectiveDate = nextSchedule.data.schedule_date

    const order = {
      order_type,
      change_type: reason ? "cancel_save" : order_type,
      subscriptionId,
      external_id: subscriptionId,
      offer: newOffer,
      data: {
        reason: {
          id: reason
        }
      },
      effectiveDate,
      userDetails: user?.attributes,
      quantity: 1
    } as const

    return sendOrder(order)
  }

  const confirm = async () => {
    setLoading(true)
    await handleSubmit(offer)
    setLoading(false)
    document.cookie = `limio-cookie=; max-age=0` // this cookie can be removed now
    window.location.href = `${redirectUrl}?subId=${subIdParam}`
  }

  // processChangeSub is controlled by a picklist - onPageWithModal means the subscription change will happen on this page else.
  const confirmSubscriptionChange = async () => {
    if (processChangeSub === "onPageWithModal") {
      setShowConfirm(true)
    }
    if (processChangeSub === "onPageNoModal") {
      await confirm()
    }
    if (processChangeSub === "redirect") {
      window.location.href = `${redirectToConfirmationUrl}?subId=${subIdParam}`
    }
  }

  return (
    <div className="cancel-save-offer-container" id={componentId}>
      <div className="cancel-save-offer-headers-container">
        <div className="header-subheader-wrapper">
          {heading && <div className="cancel-save-offer-heading">{heading}</div>}
          {subheading__limio_richtext && (
            <div
              className="cancel-save-offer-subheading"
              data-limio-prop="subheading__limio_richtext"
              dangerouslySetInnerHTML={{
                __html: sanitiseHTML(parseString(subheading__limio_richtext, subscriptionOfferData, encodeDates))
              }}
            />
          )}
        </div>
      </div>
      {showConfirm && processChangeSub === "onPageWithModal" && (
        <ConfirmDialog
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => handleSubmit(offer)}
          nextSchedule={nextSchedule}
          offer={offer}
          subscription={userSubscription}
          prevSchedule={prevSchedule}
          previewSchedule={previewSchedule}
          paymentMethod={paymentMethod}
        />
      )}
      <div className={"cancel-save-offer-body-container"}>
        {offerLineText && <div className={"cancel-save-offer-offerLine"}>{offerLineText}</div>}
        <div className={`image-features-container ${imagePosition}`}>
          {imageSource && (
            <div className={"image-container"}>
              <img className="image" src={imageSource} />
            </div>
          )}
          <SubscriptionFeatures
            subscriptionOfferData={subscriptionOfferData}
            nextSchedule={nextSchedule}
            previewSchedule={previewSchedule}
            discount={discount}
            description={description}
          />
        </div>
        <div className={"confirm-offer"}>
          {loading ? (
            <div className="cancel-save-offer-container">
              <div className="cancel-save-offer-body-container">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <>
              <Button className={"confirm-offer-button"} onClick={confirmSubscriptionChange}>
                {confirmOfferButtonLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function CancelSaveOffer() {
  const { showAdditionalButtons } = useComponentStaticProps()

  return (
    <ErrorBoundary
      fallback={
        <div className="cancel-save-fetch-error">
          <h2>Could not fetch Subscription.</h2>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className={"cancel-save-offer-container"}>
            <div className={"cancel-save-offer-headers-container"}>
              <LoadingSkeleton width="50%" height="100px" />
            </div>
            <div className={"cancel-save-offer-body-container"}>
              <LoadingSkeleton width="auto" height="215px" />
            </div>
          </div>
        }
      >
        <LoadOffer />
        {showAdditionalButtons ? <AdditionalButtons /> : null}
      </Suspense>
    </ErrorBoundary>
  )
}

export default CancelSaveOffer
