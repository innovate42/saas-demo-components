// @flow
import * as React from "react"
import {v4 as uuid} from "uuid"
import {useCampaign, useSubscriptions} from "@limio/sdk"
import {Alert, LoadingSpinner} from "@limio/design-system"
import * as R from "ramda"
import {usePreview} from "@limio/ui-preview-context"
import {checkCurrentSchedule, formatCurrency, formatDate, stripPathToProductName} from "./helpers"
import {sendOrder} from "@limio/shop/src/shop/helpers/postRequests.js"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleInfo, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons"
import DialogContainer from "./DialogContainer"
import {useLimioUserSubscriptionPaymentMethods} from "@limio/internal-checkout-sdk"

const buildOrder = (subscription, updates) => {
    return {
        order_type: "update_subscription",
        forSubscription: {
            name: subscription.name
        },
        updates: [...updates],
        owner: subscription.owner,
        external_id: uuid(),
        source: "online",
        process_immediately: true
    }
}

type AddOnUpdateAction = {
    type: "add" | "remove",
    quantity: number,
    id: string,
    version?: string,
    effective_date: string,
    record_type: "add_on"
}

const normalizeString = str => str.replace(/[^a-z0-9]/gi, "").toLowerCase()

type Props = {
    updates: Array<AddOnUpdateAction>,
    basketPayText: string,
    longTexts: string,
    continueWord: string,
    successLink: string
}

