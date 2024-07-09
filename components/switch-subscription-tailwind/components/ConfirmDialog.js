import React, {useEffect, useState} from "react";
import {formatCurrency} from "../../source/currency";
import {getAppConfigValue} from "@limio/shop/src/shop/appConfig.js"
import {DateTime} from "@limio/date"
import {formatDate} from "../../source/utils/date"
import {addressSummary, getCurrentAddress} from "../../source/utils/address";
import {mutateCacheById} from "@limio/shop/src/components/helpers.js"
import {AddressEditor} from "./AddressEditor";
import {sendOrder} from "@limio/shop/src/shop/helpers/postRequests.js"
import * as R from "ramda";


export const ConfirmDialog = ({
                                  offer,
                                  subscription,
                                  onCancel,
                                  onConfirm,
                                  confirmationOk,
                                  confirmationCancel,
                                  confirmHeading,
                                  confirmSubHeading,
                                  nextSchedule,
                                  customerAddress,
                                  revalidate,
                                  redirectUrl,
                                  previewOrder,
                                  confirmationPeriodHeader,
                                  confirmationAmountDueToday,
                                  confirmationStartDateHeader,
                                  quantity, setQuantity
                              }) => {
    const [loading, setLoading] = React.useState(false)
    const externalPriceOnOffer = offer?.data?.attributes?.price__limio?.[0]?.use_external_price || false
    const allowMultibuy = offer?.data?.attributes?.allow_multibuy__limio || false
    const effectiveDate = offer?.data?.attributes?.switch_date__limio === "immediate" ? DateTime.utc().toISO() : nextSchedule?.data?.schedule_date || subscription?.data?.termEndDate
    const dateFormat = getAppConfigValue(["shop", "default_date_format"])
    const showPriceWithTax = getAppConfigValue(["shop", "show_price_with_tax"]) || false
    const showPriceWithTaxCountries = getAppConfigValue(["shop", "show_price_with_tax_country_codes"]) || []
    const purchaseCountry = subscription?.data?.purchaseCountry
    const products = offer?.data?.products
    const hasDelivery = products?.[0]?.attributes?.has_delivery__limio || products?.[0]?.data?.attributes?.has_delivery__limio
    const [editAddress, setEditAddress] = React.useState(false)
    const id = subscription?.id
    const mode = subscription?.mode
    const [addresses, setAddresses] = React.useState(() => {
        const {data: deliveryAddress = {}} = getCurrentAddress("delivery", customerAddress)
        const {data: billingAddress = {}} = getCurrentAddress("billing", customerAddress)
        return {deliveryAddress, billingAddress}
    })

    const [newAddress, setNewAddress] = React.useState({
        firstName: "",
        lastName: "",
        country: "",
        address2: "",
        city: "",
        address1: "",
        postalCode: "",
        state: ""
    })
    const [formErrors, setFormErrors] = React.useState({})
    const [addressFormLoading, setAddressFormLoading] = React.useState(false)
    const requiredFields = ["firstName", "lastName", "address1", "city", "postalCode", "country"]
    const [sameAsDelivery, setSameAsDelivery] = React.useState(R.equals(addresses.deliveryAddress, addresses.billingAddress))
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [previewSchedule, setPreviewSchedule] = useState([])
    const externalPriceReady = externalPriceOnOffer && !loadingPreview && previewSchedule
    const taxCalculationNeeded = showPriceWithTax && purchaseCountry && showPriceWithTaxCountries.includes(purchaseCountry)
    const priceWithTaxReady = taxCalculationNeeded && !loadingPreview && previewSchedule

    const getPreviewAmountDueToday = () => {
        if (taxCalculationNeeded) {
            return previewSchedule[0]?.amount
        } else {
            return previewSchedule[0]?.amountWithoutTax
        }
    }

    const getPreviewNextAmount = () => {
        if (taxCalculationNeeded) {
            return previewSchedule[1]?.amount
        } else {
            return previewSchedule[1]?.amountWithoutTax
        }
    }

    useEffect(() => {
        if (externalPriceOnOffer || taxCalculationNeeded) {
            setLoadingPreview(true)

            previewOrder()
                .then(response => {
                    setLoadingPreview(false)

                    if (response?.preview?.success === true) {
                        setPreviewSchedule(response?.schedule)
                    }
                })
                .catch(error => {
                })
                .finally(() => {
                    setLoadingPreview(false)
                })
        }
    }, [externalPriceOnOffer, taxCalculationNeeded])

    const handleAddressFieldChange = (e) => {
        const {id, value} = e.target
        setNewAddress({...newAddress, [id]: value})
    }

    const updateCustomerAddress = async (address, type) => {
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
        const errors = {}
        for (const key in newAddress) {
            if (!newAddress[key] && requiredFields.includes(key)) {
                errors[key] = `${key} is required`
            }
        }

        // Display relevant errors on form
        setFormErrors(errors)

        if (Object.keys(errors).length !== 0) return

        // Show loading spinner
        setAddressFormLoading(true)

        // Send order to update address
        await updateCustomerAddress(newAddress, "delivery")

        if (sameAsDelivery) {
            await updateCustomerAddress(newAddress, "billing")
        }

        revalidate()

        // Hide loading spinner
        setAddressFormLoading(false)

        // Update address in state
        if (sameAsDelivery) {
            setAddresses({deliveryAddress: newAddress, billingAddress: newAddress})
        } else {
            setAddresses({deliveryAddress: newAddress, billingAddress: addresses.billingAddress})
        }

        // Hide modal
        setEditAddress(false)

        mutateCacheById(`/api/mma/subscriptions`)
    }


    const confirm = async () => {
        const params = new URL(window.location).searchParams
        setLoading(true)
        await onConfirm(addresses.deliveryAddress)
        setLoading(false)
        onCancel()
        window.location.href = `${redirectUrl}?subId=${params.get("subId")}${effectiveDate ? `&changeDate=${encodeURI(effectiveDate)}` : ""}`
    }


    const getPeriod = () => {
        if (externalPriceOnOffer) {
            if (offer?.data?.attributes?.term__limio) {
                const {length, type} = offer.data.attributes.term__limio
                return `${length} ${length > 1 ? type : type.substr(0, type.length - 1)}`
            }
            return ""
        }
        const price = offer?.data?.attributes?.price__limio?.[0]
        const {repeat_interval_type, repeat_interval} = price
        return `${repeat_interval} ${repeat_interval > 1 ? repeat_interval_type : repeat_interval_type.substr(0, repeat_interval_type.length - 1)}`
    }


    const getPrice = () => {
        const price = offer?.data?.attributes?.price__limio?.[0]
        const {currencyCode, value} = price

        // for external price or if we need to show tax inclusive then get it from the preview, else we can show the limio price
        const amount = externalPriceReady || priceWithTaxReady ? getPreviewNextAmount() : (value * 1).toFixed(2)
        return formatCurrency(amount, currencyCode)
    }

    const handleQuantityChange = (e) => {
        // dont allow negative
        if (e.target.value < 0) {
            return setQuantity(1)
        }

        setQuantity(e.target.value)
    }

    const handleBlur = () => {
        if (externalPriceOnOffer || taxCalculationNeeded) {
            setLoadingPreview(true)

            previewOrder()
                .then(response => {
                    setLoadingPreview(false)

                    if (response?.preview?.success === true) {
                        setPreviewSchedule(response?.schedule)
                    }
                })
                .catch(error => {
                })
                .finally(() => {
                    setLoadingPreview(false)
                })
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            {loading ?
                <div className="flex justify-center items-center h-full">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
                </div>
                :
                <div
                    className="p-12 flex flex-col items-start md:w-2/4  text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col">
                        <h3 className="mb-4 text-lg sm:text-2xl font-semibold">{confirmHeading}</h3>
                        <p className="mb-4 text-base  text-gray-500 sm:text-lg dark:text-gray-400">{confirmSubHeading}</p>
                    </div>
                    <table
                        className="w-full  bg-white   dark:bg-gray-800 dark:text-white flex flex-col md:flex-row justify-evenly my-8 border border-gray-100 rounded-lg shadow dark:border-gray-600 p-4">
                        <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                            <th className="px-4  py-2 md:pr-4 md:pl-0 w-40 md:w-auto  text-sm ">{confirmationPeriodHeader}</th>
                            <td className="px-4 py-2 md:pr-4 md:pl-0  text-sm">{getPeriod()}</td>
                        </tr>
                        <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                            <th className="px-4 py-2 w-40 md:w-auto  text-sm ">{confirmationAmountDueToday}</th>
                            <td className="px-4 py-2  text-sm">
                                {!externalPriceOnOffer && !taxCalculationNeeded ? (
                                    getPrice()
                                ) : loadingPreview ? (

                                    <div className="flex justify-center items-center h-full">
                                        <div
                                            className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black dark:border-white"></div>
                                    </div>
                                ) : externalPriceReady || priceWithTaxReady ? (
                                    formatCurrency(getPreviewAmountDueToday(), previewSchedule?.[0]?.currency) || "Not available"
                                ) : (
                                    ""
                                )}
                            </td>
                        </tr>
                        <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                            <th className="px-4 py-2 w-40 md:w-auto  text-sm ">{confirmationStartDateHeader}</th>
                            <td className="px-4 py-2  text-sm">{formatDate(effectiveDate, dateFormat)}</td>
                        </tr>
                        <tr className="dark:text-white text-left flex flex-row md:flex-col ">

                            <label
                                   className="label-custom">Quantity:</label>
                            {/*<input type="text" id="first_name"*/}
                            {/*       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"*/}
                            {/*      />*/}
                            <input className="input-custom"
                                   type="number"
                                   disabled={!allowMultibuy}
                                   value={quantity}
                                   onChange={(e) => handleQuantityChange(e)}
                                   onBlur={handleBlur}
                            />
                        </tr>
                        {
                            hasDelivery &&
                            <tr className="dark:text-white text-left flex flex-row md:flex-col ">
                                <th className="px-4 py-2 w-40 md:w-auto  text-sm ">Use this address</th>
                                <td className="px-4 py-2  text-sm">{addressSummary(addresses.deliveryAddress)}</td>
                                <input type="checkbox" checked={!editAddress}
                                       onChange={() => setEditAddress(!editAddress)}/>
                            </tr>
                        }

                    </table>

                    {hasDelivery && editAddress && (
                        <AddressEditor
                            setEditAddress={setEditAddress}
                            handleAddressFieldChange={handleAddressFieldChange}
                            handleSubmit={handleSubmit}
                            newAddress={newAddress}
                            formErrors={formErrors}
                            loading={addressFormLoading}
                        />
                    )}
                    <div className="flex  flex-col md:flex-row md:justify-center mb-4 w-full">
                        <button
                            className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
                            onClick={() => confirm()}>
                            {confirmationOk}</button>
                        <button
                            className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full md:w-1/4"
                            onClick={() => onCancel()}>{confirmationCancel}</button>
                    </div>
                </div>
            }
        </div>
    )
}