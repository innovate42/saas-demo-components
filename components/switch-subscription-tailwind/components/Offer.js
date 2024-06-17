// @flow
import React from "react";
import { sanitizeString, formatDisplayPrice } from "../../source/utils/string";
import { ConfirmDialog } from "./ConfirmDialog";
import { handleSubmitSwitch } from "../requests";
import { DateTime } from "@limio/date"
import {useUser} from "@limio/sdk"




const Offer = ({ offer, subscription, showImage, confirmationOk, confirmationCancel, confirmHeading, confirmSubHeading, nextSchedule, addresses, revalidate, redirectUrl, primaryColor, offerWidth }) => {
    const attachments = offer.data.attachments ? offer.data.attachments.filter(x => x.type.includes("image")) : []
    const hasAttachments = attachments.length > 0
    const [showConfirm, setShowConfirm] = React.useState(false)
   const id = subscription?.id
    const effectiveDate = offer?.data?.attributes?.switch_date__limio === "immediate" ? DateTime.utc().toISO() : nextSchedule?.data?.schedule_date || subscription?.data?.termEndDate
    const {
        display_name__limio,
        display_price__limio,
        display_equivalent_price,
        offer_features__limio,
        price__limio,
        cta_text__limio
    } = offer.data.attributes;
    const params = new URL(window.location).searchParams
    const reason = params.get("reason")
    const user = useUser()
    const userAttributes = user.attributes
    const onCancel = () =>  setShowConfirm(false)

    const onConfirm = async () => {
 
        setShowConfirm(false)
    }

    const handleSubmit = async (offer, deliveryDetails) => {
        const order = {
          offer,
          deliveryDetails,
          quantity: 1,
          effectiveDate,
          // if there is a cancel reason in the URL, we want to pass that in the order - to support switch being used as a cancel/save
          ...(reason && {
            data: {
              reason: {
                id: reason
              }
            }
          })
        }
    
        return handleSubmitSwitch( { userAttributes  }, id, order)
      }

      console.log("primaryColor", primaryColor)

      const formatBulletPoints = (string) => {
        const sanitised = sanitizeString(string)
    
        const features = document.createElement("div")
        features.innerHTML = sanitised
    
        return [].slice.call(features.children).map((feature, i) => (
            <li className="flex items-center space-x-3" key={`${feature.innerText}-${i}`}>
                <svg className="flex-shrink-0 w-5 h-5" fill="currentColor"
                style={{color: primaryColor}}
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
        <div className="flex flex-col p-6 mr-2  text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white "
                  style={{minWidth: `${offerWidth * 10}em`, maxWidth: `${offerWidth * 10}em`,  marginBottom: "20px"}}>
                 {showConfirm && (
               <ConfirmDialog 
               offer={offer}
               subscription={subscription}
               onCancel={onCancel}
               onConfirm={address => handleSubmit(offer, address)}
               confirmationOk={confirmationOk}
                confirmationCancel={confirmationCancel}
                confirmHeading={confirmHeading}
                confirmSubHeading={confirmSubHeading}
                nextSchedule={nextSchedule}
                customerAddress={addresses}
                revalidate={revalidate}
                handleSubmit={handleSubmit}
                redirectUrl={redirectUrl}
               />
           )}
          <h3 className="mb-4 text-2xl font-semibold">{display_name__limio}</h3>
            {(showImage && hasAttachments) && (
                <div className="flex flex-row justify-center">
                    <div style={{maxWidth: "40%"}}>
                        <img src={attachments[0].url} alt="modal-image" className="rounded-lg object-scale-down"/>
                    </div>
                </div>
            )}
            <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-3xl font-extrabold"
                    dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
                    style={{overflowWrap: "anywhere"}}
              />
            </div>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4">
                {display_equivalent_price}
            </p>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6"
               dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
            />
            <ul role="list" className="mb-8 space-y-4 text-left">
                {offer_features__limio && formatBulletPoints(offer_features__limio)}
            </ul>
            <div
                          onClick={() => setShowConfirm(true)}
                          className="mt-auto text-white   font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 add-to-basket-button"
                          style={{backgroundColor: `${primaryColor}`}}
                          >
                  {cta_text__limio ? cta_text__limio : `Subscribe` }
                </div>
        </div>
  
  );
};

export default Offer;
