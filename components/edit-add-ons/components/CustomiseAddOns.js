// @flow
import * as React from "react"
import {useCampaign, useLimioContext, useSubscriptions} from "@limio/sdk"
import {standariseString, stripAdd_on_id} from "./helpers"
import {DateTime} from "@limio/date"
import * as R from "ramda"
import CustomiseAddOn from "./CustomiseAddOn"
import {usePreview} from "@limio/ui-preview-context"

type Props = {
    updates: Array<{ id: string, type: string }>,
    handleAdd: Function,
    handleFilter: Function,
    handleRemove: Function,
    billingPlan: string,
    handleQuantityChange: Function,
    baseProduct: string,
    onlyShowPurchase: boolean
}

// returns not expired add ons or cancelled
const isExpired = addOn => {
    const hasEnd = R.pathOr(false, ["data", "end"], addOn)
    if (hasEnd) {
        const now = DateTime.local()
        const dateToCheck = DateTime.fromISO(hasEnd)
        return dateToCheck > now
    } else {
        return true
    }
}

const standardiseOfferPlan = billingPlan => {
    if (billingPlan.includes(" ")) return standariseString(billingPlan.split(" ")[0])
    return standariseString(billingPlan)
}

const filterOffer = (pageBuilder, offer) => {
    // if pagebuilder is true then
    if (pageBuilder) return offer.status === "active" || offer.status === undefined
    return offer.status === "active"
}

function CustomiseAddOns({
                             updates,
                             handleAdd,
                             handleFilter,
                             handleRemove,
                             billingPlan,
                             handleQuantityChange,
                             baseProduct,
                             onlyShowPurchase,
                             customiseAddOnTitle,
                             cantFindCopy
                         }: Props): React.Node {
    const {subscriptions} = useSubscriptions() // returns a subscription[]
    const {isInPageBuilder} = useLimioContext();
    const subscription = subscriptions[0]
    const {loadingPreview} = usePreview()

    const {offers = [], addOns: addOnsFromCampaign} = useCampaign()
    let addOns
    if (Array.isArray(addOnsFromCampaign)) {
        addOns = addOnsFromCampaign
    } else {
        addOns = addOnsFromCampaign === null || addOnsFromCampaign === undefined ? [] : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign))
    }
    const filteredSubscriptionAddOns = subscription.addOns.filter(isExpired)
    const subscribedAddOns = filteredSubscriptionAddOns.map(addOn => stripAdd_on_id(addOn.data?.add_on?.id))
    const activeOffers = subscription.offers.filter(offer => filterOffer(isInPageBuilder, offer.data.offer))
    const activeOffer = activeOffers[0]
    const billingPlanFromOffer = R.pathOr(false, ["data", "offer", "data", "attributes", "billing_plan", "0"], activeOffer) || isInPageBuilder ? "monthly" : undefined

    const filteredBillingPlanAddOns = addOns.filter(addOn =>
        standardiseOfferPlan(billingPlanFromOffer).includes(standariseString(addOn.data.attributes.billing_option[0]))
    )

    const checkIfOwned = addOn => {
        let isOwned
        let inUpdates
        let subscriptionAddOn
        let addAction = handleAdd
        let removeAction = handleRemove

        const quantities = R.pathOr([1], ["data", "attributes", "quantities"], addOn)
        let quantity = Math.min(...quantities)

        const removals = updates.filter(update => update.type === "remove").map(({id}) => id)
        const additions = updates.filter(update => update.type === "add").map(({id}) => id)

        if (subscribedAddOns.some(sub => sub === addOn.id)) {
            const subscribedToAddOnId = subscribedAddOns.find(subscribedAddOn => subscribedAddOn === addOn.id)
            subscriptionAddOn = subscription.addOns.find(addOn => stripAdd_on_id(addOn.data.add_on.id) === subscribedToAddOnId)
            quantity = subscriptionAddOn.data.quantity
            isOwned = true
            if (removals.includes(subscriptionAddOn.id)) {
                addAction = handleFilter
                isOwned = false
                inUpdates = true
            }
        } else {
            isOwned = false
            if (additions.includes(addOn.id)) {
                removeAction = handleFilter
                isOwned = true
                inUpdates = true
            }
        }

        if (isOwned || onlyShowPurchase) {
            return (
                <button
                    onClick={removeAction}
                    id={inUpdates ? addOn.id : subscriptionAddOn.id}
                    className={"remove-btn add-remove-btns w-full"}
                    data-quantity={quantity}
                    disabled={loadingPreview}
                >
                    REMOVE
                </button>
            )
        } else {
            return (
                <button
                    onClick={addAction}
                    id={inUpdates ? subscriptionAddOn.id : addOn.id}
                    data-version={inUpdates ? "" : addOn.version}
                    data-quantity={quantity}
                    className={"add-btn add-remove-btns w-full"}
                    disabled={loadingPreview}
                >
                    ADD
                </button>
            )
        }
    }

    return (
        <>
            <p className={"plan-title"}>{customiseAddOnTitle}</p>
            {filteredBillingPlanAddOns.map(addOn => {
                // filter specifc add ons out if owned already
                // match the add on with subscription add on and check if it has an attribute saying dont allow remove
                // if yes return if no render
                const owned = checkIfOwned(addOn)
                // if the addon is marked as incompatible with the base product, don't render it
                // if the addon has base then render
                const compatibleWith = addOn.data.attributes.compatible_products
                const addOnIncompatible = !addOn.data.attributes.compatible_products.includes(standariseString(baseProduct))
                if (!compatibleWith.includes("base")) {
                    // added a flag to check ownership in case the subscription has ownership of the add on so they still can remove it
                    // could change this to return a please contact us about this text
                    if (addOnIncompatible && owned.props.children !== "REMOVE") {
                        return null
                    }
                }
                return (
                    <CustomiseAddOn
                        addOn={addOn}
                        owned={owned}
                        key={addOn.id}
                        updates={updates}
                        handleQuantityChange={handleQuantityChange}
                        subscribedAddOns={subscribedAddOns}
                    />
                )
            })}
            <div className={"flex center mb-20 border-add-on yellow yellow-border"}>
                <div className={"flex col ml-2r text-left"} dangerouslySetInnerHTML={{__html: cantFindCopy }}>
                  
                </div>
            </div>
        </>
    )
}

export default CustomiseAddOns
