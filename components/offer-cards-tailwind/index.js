// @flow
import React, { useEffect } from "react";
import { useCampaign } from "@limio/sdk";
import Offer from "./components/Offer.js";
import "../source/style/style.css"


type Props = {
  heading: string,
  subheading: string
  offerWidth: number,
};

export const OfferCards = ({heading, subheading, showImage, componentId, offerWidth}: Props) => {
  const { offers } = useCampaign()

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("offers-init");
  }, []);

  const numberOfOffers = offers.length;
  console.log("Number of offers: ",  numberOfOffers)

  return (
      <section className="bg-white dark:bg-gray-900" id={componentId}>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{heading}</h2>
            <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subheading}</p>
          </div>
          <div className=" flex justify-center flex-wrap ">
          {offers.length > 0 ? (
                offers.map((offer, i) => (
                    <Offer key={`${offer.path}/parent-${i}`} offer={offer} showImage={showImage} offerWidth={offerWidth}/>
                ))
            ) : (
                <p>No offers to display...</p>
            )}
          </div>
      </div>
    </section>
  );
};

export default OfferCards;
