// @flow
import React from "react";
import { sanitizeString, formatDisplayPrice } from "../../source/utils/string";
import { AddToBasketButton } from "./AddToBasketButton";




const Offer = ({ offer, showImage, offerWidth, primaryColor }) => {
    const attachments = offer.data.attachments ? offer.data.attachments.filter(x => x.type.includes("image")) : []
    const hasAttachments = attachments.length > 0

    const {
        display_name__limio,
        display_price__limio,
        display_equivalent_price,
        offer_features__limio,
        price__limio,
    } = offer.data.attributes;

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
        <div className="flex flex-col p-6 mr-2 text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white "
        style={{minWidth: `${offerWidth * 10}em`, maxWidth: `${offerWidth * 10}em`, marginBottom: "20px"}}
        >
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
               dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
            />
            <ul role="list" className="mb-8 space-y-4 text-left">
                {offer_features__limio && formatBulletPoints(offer_features__limio)}
            </ul>
            <AddToBasketButton offer={offer} primaryColor={primaryColor} />
        </div>
  );
};

export default Offer;
