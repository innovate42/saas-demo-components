// @flow
import { useCampaign } from "@limio/sdk";
import * as React from "react";
import Offer from "./components/Offer";
import "./index.css";

export type Props = {
  offerWidth: number,
  offerOverflowLayout: string,
  ineligibleMessage: string,
  includedFeaturesTitle: string,
  maxCards: number,
  showOfferImages: boolean,
  alwaysMinimise: boolean,
  componentId: string,
  analyticsIdentifier: string,
};

export default function B2BOfferCards(props: Props): React.Node {
  const {
    offerWidth,
    offerOverflowLayout,
    ineligibleMessage,
    includedFeaturesTitle,
    maxCards,
    showOfferImages,
    alwaysMinimise,
    componentId,
    analyticsIdentifier,
  } = props;
  const cid = componentId || "b2b-offer-cards";
  const fid = analyticsIdentifier?.toLowerCase() || "b2b-offer-cards";

  const { offers = [] } = useCampaign();

  return (
    <section
      id={cid}
      data-testid="section"
      data-sophi-feature={fid}
      className="offer_cards__section"
    >
      <div
        className={"offer_cards__wrapper"}
        style={{ flexWrap: maxCards ? "wrap" : undefined }}
      >
        {offers.length > 0 ? (
          offers.map((offer) => (
            <Offer
              showOfferImages={showOfferImages}
              ineligibleMessage={ineligibleMessage}
              alignItems={offerOverflowLayout}
              width={offerWidth}
              key={offer.path + "/parent"}
              offer={offer}
              maxCards={maxCards}
              alwaysMinimise={alwaysMinimise}
              includedFeaturesTitle={includedFeaturesTitle}
            />
          ))
        ) : (
          <p>No offers to display...</p>
        )}
      </div>
    </section>
  );
}
