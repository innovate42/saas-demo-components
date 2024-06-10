import * as React from "react";
import { parseString, encodeDates } from "../../source/utils/string";
import { formatBulletPoints } from "../../source/utils/string";

function SubscriptionInfo({subscriptionOfferData, description, discountDetails, nextPaymentDetails__limio__richtext, detailedSubheading, imageSource, confirmOfferButtonLabel, setShowDialog}) {

return(
<div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white lg:min-w-full">
<h3 className="mb-2 text-2xl font-semibold">{parseString(discountDetails, subscriptionOfferData, encodeDates)}</h3>
  {imageSource && (
      <div className="flex flex-row justify-center">
          <div style={{maxWidth: "40%"}}>
              <img src={imageSource} alt="modal-image" className="rounded-lg object-scale-down"/>
          </div>
      </div>
  )}
  <div className="flex justify-center items-baseline my-4">
  </div>
  <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4"
  dangerouslySetInnerHTML={{
          __html: parseString(nextPaymentDetails__limio__richtext, subscriptionOfferData, encodeDates)
        }}
  />
  <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6">
        {parseString(detailedSubheading, subscriptionOfferData, encodeDates)}
  </p>
  <ul role="list" className="mb-8 space-y-4 text-left">
      { formatBulletPoints(description)}
  </ul>
  <button type="button"

                          onClick={() => setShowDialog(true)}
                          className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                 {confirmOfferButtonLabel}
                </button>

</div>
    )
}

export default SubscriptionInfo;

