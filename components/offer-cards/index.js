// @flow
import React, { useEffect } from "react";
import { useCampaign } from "@limio/sdk";
import Offer from "./components/Offer.js";

type Props = {
  heading: string,
  subheading: string
};

export const OfferCards = ({heading, subheading}: Props) => {
  const { addOns = []} = useCampaign()

  useEffect(() => {
    typeof performance !== "undefined" && performance?.mark?.("offers-init");
  }, []);

  return (
      <section className="offer-section">
        <div className="offer-container">
          <div className="offer-heading-container">
            <h2 className="offer-heading">Heading Text</h2>
            <p className="offer-subheading">Subheading Text</p>
          </div>
          <div className="offer-grid">
            {addOns.length > 0 ? (
                addOns.map((addOn) => (
                    <Offer key={addOn.path + "/parent"} offer={addOn}
                    />
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
