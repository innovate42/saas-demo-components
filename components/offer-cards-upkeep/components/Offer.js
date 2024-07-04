// @flow
import React from "react";
import {formatDisplayPrice, sanitizeString} from "../../source/utils/string";
import {AddToBasketButton} from "./AddToBasketButton";

const defaultFeatures = `<ul>
  <li>Unlimited work orders</li>
  <li>Schedule Preventative Maintenance</li>
  <li>Custom tasks</li>
  <li>Unlimited Request User Licenses</li>
  <li>Asset Management</li>
  <li>24/7 Phone, email, chat support</li>
</ul>`

const Offer = ({offer, showImage, offerWidth, primaryColor, freeTrialLink, bestValueColor}) => {
    const attachments = offer.data.attachments ? offer.data.attachments.filter(x => x.type.includes("image")) : []
    const hasAttachments = attachments.length > 0

    const {
        display_name__limio,
        display_price__limio,
        display_equivalent_price,
        offer_features__limio = defaultFeatures,
        price__limio,
        detailed_display_price__limio,
        best_value__limio,
        display_description__limio,
        offer_card_color = "green"
    } = offer.data.attributes;

    const bestValueText = display_description__limio || "Best Value"

    const formatBulletPoints = (string) => {

        const liElements = string.match(/<li>(.*?)<\/li>/g)

        if (!liElements) {
            return (
                <div dangerouslySetInnerHTML={{__html: string}}></div>
            )
        } else {

            const splitText = string.split(/<li>(.*?)<\/li>/g)
            const before = splitText[0]
            const after = splitText[splitText.length - 1]

            const mappedLiElements = liElements.map((liElement, i) => {
                const text = liElement.replace(/<\/?li>/g, "")
                return (
                    <li key={i} className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16px" width="16px"
                             fill="none">
                            <rect width="24" height="24" rx="12" fill="#007CB0"/>
                            <path d="M7.5 12L10.5 15L16.5 9" stroke="white" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        <span>{text}</span>
                    </li>
                )
            })

            return (
                <div className={"features-container"}>
                    <div dangerouslySetInnerHTML={{__html: before}}></div>
                    <ul>
                        {mappedLiElements}
                    </ul>
                    <div dangerouslySetInnerHTML={{__html: after}}></div>
                </div>
            )
        }
    }


    console.log(offer)


    return (
        <>
            <div
                className={`flex flex-col p-6 mr-2 text-gray-900 bg-white  shadow  xl:p-8 dark:bg-gray-800 dark:text-white relative`}
                style={{
                    minWidth: `${offerWidth * 10}em`,
                    maxWidth: `${offerWidth * 10}em`,
                    marginBottom: "20px",
                    position: "relative",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px"
                }}
            >

                <div className={`color-bar ${best_value__limio ? "best-value-text-box" : null}`}
                     style={{backgroundColor: offer_card_color}}>{best_value__limio && bestValueText}</div>
                <h3 className="mb-4 text-2xl font-semibold break-words">{display_name__limio}</h3>
                {(showImage && hasAttachments) && (
                    <div className="flex flex-row justify-center">
                        <div style={{maxWidth: "40%"}}>
                            <img src={attachments[0].url} alt="modal-image" className="rounded-lg object-scale-down"/>
                        </div>
                    </div>
                )}
                <div dangerouslySetInnerHTML={{__html: detailed_display_price__limio}} className={""}></div>
                <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-3xl font-extrabold"
                    style={{overflowWrap: "anywhere"}}
                    dangerouslySetInnerHTML={{
                        __html: sanitizeString(formatDisplayPrice(display_price__limio, [{
                            currencyCode: price__limio[0].currencyCode,
                            value: price__limio[0].value,
                        }]))
                    }}
              />
                </div>
                <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4 v">
                    {display_equivalent_price}
                </p>
                <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6 mh-50"
                   dangerouslySetInnerHTML={{
                       __html: sanitizeString(formatDisplayPrice(detailed_display_price__limio, [{
                           currencyCode: price__limio[0].currencyCode,
                           value: price__limio[0].value,
                       }]))
                   }}
                />
                {offer_features__limio && formatBulletPoints(offer_features__limio)}
                <AddToBasketButton offer={offer} primaryColor={primaryColor}/>
                <span className="text-gray-400 text-sm text-center"
                      dangerouslySetInnerHTML={{__html: sanitizeString(freeTrialLink)}}/>
            </div>
        </>
    );
};

export default Offer;
