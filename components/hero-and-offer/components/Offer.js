import * as React from "react";
// @ts-ignore
import { useCampaign, useBasket } from "@limio/sdk";
import type { OfferProps } from "../types";

const stripHTMLTags = (str: string) => {
  return str.replace(/<[^>]*>?/gm, "");
};

function Offer({ underbuttonText }: OfferProps) {
  const { offers = [] } = useCampaign();
  const { addToBasket } = useBasket();
  // the page only handles a single offer?
  const workingOffer = offers[0];
  const { attributes } = workingOffer?.data || {};

  const handleClick = () => {
    addToBasket(workingOffer);
  };

  return (
    <div className="offer-container-wrapper">
      <div className="offer-container">
        <h2 className="offer-heading">
          {stripHTMLTags(attributes.display_price__limio)}
        </h2>
        <p className="offer-subtext">
          {stripHTMLTags(attributes.detailed_display_price__limio)}
        </p>
        <button onClick={handleClick} className="offer-button">
          {attributes.cta_text__limio}
        </button>
        <p className="offer-tandc">{underbuttonText}</p>
      </div>
    </div>
  );
}

export default Offer;
