// @flow
import React from "react";
import { sanitizeString, formatDisplayPrice } from "../../source/utils/string";
import { AddToBasketButton } from "./AddToBasketButton";





const Offer = ({ offer, showImage, offerWidth, primaryColor, freeTrialLink, bestValueColor }) => {
    const attachments = offer.data.attachments ? offer.data.attachments.filter(x => x.type.includes("image")) : []
    const hasAttachments = attachments.length > 0

    const {
        display_name__limio,
        display_price__limio,
        display_equivalent_price,
        offer_features__limio,
        price__limio,
        detailed_display_price__limio,
        best_value__limio,
        display_description__limio
    } = offer.data.attributes;

  

    const bestVauleStyle = () => {
        if (best_value__limio) {
            return `2px solid ${bestValueColor}`
        }
    }

    const bestValueText = display_description__limio || "Best Value"

   const formatBulletPoints = (string) => {
        const sanitised = sanitizeString(string)
    
        const features = document.createElement("div")
        features.innerHTML = sanitised
    
        return [].slice.call(features.children).map((feature, i) => (
            <li className="flex items-center space-x-3" key={`${feature.innerText}-${i}`}>
                <svg className="flex-shrink-0 w-5 h-5" fill="currentColor"
                style={{color: `${primaryColor}`}}
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"></path>
                </svg>
                <span>{feature.innerText}</span>
            </li>
        ))
    }


    return (
        <div className={`flex flex-col p-6 mr-2 text-center text-gray-900 ${!best_value__limio ? `border border-gray-100  dark:border-gray-600 rounded-lg`: `` } bg-white  shadow  xl:p-8 dark:bg-gray-800 dark:text-white`}
        style={{minWidth: `${offerWidth * 10}em`, maxWidth: `${offerWidth * 10}em`, marginBottom: "20px", position: "relative", borderLeft: bestVauleStyle(), borderRight: bestVauleStyle(), borderBottom: bestVauleStyle(), borderTop: bestVauleStyle(), borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}
        >
            {best_value__limio && (
                <span className="best-value" style={{backgroundColor: bestValueColor}}>{bestValueText.toUpperCase()}</span>
            )}
          <h3 className="mb-4 text-2xl font-semibold break-words">{display_name__limio}</h3>
            {(showImage && hasAttachments) && (
                <div className="flex flex-row justify-center">
                    <div style={{maxWidth: "40%"}}>
                        <img src={attachments[0].url} alt="modal-image" className="rounded-lg object-scale-down"/>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-3xl font-extrabold"
              style={{overflowWrap: "anywhere"}}
                    dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
              />
            </div>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4 v">
                {display_equivalent_price}
            </p>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6"
               dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(detailed_display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
            />
            <ul role="list" className="mb-8 space-y-4 text-left">
                {offer_features__limio && formatBulletPoints(offer_features__limio)}
            </ul>
            <AddToBasketButton offer={offer} primaryColor={primaryColor} />
            <span className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: sanitizeString(freeTrialLink) }}/>
        </div>
  );
};

export default Offer;
