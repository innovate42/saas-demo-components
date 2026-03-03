// @flow
import React from "react";
import { useBasket } from "@limio/sdk";
import { sanitizeString, formatDisplayPrice } from "../../source/utils/string";

const PricingCard = ({ offer, primaryColor, ctaColor }) => {
  const { addToBasket } = useBasket();

  const {
    display_name__limio,
    display_price__limio,
    display_description__limio,
    offer_features__limio,
    price__limio,
    cta_text__limio,
    best_value__limio,
  } = offer.data.attributes;

  const isContactUs = !price__limio || price__limio.length === 0;
  const ctaText = cta_text__limio || (isContactUs ? "Let's talk" : "Request a demo");

  const formatBulletPoints = (string) => {
    const sanitised = sanitizeString(string);
    const features = document.createElement("div");
    features.innerHTML = sanitised;

    return [].slice.call(features.children).map((feature, i) => (
      <li className="flex items-center space-x-3" key={`${feature.innerText}-${i}`}>
        <svg className="flex-shrink-0 w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-700 dark:text-gray-300">{feature.innerText}</span>
      </li>
    ));
  };

  return (
    <div
      className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-lg hover:border-[#053A5E] hover:-translate-y-0.5 transition-all duration-200 p-6 xl:p-8"
      style={{ minHeight: "500px" }}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {display_name__limio}
      </h3>

      <div className="mb-4">
        {isContactUs ? (
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">Contact us</span>
        ) : (
          <div className="flex items-baseline">
            <span
              className="text-3xl font-extrabold text-gray-900 dark:text-white"
              dangerouslySetInnerHTML={{
                __html: sanitizeString(
                  formatDisplayPrice(display_price__limio, [
                    { currencyCode: price__limio[0].currencyCode, value: price__limio[0].value },
                  ])
                ),
              }}
            />
          </div>
        )}
        {!isContactUs && (
          <p className="text-sm text-gray-400 mt-1">with annual contract</p>
        )}
      </div>

      {display_description__limio && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {display_description__limio}
        </p>
      )}

      <ul role="list" className="mb-8 space-y-3 text-left flex-grow">
        {offer_features__limio && formatBulletPoints(offer_features__limio)}
      </ul>

      <button
        onClick={() => addToBasket(offer)}
        className="w-full rounded-lg px-5 py-3 text-center text-sm font-semibold transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
        style={{
          backgroundColor: ctaColor || primaryColor || "#053A5E",
          color: "#ffffff",
        }}
      >
        {ctaText}
      </button>
    </div>
  );
};

export default PricingCard;
