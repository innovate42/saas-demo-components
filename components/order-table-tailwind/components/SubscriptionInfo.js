//@flow
import * as React from "react";
import * as R from "ramda";
import { getPeriodForOffer, getCurrentOffer } from "../../source/utils/offers"
import { formatDate } from "../../source/utils/date"
import {getPriceForUserSubscription, getRenewalDateForUserSubscription} from "../../source/utils/subscriptions"
import {  getCurrentAddress, addressSummary } from "../../source/utils/address";
import { useLimioUserSubscriptionAddresses } from "@limio/internal-checkout-sdk"
import { EditAddress } from "./EditAddress";
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { mutateCacheById } from "@limio/shop/src/components/helpers.js"



export const SubscriptionInfo = ({subscription, cancelLink, switchLink, changePaymentLink}) => {
const [showFullAddress, setShowFullAddress] = React.useState(false) 
const [editAddress, setEditAddress] = React.useState(false)
const {status, data, name, id, mode} = subscription
const { addresses: customerAddress, revalidate: revalidateAddresses} = useLimioUserSubscriptionAddresses(id)
const [addresses, setAddresses] = React.useState(() => {
  const { data: deliveryAddress = {} } = getCurrentAddress("delivery", customerAddress)
  const { data: billingAddress = {} } = getCurrentAddress("billing", customerAddress)
  return { deliveryAddress, billingAddress }
})
const [newAddress, setNewAddress] = React.useState(addresses.deliveryAddress)
const [formErrors, setFormErrors] = React.useState({})
const [loading, setLoading] = React.useState(false)
const requiredFields = ["firstName", "lastName", "address1", "city", "postalCode", "country"]
const [sameAsDelivery, setSameAsDelivery] = React.useState(R.equals(addresses.deliveryAddress, addresses.billingAddress))



const productName = data.products[0].attributes.display_name__limio
const offer = getCurrentOffer(subscription)
const isAutoRenew = offer.data.attributes.autoRenew__limio ? "Yes" : "No"

const isDelivery = offer?.data?.products?.some(product => product?.attributes?.has_delivery__limio || product?.data?.attributes?.has_delivery__limio)


const handleAddressFieldChange = (e) => {
  const { id, value } = e.target
  setNewAddress({...newAddress, [id]: value})
}

const updateCustomerAddress = async (address, type) => {
  console.log("address", address)
  const order = {
    order_type: "change_address",
    type: type,
    forSubscription: {
      id: id
    },
    address: address,
    mode
  }

  return sendOrder(order)
}

const handleSubmit = async (e) => {
  e.preventDefault()



// Check all required fields are populates
const errors = {}
for(const key in newAddress){
  if(!newAddress[key] && requiredFields.includes(key)){
    errors[key] = `${key} is required`
  }
}


// Display relevant errors on form  
setFormErrors(errors)

if (Object.keys(errors).length !== 0) return

// Show loading spinner
setLoading(true)

// Send order to update address
await updateCustomerAddress(newAddress, "delivery")

if(sameAsDelivery){
  await updateCustomerAddress(newAddress, "billing")
}

revalidateAddresses()

// Hide loading spinner
setLoading(false)

// Update address in state
if(sameAsDelivery){
  setAddresses({deliveryAddress: newAddress, billingAddress: newAddress})
} else{
  setAddresses({deliveryAddress: newAddress, billingAddress: addresses.billingAddress})
}

// Hide modal
setEditAddress(false)

mutateCacheById(`/api/mma/subscriptions`)
}


    return(
      <div>
        <p className="dark:text-white font-extralight mb-2 text-sm">{`${status[0].toUpperCase()}${status.slice(1)}`}</p>
        <table className=" bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 dark:bg-gray-800 dark:text-white flex">
          <tbody className="flex flex-col md:flex-row justify-evenly py-8">
        <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Product</th>
                <td className="px-4 py-2  text-sm">{productName}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Subscription Number</th>
                <td className="px-4 py-2  text-sm">{name}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Term</th>
                <td className="px-4 py-2  text-sm">{getPeriodForOffer(offer)}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Start Date</th>
                <td className="px-4 py-2  text-sm">{formatDate(subscription.data.startDate)}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Payment Amount</th>
                <td className="px-4 py-2  text-sm">{getPriceForUserSubscription(subscription)}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Renewal Date</th>
                <td className="px-4 py-2  text-sm">{getRenewalDateForUserSubscription(subscription)}</td>
              </tr>
              <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Auto Renewal</th>
                <td className="px-4 py-2  text-sm">{isAutoRenew}</td>
              </tr>
              {isDelivery && 
                <tr className="dark:text-white text-left flex flex-col">
                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Delivery Address</th>
          
                  <td className="px-4 py-2  text-sm mb-2">{addressSummary(addresses.deliveryAddress)}</td>
              
                <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 sm:w-3/4 self-center "
            onClick={() => setEditAddress(true)}
            >Edit Address</button>
              </tr>}
              </tbody>
        </table>
        
       {editAddress && <EditAddress setEditAddress={setEditAddress} handleAddressFieldChange={handleAddressFieldChange} handleSubmit={handleSubmit} newAddress={newAddress} formErrors={formErrors} loading={loading}/>}
        <div className="mt-8 flex flex-col md:flex-row justify-start">
            <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
            onClick={() => (window.location.href = `${changePaymentLink}?subId=${id}`)}
            >Change Payment</button>
              <button className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
            onClick={() => (window.location.href = `${switchLink}?subId=${id}`)}
            >Amend Subscription</button>
            <button className="mt-auto text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:outline-none dark:focus:ring-red-800 w-full md:w-1/4"
            onClick={() => (window.location.href = `${cancelLink}?subId=${id}`)}
            >Cancel My Subscription</button>

          </div>
        </div>
    )
}


