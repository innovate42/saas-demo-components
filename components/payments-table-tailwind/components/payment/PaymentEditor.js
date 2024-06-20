import React from "react"
import { paymentComponents } from "./helpers"

const SinglePaymentEditor = ({ paymentType, headings, subheadings, ...rest }) => {
  const PaymentComponent = paymentComponents[paymentType]

  if (headings[paymentType]) {
    const { heading, subheading } = headings[paymentType]

    if (PaymentComponent) {
      return (
        <div className="mt-8 mb-8">
          <div >
            <h2 className="mb-2 font-light text-gray-500 sm:text-xl dark:text-gray-400">{heading}</h2>
            <h3 className="mb-2">{subheading}</h3>
          </div>
          <div className=" bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white flex p-8">
            <PaymentComponent {...rest} />
          </div>
        </div>
      )
    }
  } else {
    return null
  }
}

export const MultiPaymentEditor = ({ paymentTypes, ...rest }) => {
  return (
    <div className="multi-payment-editor">
      {paymentTypes.map((paymentType, index) => (
        <SinglePaymentEditor paymentType={paymentType} detailedEditor={true} key={`single-payment-editor-${index}`} {...rest} />
      ))}
    </div>
  )
}

export default MultiPaymentEditor

