// @flow
import * as React from "react"
import { useCampaign, useLimioContext, useSubscriptions } from "@limio/sdk"
import { filterOffer, isExpired, standardiseOfferPlan, standariseString, stripAdd_on_id } from "./helpers"
import * as R from "ramda"
import CustomiseAddOn from "./CustomiseAddOn"
import { usePreview } from "@limio/ui-preview-context"

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

function CustomiseAddOns({
  updates,
  handleAdd,
  handleFilter,
  handleRemove,
  handleQuantityChange,
  baseProduct,
  onlyShowPurchase,
  customiseAddOnTitle,
  cantFindCopy
}: Props): React.Node {
  const { subscriptions } = useSubscriptions()
  const { isInPageBuilder } = useLimioContext()
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
  const { loadingPreview } = usePreview()
  const { addOns } = useCampaign()

  const filteredSubscriptionAddOns = subscription.addOns.filter(isExpired)
  const subscribedAddOns = filteredSubscriptionAddOns.map(addOn => stripAdd_on_id(addOn.data?.add_on?.id))
  const activeOffers = subscription.offers.filter(offer => filterOffer(isInPageBuilder, offer.data.offer))
  const activeOffer = activeOffers[0]
  const billingPlanFromOffer =
    R.pathOr(false, ["data", "offer", "data", "attributes", "billing_plan", "0"], activeOffer) || (isInPageBuilder ? "monthly" : undefined) // data.offer.data.attributes.billing_plan[0]
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

    const removals = updates.filter(update => update.type === "remove").map(({ id }) => id)
    const additions = updates.filter(update => update.type === "add").map(({ id }) => id)

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

    if (isOwned) {
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
        const owned = checkIfOwned(addOn)
        if (owned.props.id.startsWith("subscription") && onlyShowPurchase) {
          const additions = updates.filter(update => update.type === "add").map(({ id }) => id)
          const inAdditions = additions.includes(addOn.id)
          if (!inAdditions) return <></>
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
        <div className={"flex col ml-2r text-left"} dangerouslySetInnerHTML={{ __html: cantFindCopy }} />
      </div>
    </>
  )
}

export default CustomiseAddOns