function EditAddOnsBasket({updates, longTexts, continueWord, basketPayText, successLink}: Props): React.Node {
    const {subscriptions = []} = useSubscriptions()
    const subId = new URLSearchParams(window.location.search).get("subId")
    const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
    const {payment_methods, revalidate: revalidatePayments} = useLimioUserSubscriptionPaymentMethods(subscription.id)

    const {offers = [], addOns: addOnsFromCampaign} = useCampaign()
    let addOns
    if (Array.isArray(addOnsFromCampaign)) {
        addOns = addOnsFromCampaign
    } else {
        addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
    }

    const [offerCode, setOfferCode] = React.useState("")
    const [addOnsPrice, setAddOnsPrice] = React.useState([])
    const [submitting, setSubmitting] = React.useState(false)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const {zuoraPreview, previewSchedule, loadingPreview, preview, previewError} = usePreview()

    const dateOfEffect = formatDate(checkCurrentSchedule(subscription.schedule).data.date)

    const additions = updates.filter(update => update.type === "add").map(({id}) => id)
    const removals = updates.filter(update => update.type === "remove").map(({id}) => id)
    const addEmpty = R.isEmpty(additions)
    const removeEmpty = R.isEmpty(removals)
    const allEmpty = removeEmpty && addEmpty

    const matchedAdditionAddOns = addOnIds => {
        return addOnIds.map(addOnId => {
            return addOns.find(addOn => addOn.id === addOnId)
        })
    }

    const matchedRemovalAddOns = addOnIds => {
        return addOnIds.map(addOnId => {
            return subscription.addOns.find(addOn => addOn.id === addOnId)
        })
    }

    const applyOffer = () => {
        // check offer code
        // if valid, apply offer
        // else display error message
    }

    const handleSubmit = async () => {
        // if candidate texting has been previously purchased, then we do not need to collect additional info
        const ownedCandidateTexting = subscription.addOns.includes(addOn => addOn.data.products[0].path === "/products/Candidate Texting")
        const additionalInfoToCollect = matchedAdditionAddOns(additions).filter(addOn => addOn.data.products[0].path === "/products/Candidate Texting")
        if (!R.isEmpty(additionalInfoToCollect) && !ownedCandidateTexting) {
            setDialogOpen(true)
        } else {
            let order = buildOrder(subscription, updates)
            setSubmitting(true)
            await sendOrder(order)
            window.location.href = successLink
        }
    }

    React.useEffect(() => {
        if (additions.length === 0) {
            return
        }
        const order = buildOrder(subscription, updates)
        // default address recommended by zuora
        const previewBillingDetails = {state: "NY", postalCode: "10001", country: "US"}
        const previewOrderData = {
            ...order,
            billingDetails: previewBillingDetails
        }
        preview(previewOrderData, true)
    }, [updates, subscription])

    React.useEffect(() => {
        // if preview error then this never gets updated?
        if (zuoraPreview) {
            if (previewSchedule[0]?.lineItems?.length) {
                const currentSchedule = previewSchedule.find(s => new Date(s.date).getDay() === new Date().getDay())
                setAddOnsPrice(currentSchedule.lineItems)
            } else {
                setAddOnsPrice([])
                orderTotal.current = 0
            }
        }
    }, [zuoraPreview, loadingPreview])

    // match the Zuora products in the rpeview return to the correct add-on displayed in the ui
    // then interate that array to calculate the total
    const matchAddOnSchedule = (productName, returnNumber = false) => {
        let productToFind = productName
        if (productName === "Advanced Reporting") {
            productToFind = "Advanced Visual Reporting"
        }

        const schedule = addOnsPrice.find(addOn => normalizeString(addOn.productName) === normalizeString(productToFind))

        if (!schedule) {
            return <LoadingSpinner/>
        }

        if (returnNumber) return Number(schedule.amountWithoutTax)

        return formatCurrency(schedule.amountWithoutTax, "USD")
    }

    const orderTotal = () => {
        const matchedAddOns = matchedAdditionAddOns(additions)
        const total = matchedAddOns.reduce((acc, curr) => {
            const priceMatch = matchAddOnSchedule(stripPathToProductName(curr.data.products[0].path), true)
            if (priceMatch) {
                return acc + Number(priceMatch)
            } else {
                return acc
            }
        }, 0)
        return formatCurrency(total, "USD")
    }

    const getSecondPaymentDetails = () => {
        if (previewSchedule) {
            if (previewSchedule.length > 1) {
                const secondPayment = previewSchedule[1]
                return `Your next payment of ${formatCurrency(secondPayment.amountWithoutTax, "USD")} will be on ${formatDate(secondPayment.date)}`
            }

        }
    }

    const showPaymentDetails = () => {
        const activePaymentMethods = payment_methods.filter(paymentMethod => paymentMethod.status === "active")
        if (activePaymentMethods.length === 0) {
            return
        }
        const [activePaymentMethod] = activePaymentMethods.sort((a, b) => new Date(b.start) - new Date(a.start))

        const paymentMethodType = activePaymentMethod.type
        const paymentMethodData = R.path(["data", paymentMethodType, "result"], activePaymentMethod)
        const {CreditCardMaskNumber: creditCardMask, CreditCardType = ""} = paymentMethodData
        return `Charge to your ${CreditCardType} (${creditCardMask})`

    }

    return (
        <div className={"right-side"}>
            <h3>Your Changes </h3>
            {allEmpty ? (
                <div>
                    <Alert color={"primary"}>
                        <FontAwesomeIcon icon={faCircleInfo}/>
                        <p className={"inline pl-2"}>Add-ons purchased during your current billing cycle will be
                            adjusted on a prorated basis.</p>
                    </Alert>
                </div>
            ) : null}
            {!addEmpty ? (
                <>
                    <div>
                        <h5 className={"mt-4"}>You are adding: </h5>
                        <ul>
                            {matchedAdditionAddOns(additions).map(addOn => {
                                const productName = stripPathToProductName(addOn.data.products[0].path)
                                return (
                                    <li key={addOn.id} className={"list-style-none less-bold mt-4"}>
                                        <div className={"flex space-between"}>
                                            <h4>{productName}</h4>
                                            <p className={"mr-4"}>{matchAddOnSchedule(productName)}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <Alert color={"danger"} className={"mr-4"}>
                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                        <p className={"alert-color pl-2"}>Starting on {dateOfEffect}, you will be charged the full
                            amount for the selected add-on.</p>
                    </Alert>
                    <div className="row-border"/>
                </>
            ) : null}
            {!removeEmpty ? (
                <>
                    <div>
                        <h5>You are removing: </h5>
                        <ul>
                            {matchedRemovalAddOns(removals).map(addOn => {
                                return (
                                    <li key={addOn.id} className={"list-style-none less-bold mt-4"}>
                                        <div className={"flex space-between"}>
                                            <h4>{stripPathToProductName(addOn.data.add_on.data.products[0].path)}</h4>
                                            <p className={"mr-4"}>--</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <Alert color={"danger"} className={"mr-4"}>
                        <FontAwesomeIcon icon={faTriangleExclamation}/>
                        <p className={"alert-color pl-2"}>Your removed add-ons will take affect on {dateOfEffect}</p>
                    </Alert>
                    <div className="row-border"/>
                </>
            ) : null}
            {allEmpty ? <div className="row-border"/> : null}
            <div className="flex space-between mr-4">
                <label className="bold">Offer Code </label>
                {/* offer code input box for type text */}
                <div>
                    <input type="text" onChange={e => setOfferCode(e.target.value)} className={"offer-input"}/>
                    <button disabled onClick={() => applyOffer} className={"offer-btn"}>
                        Apply
                    </button>
                </div>
            </div>
            <div className={"flex space-between mr-4 mt-4"}>
                <div dangerouslySetInnerHTML={{__html: basketPayText}}/>
                <p>{addEmpty ? "--" : R.isEmpty(addOnsPrice) ? <LoadingSpinner/> : orderTotal()}</p>
            </div>
            {/* this shows total renewal price not the item being added. */}
            {/*<div className={"flex"}>*/}
            {/*    <div>*/}
            {/*        <p>{getSecondPaymentDetails()}</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={"flex place-end mr-4 checkout-btn"}>
                <button onClick={handleSubmit} className={"add-remove-btns add-btn cont-btn"} disabled={submitting}>
                    {continueWord}
                </button>
                <p>{payment_methods && payment_methods.length ? showPaymentDetails() : null}</p>
            </div>
            <section className={"description"} dangerouslySetInnerHTML={{__html: longTexts}}>
            </section>
            <DialogContainer open={dialogOpen} setOpen={setDialogOpen} order={buildOrder(subscription, updates)}
                             subscription={subscription}/>
        </div>
    )
}

export default EditAddOnsBasket
