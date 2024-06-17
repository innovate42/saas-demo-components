//@flow
import * as React from "react"
import { useSubscriptions} from "@limio/sdk"
import { useLimioUserSubscriptionAddresses, useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk"
import { checkCurrentSchedule } from "../source/utils/subscriptions";
import { getPeriodForOffer, getCurrentOffer } from "../source/utils/offers"
import { useCampaign } from "@limio/sdk";
import { filterOffers } from "./helpers";
import Offer from "./components/Offer"
import "../source/style/style.css"

type Props = {
}

function switchSubscription({heading,
   subheading,
    filterSameTerm,
     showImage,
      confirmationOk,
       confirmationCancel,
        confirmHeading,
         confirmSubHeading,
          redirectUrl, 
          primaryColor__limio_color }: Props): React.Node {
  const {subscriptions} = useSubscriptions()
  const params = new URL(window.location).searchParams
  const subIdParam = params.get("subId") || ""
  const subscription = subscriptions?.find(sub => sub?.id === subIdParam)
  const schedule = subscription?.schedule
  const {addresses, revalidate} = useLimioUserSubscriptionAddresses(subIdParam)
  const { payment_methods } = useLimioUserSubscriptionPaymentMethods(subIdParam)
  const nextSchedule = checkCurrentSchedule(schedule)
const activeOffer = getCurrentOffer(subscription)
const campaign = useCampaign()
const filteredOffers = filterOffers(campaign.offers, subscription, filterSameTerm)

console.log("subscription", subscriptions)
return (
  <section className="bg-white dark:bg-gray-900 py-8" >
  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6   rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 ">
    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{heading}</h2>
      <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subheading}</p>
    </div>
    <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 ">
    {filteredOffers.length > 0 ? (
          filteredOffers.map((offer, i) => (
              <Offer key={`${offer.path}/parent-${i}`} 
              offer={offer} 
              subscription={subscription}
              showImage={showImage} 
              confirmationOk={confirmationOk} 
              confirmationCancel={confirmationCancel} 
              confirmHeading={confirmHeading}
              confirmSubHeading={confirmSubHeading}
              nextSchedule={nextSchedule}
              addresses={addresses}
              revalidate={revalidate}
              redirectUrl={redirectUrl}
              primaryColor={primaryColor__limio_color}
              />
          ))
      ) : (
          <p>No offers to display...</p>
      )}
    </div>
</div>
</section>
)
}

export default switchSubscription