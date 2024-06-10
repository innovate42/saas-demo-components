//@flow
import * as React from "react";
import "../source/style/style.css";
import { useCheckout } from "@limio/internal-checkout-sdk"
import { formatCurrency } from "../source/currency"
import { getPeriodForOffer } from "../source/utils/offers";
import { formatDate, getTermDates } from "../source/utils/date";
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import { useSubscriptions } from "@limio/sdk"
import { DateTime } from "@limio/date"

type Props = {
  title: String,
  message: String,
  messageTitle: String
}

function OrderConfirmation({title, message, messageTitle }: Props): React.Node {
  const {subscriptions} = useSubscriptions()
const { useCheckoutSelector } = useCheckout()
const { order = {}, paidSchedule = {}, schedule = {}, paymentMethod, locale, completed } = useCheckoutSelector(state => state)
const price = formatCurrency(paidSchedule.amount, paidSchedule.currency, locale)
const dateFormat = getAppConfigValue(["shop", "default_date_format"])



const { termStartDate, termEndDate } = getTermDates(order, paymentMethod, subscriptions[0].data) 
const today = DateTime.local().toISO()
const {customerDetails, billingDetails} = order


  return (
  <div className="bg-white dark:bg-gray-900">
    <div className="max-w-screen-xl mx-auto py-20 px-8">
    <div className="flex flex-col">
      <h3 className="dark:text-white text-1xl md:text-3xl font-bold"> {title}</h3>
      <div className="flex flex-col items-center mt-4 md:mt-8">
        <h2 className="dark:text-white md:text-5xl tracking-tight font-extrabold text-gray-900 sm:my-4">{messageTitle}</h2>
        <p className="mb-4 font-light text-gray-500 sm:text-xl dark:text-gray-400">{message}</p>
      </div>
      <div className="py-4">
        <h4 className="dark:text-white text-base md:text-lg font-semibold">Order Summary</h4>
      </div>
      <table className=" bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white">
     {order.orderItems.map((orderItem, i) => 
     <tbody key={`${order.id}-${i}`} className="flex flex-col md:flex-row justify-evenly py-8">
          <tr className="dark:text-white text-left flex flex-row sm:flex-col ">
            <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Description</th>
            <td className="px-4 py-2  text-sm">{orderItem.offer.data.attributes.group__limio}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Price</th>
            <td className="px-4 py-2  text-sm">{price}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2  w-40 md:w-auto text-sm">Term</th>
            <td className="px-4 py-2  text-sm">{getPeriodForOffer(orderItem.offer)}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Start date</th>
            <td className="px-4 py-2  text-sm">{formatDate(termStartDate, dateFormat)}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">End date</th>
            <td className="px-4 py-2  text-sm">{formatDate(termEndDate, dateFormat)}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Payment date</th>
            <td className="px-4 py-2  text-sm">{formatDate(today, dateFormat)}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Renewal price</th>
            <td className="px-4 py-2  text-sm">{formatCurrency(schedule.amount, schedule.currency, locale)}</td>
          </tr>
          <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Confirmation email</th>
            <td className="px-4 py-2  text-sm">{customerDetails.email}</td>
          </tr>
          </tbody>
)}
      </table>
      <div className="py-4">
        <h4 className="dark:text-white text-base md:text-lg font-semibold">Customer Details</h4>
      </div>
      <table className=" bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white ">
        <tbody className="flex flex-col md:flex-row justify-start py-8">
      <tr className="dark:text-white text-left flex flex-row md:flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Email Address</th>
            <td className="px-4 py-2  text-sm">{customerDetails.email}</td>
          </tr>
          <tr className="dark:text-white text-left flex  flex-col">
            <th className="px-4 py-2 w-40 md:w-auto text-sm">Billing Address</th>
            <td className="px-4 py-2  text-sm">{billingDetails.address1}</td>
            <td className="px-4 py-2  text-sm">{billingDetails.city}</td>
            <td className="px-4 py-2  text-sm">{billingDetails.region}</td>
            <td className="px-4 py-2  text-sm">{billingDetails.postalCode}</td>
          </tr>
          </tbody>
      </table>
      <div>

      </div>
    </div>

    </div>

  </div>
  )
}

export default OrderConfirmation