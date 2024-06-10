//@flow
import * as React from "react";
import { useSubscriptions, useCampaign, useUser, useLimioContext} from "@limio/sdk";
import { useLimioUserSubscriptionAddresses, useLimioUserSubscriptionPaymentMethods, useOrderPreview } from "@limio/internal-checkout-sdk"
import { checkCurrentSchedule, checkPreviousSchedule } from "../source/utils/subscriptions";
import { getCurrentOffer } from "../source/utils/offers";
import { filterOffers } from "./helpers";
import * as R from "ramda"
import "../source/style/style.css"
import SubscriptionInfo from "./components/SubscriptionInfo"
import { ConfirmDialog } from "./components/ConfirmDialog";
import {  getCurrentAddress } from "../source/utils/address";
import { getCurrentPayment, processPaymentMethod } from "../source/utils/paymentMethods";
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { formatCurrency } from "../source/currency";





type Props = {
}

function cancelSaveOffer({heading, subheading__limio_richtext, discountDetails, nextPaymentDetails__limio__richtext, detailedSubheading, imageUrl, confirmOfferButtonLabel, confirmHeading, paymentMethodHeading, confirmationOk, confirmationCancel, redirectUrl, goBackHeading, goBackLink }: Props): React.Node {
  const { isInPageBuilder, mode } = useLimioContext()
  const {subscriptions} = useSubscriptions()
  console.log(subscriptions)
  const params = new URL(window.location).searchParams
  const subIdParam = params.get("subId") || ""
  const userSubscription = subscriptions?.find(sub => sub?.id === subIdParam)
  const reason = params.get("reason")
  const user = useUser()
  const campaign = useCampaign()
  const {addresses} = useLimioUserSubscriptionAddresses(subIdParam)
  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subIdParam)
 const schedule = userSubscription?.schedule ? userSubscription.schedule : []
  const nextSchedule = checkCurrentSchedule(schedule)
  const previousSchedule = checkPreviousSchedule(schedule)
  const subscriptionOffer = getCurrentOffer(userSubscription)
  const filteredOffers = filterOffers(campaign.offers, subscriptionOffer)
let  offer = filteredOffers[0]
const discount = offer?.data?.attributes.discount__limio
const { termLength: discountLength, termType: discountTerm, value: discountRate } = discount || {}
const { data: billingDetails } = getCurrentAddress("billing", addresses)
const paymentMethod = getCurrentPayment(payment_methods)
const description = R.path(["data", "attributes", "offer_features__limio"], offer)
const imageSource = R.path(["data", "attachments", 0, "url"], offer) || imageUrl

const [showDialog, setShowDialog] = React.useState(false)
const [loading, setLoading] = React.useState(false)

if (isInPageBuilder) {
  offer = campaign.offers.find(offer => offer.data?.record_subtype === "discount")
}

// Previewing order to get discount amount
const subscriptionId = userSubscription?.id || subIdParam
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
}

const { schedule: previewSchedule } = useOrderPreview(order)


const getSubscriptionData = sub => {
  let params = new URL(window.location).searchParams
  const changeDate = params.get("changeDate")
  const subscriptionData = R.path(["data"], sub) || {}
  if (changeDate) {
    return R.assocPath(["termEndDate"], decodeURI(changeDate), subscriptionData)
  }

  const discountPeriod = `${discountLength} ${discountLength > 1 ? discountTerm : discountTerm?.slice(0, -1)}` // remove the "s" at the end of the discount term if length is 1
  const currentPrice = formatCurrency(nextSchedule?.data?.amount, nextSchedule?.data?.currency)
  const nextPriceWithDiscount = ` ${formatCurrency(previewSchedule?.[0]?.amount, previewSchedule?.[0]?.currency)}`
  confirmOfferButtonLabel

  const discountData = {
    discountRate: discountRate ? `${discountRate}%` : "The offer has no discount on it.", //just to ensure that if the offer has no discount it doesn't just show undefined
    discountPeriod: !discountPeriod.includes("undefined") ? discountPeriod : "The offer has no discount on it.", //just to ensure that if the offer has no discount it doesn't just show undefined
    currentPrice: currentPrice ? currentPrice : "",
    nextPriceWithDiscount: nextPriceWithDiscount ? nextPriceWithDiscount : "The offer has no discount on it."
  }

  return {
    ...subscriptionData,
    ...discountData
  }
}

const subscriptionOfferData = getSubscriptionData(userSubscription)

const handleSubmit = async newOffer => {
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
  }

  return sendOrder(order)
}



  return(
    <section className="bg-white dark:bg-gray-900 flex h-full items-center justify-center" >
  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
  <div className="flex justify-end mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#9cafa3" className="h-6 w-6" onClick={() => (window.location.href = goBackLink)}>
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
        </svg>
      </div>
    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{heading}</h2>
      <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subheading__limio_richtext}</p>
    </div>
    
    {showDialog && 
    <ConfirmDialog
    confirmHeading={confirmHeading}
    offer={offer}
    previewSchedule={previewSchedule}
    nextSchedule={nextSchedule}
    paymentMethodHeading={paymentMethodHeading}
   paymentMethod={paymentMethod}
   loading={loading}
   setLoading={setLoading}
   setShowDialog={setShowDialog}
   confirmationOk={confirmationOk}
   confirmationCancel={confirmationCancel}
   onConfirm={() => handleSubmit(offer)}
   redirectUrl={redirectUrl}
   userSubscription={userSubscription}

    />}
    
    <SubscriptionInfo
        subscriptionOfferData={subscriptionOfferData}
        nextSchedule={nextSchedule}
        previewSchedule={previewSchedule}
        discount={discount}
        description={description}
        discountDetails={discountDetails}
        nextPaymentDetails__limio__richtext={nextPaymentDetails__limio__richtext}
        detailedSubheading={detailedSubheading}
        imageSource={imageSource}
        confirmOfferButtonLabel={confirmOfferButtonLabel}
       setShowDialog={setShowDialog}
      
    />

</div>
</section>
  )
}

export default cancelSaveOffer