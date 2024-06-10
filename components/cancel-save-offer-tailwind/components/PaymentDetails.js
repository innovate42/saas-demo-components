import * as React from "react";
import * as R from "ramda"
import {  processPaymentMethod, getPaymentLabel } from "../../source/utils/paymentMethods";



function PaymentDetails({paymentFrequency, paymentAmount, paymentDate, paymentMethod}) {


const paymentMethodData = R.path(["data", paymentMethod.type, "result"], paymentMethod)
const { paymentDescription, paymentIcon, secondaryPaymentIcon } = processPaymentMethod(paymentMethod)
const paymentLabel = getPaymentLabel(paymentMethod)


    const getPaymentDetails = paymentType => {
        if (["direct_debit", "DirectDebit"].includes(paymentType)) {
          return (
            <>
              <div className="">
                <div aria-label="payment-icon-row">{paymentIcon}</div>
                <div className="payment-label">{paymentLabel}</div>
              </div>
              <div className="payment-information-payment-info">
                <div className="payment-title">Sort code:</div>
                <div className="payment-text">••••••</div>
              </div>
              <div className="payment-information-payment-info">
                <div className="payment-title">Account number:</div>
                <div className="payment-text">•••• ••••</div>
              </div>
              {directDebitInfoText && <p className="direct-debit-info" dangerouslySetInnerHTML={{ __html: directDebitInfoText }} />}
            </>
          )
        } else {
          return (
            <>
              <div className="flex ">
                <div className="w-6 h-6 mr-4">{secondaryPaymentIcon || paymentIcon}</div>
                <div className="self-end">{paymentLabel}</div>
              </div>
              <div className="payment-text">{paymentDescription}</div>
            </>
          )
        }
      }

    return(
        <div>
               <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Payment details</p>
        <table className=" bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white">
        <tbody className="flex flex-col md:flex-row justify-evenly py-8">
        <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2  text-sm h-14 w-14">Payment Details</th>
                <td className="px-4 py-2  text-sm">{getPaymentDetails(paymentMethodData)}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Payment frequency</th>
                <td className="px-4 py-2  text-sm">{paymentFrequency}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Payment amount</th>
                <td className="px-4 py-2  text-sm">{paymentAmount}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Payment Date</th>
                <td className="px-4 py-2  text-sm">{paymentDate}</td>
              </tr>
                
              </tbody>
        </table>
        </div>
    )
}

export default PaymentDetails;