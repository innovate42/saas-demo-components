import React, { useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBasket, formatDisplayPrice } from "@limio/sdk";
import type { Offer as OfferType, CatalogItem } from "@limio/types";

export default function Offer({
  offer,
  maxCards,
  showOfferImages,
  width,
  alignItems,
  ineligibleMessage,
  includedFeaturesTitle,
  alwaysMinimise,
}) {
  const {
    display_name__limio,
    display_price__limio,
    display_equivalent_price,
    detailed_display_price__limio,
    cta_text__limio,
    offer_features__limio,
    best_value__limio,
    display_description__limio,
    price__limio,
  } = offer.data.attributes;

  const offerImage = offer.data.attachments
    ? offer.data.attachments.find((x) => x.type.includes("image")) ?? {}
    : {};

  const fixedQuantity = Number(offer.data.attributes.fixed_multibuy_quantity);

  const [featuresOpen, setFeaturesOpen] = useState(false);
  const { addToBasket } = useBasket();

  const checkmarkImage =
    "/public/055769d9-82cb-4b12-90f7-a80a2146d551/Checkmark.png";

  const cardStyles = {
    flexGrow: maxCards ? 1 : undefined,
    flexShrink: maxCards ? 0 : undefined,
    width: maxCards
      ? `calc(${parseInt(100 / maxCards) - 1}% - 40px)`
      : `${width * 100}px`,
    maxWidth: maxCards
      ? `calc(${parseInt(100 / maxCards) - 1}% - 40px)`
      : undefined,
    alignSelf: alignItems,
    marginBottom: "1em",
  };

  const featuresStyle = {
    listStyleImage: `url("${checkmarkImage}") !important`,
  };

  return (
    <div
      data-testid="offer"
      className={`offer_cards__card ${best_value__limio ? "best_value" : ""} ${
        alwaysMinimise ? "always_minimise" : ""
      }`}
      key={offer.path + "/child"}
      style={cardStyles}
    >
      {best_value__limio && (
        <p data-testid="best_value" className="offer_cards__best_value">
          {display_description__limio || "Best Value"}
        </p>
      )}

      <div className="offer_cards__content">
        {showOfferImages && offerImage.url && (
          <div className="offer_cards__image">
            <img src={offerImage.url} alt="" />
          </div>
        )}
        <div>
          <div className="offer_cards_text__wrapper">
            <h2 data-testid="heading" className="offer_cards__heading">
              {display_name__limio}
            </h2>
            <div className="offer_cards__text">
              <div
                data-testid="display_price"
                className="offer_cards__price"
                dangerouslySetInnerHTML={{
                  __html: formatDisplayPrice(display_price__limio, [
                    {
                      currencyCode: price__limio[0].currencyCode,
                      value: price__limio[0].value,
                    },
                  ]),
                }}
              />
              <p
                data-testid="equivalent_price"
                className="offer_cards__equivalent"
              >
                {display_equivalent_price}
              </p>
              <div
                data-testid="detailed_display_price"
                className="offer_cards__detailed_price"
                dangerouslySetInnerHTML={{
                  __html: formatDisplayPrice(detailed_display_price__limio, [
                    {
                      currencyCode: price__limio[0].currencyCode,
                      value: price__limio[0].value,
                    },
                  ]),
                }}
              />
              <button
                data-testid="cta"
                className="offer_cards__button ds-button"
                onClick={() => addToBasket(offer, null, fixedQuantity)}
              >
                {cta_text__limio || "Subscribe"}
              </button>
            </div>
            <div
              data-testid="features"
              className="offer_cards__features"
              dangerouslySetInnerHTML={{ __html: offer_features__limio }}
              style={featuresStyle}
            />
          </div>
        </div>
      </div>

      <div className="offer_cards__button_features_wrapper">
        <div className="offer_cards__included_wrapper">
          {offer_features__limio && (
            <>
              <hr className="offer_cards__feature_rule ds-rule" />
              <button
                data-testid="whats_included_toggle"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`offer_cards_included ${
                  featuresOpen ? "open" : "closed"
                }`}
              >
                <p>{includedFeaturesTitle}</p>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
              <div
                data-testid="features"
                className="offer_cards__features_mobile"
                dangerouslySetInnerHTML={{ __html: offer_features__limio }}
                style={featuresStyle}
              />
              <hr className="offer_cards__feature_rule ds-rule" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
