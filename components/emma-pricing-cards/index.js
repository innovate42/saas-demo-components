// @flow
import React, { useEffect } from "react";
import { useCampaign } from "@limio/sdk";
import PricingCard from "./components/PricingCard.js";
import "../source/style/style.css";

type Props = {
  heading: string,
  subheading: string,
  primaryColor__limio_color: string,
  ctaColor__limio_color: string,
  componentId: string,
};

function EmmaPricingCards({
  heading,
  subheading,
  primaryColor__limio_color,
  ctaColor__limio_color,
  componentId,
}: Props): React.Node {
  const { offers = [] } = useCampaign();

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("emma-pricing-cards-init");
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900" id={componentId}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {(heading || subheading) && (
          <div className="mx-auto max-w-screen-lg text-center mb-8 lg:mb-12">
            {heading && (
              <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white leading-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="font-light text-gray-500 text-lg sm:text-xl dark:text-gray-400">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {offers.length > 0 ? (
            offers.map((offer, i) => (
              <PricingCard
                key={`${offer.path || offer.id}-${i}`}
                offer={offer}
                primaryColor={primaryColor__limio_color}
                ctaColor={ctaColor__limio_color}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No offers to display...</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default EmmaPricingCards;
