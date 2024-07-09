// @flow
import React, {useCallback} from "react";
import {formatDisplayPrice, sanitizeString} from "../../source/utils/string";
import {ConfirmDialog} from "./ConfirmDialog";
import {handleSubmitSwitch} from "../requests";
import {DateTime} from "@limio/date"
import {useUser} from "@limio/sdk"
import {getRecaptchaToken} from "@limio/shop/src/shop/checkout/helpers"
import {getAppConfigValue} from "@limio/shop/src/shop/appConfig.js"
import {previewOrder} from "@limio/shop/src/shop/helpers/postRequests.js"
import {checkActiveOffers} from "../../source/utils/offers";


const Offer = ({
                   offer,
                   subscription,
                   showImage,
                   confirmationOk,
                   confirmationCancel,
                   confirmHeading,
                   confirmSubHeading,
                   nextSchedule,
                   addresses,
                   revalidate,
                   redirectUrl,
                   primaryColor,
                   offerWidth,
                   bestValueColor,
                   confirmationPeriodHeader,
                   confirmationAmountDueToday,
                   confirmationStartDateHeader

               }) => {

    const [quantity, setQuantity] = React.useState(checkActiveOffers(subscription?.offers)[0]?.data.quantity || 1)
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
        detailed_display_price__limio,
        cta_text__limio,
        best_value__limio,
        display_description__limio
    } = offer.data.attributes;
    const params = new URL(window.location).searchParams
    const reason = params.get("reason")
    const user = useUser()
    const userAttributes = user.attributes
    const onCancel = () => setShowConfirm(false)
    const recaptchaId = getAppConfigValue(["analytics", "google_recaptcha_v3"])

    // const onConfirm = async () => {

    //     setShowConfirm(false)
    // }


    const previewCurrentOrder = useCallback(async () => {

        const orderForPreview = offer

        const unverifiedRecaptchaToken = await getRecaptchaToken(recaptchaId)

        return previewOrder(
            {
                offer: orderForPreview,
                customerDetails: userAttributes,
                subscriptionId: id,
                effectiveDate: effectiveDate,
                order_type: "change_offer",
                quantity: quantity
            },
            {"x-limio-recaptcha": unverifiedRecaptchaToken}
        )

    }, [offer, recaptchaId, userAttributes, id, effectiveDate, quantity])


    const handleSubmit = async (offer, deliveryDetails) => {
        const order = {
            offer,
            deliveryDetails,
            quantity: quantity,
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

        return handleSubmitSwitch({userAttributes}, id, order)
    }


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


    const bestVauleStyle = () => {
        if (best_value__limio) {
            return `2px solid ${bestValueColor}`
        }
    }


    const bestValueText = display_description__limio || "Best Value"

    return (
        <div
            className={`flex flex-col p-6 mr-2 text-center text-gray-900 ${!best_value__limio ? `border border-gray-100  dark:border-gray-600 rounded-lg` : ``} bg-white  shadow  xl:p-8 dark:bg-gray-800 dark:text-white`}
            style={{
                minWidth: `${offerWidth * 10}em`,
                maxWidth: `${offerWidth * 10}em`,
                marginBottom: "20px",
                position: "relative",
                borderLeft: bestVauleStyle(),
                borderRight: bestVauleStyle(),
                borderBottom: bestVauleStyle(),
                borderTop: bestVauleStyle(),
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px"
            }}>
            {best_value__limio && (
                <span className="best-value"
                      style={{backgroundColor: bestValueColor}}>{bestValueText.toUpperCase()}</span>
            )}
            {showConfirm && (
                <ConfirmDialog
                    confirmationAmountDueToday={confirmationAmountDueToday}
                    confirmationStartDateHeader={confirmationStartDateHeader}
                    confirmationPeriodHeader={confirmationPeriodHeader}
                    offer={offer}
                    previewOrder={previewCurrentOrder}
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
                    quantity={quantity}
                    setQuantity={setQuantity}
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
                    dangerouslySetInnerHTML={{
                        __html: sanitizeString(formatDisplayPrice(display_price__limio, [{
                            currencyCode: price__limio[0].currencyCode,
                            value: price__limio[0].value,
                        }]))
                    }}
                    style={{overflowWrap: "anywhere"}}
              />
            </div>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4">
                {display_equivalent_price}
            </p>
            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6"
               dangerouslySetInnerHTML={{
                   __html: sanitizeString(formatDisplayPrice(detailed_display_price__limio, [{
                       currencyCode: price__limio[0].currencyCode,
                       value: price__limio[0].value,
                   }]))
               }}
            />
            <ul role="list" className="mb-8 space-y-4 text-left">
                {offer_features__limio && formatBulletPoints(offer_features__limio)}
            </ul>
            <div
                onClick={() => setShowConfirm(true)}
                className="mt-auto text-white   font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 add-to-basket-button"
                style={{backgroundColor: `${primaryColor}`}}
            >
                {cta_text__limio ? cta_text__limio : `Subscribe`}
            </div>
        </div>

    );
};

export default Offer;
