//@flow
import React, { useEffect, useMemo, useState } from "react";
import { useSubscriptions} from "@limio/sdk"
import { useLimioUserSubscriptionAddresses, useLimioUserSubscriptionPaymentMethods } from "@limio/internal-checkout-sdk"
import { checkCurrentSchedule } from "../source/utils/subscriptions";
import { getPeriodForOffer, getCurrentOffer } from "../source/utils/offers"
import { useCampaign } from "@limio/sdk";
import { filterOffers } from "./helpers";
import Offer from "./components/Offer"
import "../source/style/style.css"
import * as R from "ramda";
import "./index.css"

function groupOffers(
  offers,
  groupLabels
) {

  // Take current offers and split them array groups
  const groups = R.groupBy(
      R.path(["data", "attributes", "group__limio"]),
      offers
  );

  // The order of the groups object is not guaranteed, so we need to sort it to be the same order as the groupLabels
  const groupLabelArray = groupLabels.map((group) => group.id)
  function reorderKeys(obj, order) {
    const newObj = {};
    order.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

// Reorder the object keys
const sortedGroup = reorderKeys(groups, groupLabelArray);



  const groupedOffers = Object.keys(sortedGroup).map((groupId) => {

    // return just the groups that are defined on offer and component
      const group = groupLabels.find((group) => group.id === groupId) 
     
      if(group){
      const { label, thumbnail } = group;
      // return the group with the offers
      return {
          groupId,
          id: groupId,
          label: label,
          offers: groups[groupId],
          thumbnail: thumbnail,
      };
    }
  });

  return groupedOffers;
}

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
              primaryColor__limio_color,
              offerWidth,
              groupLabels,
               showGroupedOffers,
               best_value_color__limio_color
         })  {
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

const offerGroups = useMemo(() => {
  return groupOffers(filteredOffers, groupLabels).filter(group => group !== undefined);
}, [filterOffers, groupLabels])

const [selectedGroup, setSelectedGroup] = useState()
const selectedGroupItem = offerGroups.find(offerGroup => offerGroup.id === selectedGroup)
const selectedGroupOffers = selectedGroupItem?.offers || []
const hasBestValue = selectedGroupOffers.some(offer => offer.data.attributes.best_value__limio)
const hasGroupedOffers = offerGroups.length > 0



const styleBestValue = () => {
  if (hasBestValue) {
      return `60px`
  } else { 
    return `40px`
  
  }
}

useEffect(() => {
  if(!selectedGroup){
    setSelectedGroup(offerGroups[0]?.id)
  } 
}, [offerGroups, selectedGroup])





return (
  <section className="bg-white dark:bg-gray-900 py-8" >
  <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6   rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 flex flex-col ">
    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{heading}</h2>
      <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subheading}</p>
    </div>
   
    {showGroupedOffers ?
          <>
          <div className={`flex p-2 mx-auto  text-center text-gray-900 bg-gray-100 rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-4 dark:bg-gray-800 dark:text-white ${!hasBestValue ? "mb-8" : ""}`}
          style={{minWidth: "320px",  marginBottom: styleBestValue()}}
          >
              {offerGroups.map((offerGroup, i) => (
                  <button onClick={() => setSelectedGroup(offerGroup.id)}   key={`${offerGroup.id}-${i}`} className={`whitespace-nowrap py-2.5 px-1.5 sm:px-3.5 mx-auto   dark:bg-gray-600 hover:bg-gray-500 dark:text-white hover:text-white rounded-md text-xs sm:text-lg ${selectedGroup === offerGroup.id ? "dark:bg-gray-400  dark:text-white bg-white" : ""}`}
                  >
                      {offerGroup.label}
                  </button>
              ))}
          </div>
          <div className=" flex justify-center flex-wrap ">
          {selectedGroupOffers.length > 0 ? (
                selectedGroupOffers.map((offer, i) => (
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
                    offerWidth={offerWidth}
                    bestValueColor={best_value_color__limio_color}
                    />
                ))
            ) : (
                <p>No offers to display...Please an a label to view offers</p>
            )}
          </div>
          </>
          :
          <>
          <div className=" flex justify-center flex-wrap ">
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
                    offerWidth={offerWidth}
                    bestValueColor={best_value_color__limio_color}
                    />
                ))
            ) : (
                <p>No offers to display...</p>
            )}
          </div>
          </>
}
    {/* {filteredOffers.length > 0 ? (
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
              offerWidth={offerWidth}
              />
          ))
      ) : (
          <p>No offers to display...</p>
      )} */}
    </div>

</section>
)
}

export default switchSubscription