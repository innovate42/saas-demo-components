import * as React from "react";
import PaymentDetails from "./PaymentDetails";
import { formatCurrency } from "../../source/currency";
import { formatDate } from "../../source/utils/date";
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"



export const ConfirmDialog = ({confirmHeading, offer, previewSchedule, nextSchedule, paymentMethodHeading, paymentMethod, loading, setLoading, setShowDialog, confirmationOk, confirmationCancel, onConfirm, redirectUrl, userSubscription }) => {
    const dateFormat = getAppConfigValue(["shop", "default_date_format"])
    const currentOfferTermData = offer?.data?.attributes?.term__limio
    const { length: currentOfferTermLength, type: currentOfferTermType } = currentOfferTermData
    const offerTerm = `${currentOfferTermLength} ${
      currentOfferTermLength > 1 ? currentOfferTermType : currentOfferTermType?.substr(0, currentOfferTermType.length - 1)
    }`
    const effectiveDate =
    offer?.data?.attributes?.switch_date__limio === "immediate" ? DateTime.utc().toISO() : nextSchedule?.data?.schedule_date || userSubscription?.data?.termEndDate
    const discountedPrice = formatCurrency(previewSchedule?.[0]?.amount, nextSchedule?.data?.currency)
    const paymentDate = formatDate(effectiveDate, dateFormat)
        
    const confirm = async () => {
        setLoading(true)
        await onConfirm()
        setLoading(false)
        setShowDialog(false)
        window.location.href = redirectUrl
    }

    return(
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center w-2/4  text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white p-8">
                <h3 className="sm:text-2xl mb-4">{confirmHeading}</h3>
                <PaymentDetails
                paymentMethodHeading={paymentMethodHeading}
                paymentFrequency={offerTerm}
                paymentAmount={discountedPrice}
                paymentDate={paymentDate}
                paymentMethod={paymentMethod}
                />
                {loading ?
                <div className="flex justify-center items-center h-1/2">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
              </div> 
              :
              <div className="flex  flex-col md:flex-row md:justify-center my-8 w-full">
              <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/2"
              onClick={() => confirm()}>
              {confirmationOk}</button>
              <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/2"
              onClick={() => setShowDialog(false)}>{confirmationCancel}</button>
              </div>
                } 
              
            </div>
        </div>
    )
}