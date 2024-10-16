// // @flow
import * as React from "react"
import * as R from "ramda"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import { checkActiveSubscriptionOffer, emptyOrNil, formatCurrency } from "./helpers"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { LoadingSpinner } from "@limio/design-system"
import { v4 as uuid } from "uuid"
import { DateTime } from "@limio/date"
import { usePreview } from "@limio/ui-preview-context"
import PlanAndPricing from "./PlanAndPricing"
import PaymentMethodDeatils from "./PaymentMethodDetails"

type Props = {
  successLink: string,
  selectedOffer: string,
  quantity: string,
  yourPlanTitle: string,
  toPayText: string,
  longTexts: string,
  yourNewPlanCopy: string,
  yourOldPlanCopy: string
}

const buildOrder = (
  subscription,
  selectedOfferObj,
  date,
  matchingAddOns = [],
  currentOffer,
  matchedAddOnsToReadd = [],
  selectedQuantity = 1
) => {
  let removeAddOns = []
  let addAddOns = []

  if (!R.isEmpty(matchingAddOns)) {
    removeAddOns = matchingAddOns.map(addOn => {
      return {
        type: "remove",
        quantity: 1,
        id: addOn.id,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on"
      }
    })
  }

  if (!R.isEmpty(matchedAddOnsToReadd)) {
    addAddOns = matchingAddOns
      .map(addOn => {
        // to readd should be subscription add ons
        // so we can say that the record type should start with subscription_add_on
        if (addOn.record_type.startsWith("subscription_add_on")) {
          return {
            type: "add",
            quantity: 1,
            id: addOn.data.add_on.id,
            version: addOn.data.add_on.version,
            effective_date: DateTime.local().toISODate(),
            record_type: "add_on"
          }
        } else {
          console.error("Add on record type is not subscription_add_on", addOn)
        }
      })
      .filter(Boolean)
  }

  return {
    order_type: "update_subscription",
    forSubscription: {
      name: subscription.name
    },
    updates: [
      {
        type: "add",
        quantity: selectedQuantity,
        id: selectedOfferObj.id,
        version: selectedOfferObj.version,
        effective_date: DateTime.local().toISODate(),
        record_type: "offer"
      },
      {
        type: "remove",
        quantity: subscription.data.quantity,
        // this line needs to be the offers object in the array so like
        // subscription_offer-id
        id: currentOffer.id,
        effective_date: DateTime.local().toISODate(),
        record_type: "offer"
      },
      ...removeAddOns,
      ...addAddOns
    ],
    owner: subscription.owner,
    external_id: uuid(),
    source: "online",
    process_immediately: true
  }
}

const isExpired = addOn => {
  return addOn.data.end !== undefined && DateTime.fromISO(addOn.data.end).toFormat("yyyy-MM-dd") <= DateTime.local().toISODate()
}

const getEntitlementsFromAddOn = addOn => addOn.data.add_on?.data.products[0].entitlements?.map(e => e.$ref) ?? []

function EditBasePlanBasket({
  selectedOffer,
  quantity,
  yourPlanTitle,
  toPayText,
  longTexts,
  successLink,
  continueButtonText,
  yourOldPlanCopy,
  yourNewPlanCopy
}: Props): React.Node {
  const { subscriptions = [] } = useSubscriptions()
  // get the subId query string param and find the sub.id that matches
  // otherwise return the first in the list
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]

  const { offers = [], addOns } = useCampaign()
  const [_, setOfferCode] = React.useState("")
  const [price, setPrice] = React.useState({})
  const [submitting, setSubmitting] = React.useState(false)
  const currentOffer = checkActiveSubscriptionOffer(subscription.offers)

  const { zuoraPreview, previewSchedule, preview } = usePreview()

  const selectedOfferObj = React.useMemo(() => offers.find(offer => offer.id === selectedOffer), [offers, selectedOffer])

  // logic to determine which add ons to be removed from a subscription update
  // when the base plan is changed

  const ownedAddOns = subscription.addOns.filter(addOn => addOn.status === "active" && !isExpired(addOn))

  // all entitlements from owned add ons
  const subscribedToAddOns = React.useMemo(() => ownedAddOns.map(getEntitlementsFromAddOn).flat(), [ownedAddOns])

  // all entitlements from selected offer
  const selectedOfferEntitlements = React.useMemo(
    () => selectedOfferObj?.data.products[0].entitlements?.map(entitlement => entitlement.$ref) ?? [],
    [selectedOfferObj]
  )

  // entitlements that are in both the selected offer and the owned add ons are
  // the ones that will be removed
  const entitlementsToRemove = React.useMemo(
    () => selectedOfferEntitlements.filter(entitlement => subscribedToAddOns.includes(entitlement)),
    [selectedOfferEntitlements, subscribedToAddOns]
  )

  // match the add ons with the entitlements to be removed
  const matchAddOnsWithEntitlements = (addOns, entitlements) => {
    const result = {
      toRemove: [],
      toReAdd: []
    }

    if (entitlements.length === 0) {
      result.toReAdd = addOns
      return result
    }

    addOns.forEach(addOn => {
      const addOnEntitlements = getEntitlementsFromAddOn(addOn)
      const hasMatchingEntitlement = addOnEntitlements.some(entitlement => entitlements.includes(entitlement))

      if (hasMatchingEntitlement) {
        result.toRemove.push(addOn)
      } else {
        result.toReAdd.push(addOn)
      }
    })

    return result
  }

  const handleSubmit = async () => {
    // first we get the add ons that are included in the offer entitlements ->
    // these are clean removals then we get the add ons that are not included
    // in the offer entitlements -> these are add ons that need to be readded

    const { toRemove: matchedRemovals, toReAdd: matchedReAdds } = matchAddOnsWithEntitlements(ownedAddOns, entitlementsToRemove)

    const matchedReAddProduct = matchedReAdds.map(addOn => addOn.data.add_on.data.products[0].path)

    const matchedAddOnsToReadd = addOns.filter(
      addOn =>
        matchedReAddProduct.includes(addOn.data.products[0].path) &&
        selectedOfferObj.data.attributes.billing_plan[0] === addOn.data.attributes.billing_option[0]
    )

    const order = buildOrder(
      subscription,
      selectedOfferObj,
      new Date(),
      [...matchedReAdds, ...matchedRemovals],
      currentOffer,
      matchedAddOnsToReadd,
      quantity
    )

    setSubmitting(true)
    await sendOrder(order)
    window.location.href = successLink
  }

  const getPreview = () => {
    // preview ignores effects of addons changing so just send empty array -
    // the resolution process is a bit annoying
    const order = buildOrder(subscription, selectedOfferObj, new Date(), [], currentOffer, [], quantity)

    const previewOrderData = {
      ...order,
      billingDetails: {
        state: "NY",
        postalCode: "10001",
        country: "US"
      }
    }
    preview(previewOrderData, true)
  }

  React.useEffect(() => {
    setPrice({})
    getPreview()
  }, [selectedOfferObj, quantity])

  React.useEffect(() => {
    if (!R.isNil(zuoraPreview) && !R.isEmpty(previewSchedule)) {
      const lineItems = previewSchedule[0].lineItems
      const removeSchedule = lineItems.find(item => item.amountWithoutTax < 0)
      const addSchedule = lineItems.find(item => item.amountWithoutTax > 0)
      setPrice({ remove: removeSchedule, add: addSchedule })
    }
  }, [zuoraPreview, previewSchedule])

  return (
    <div className={"right-side"}>
      <h3 className={"mb-2 pb-2"}>{yourPlanTitle}</h3>
      <PlanAndPricing
        selectedOfferObj={selectedOfferObj}
        price={price}
        yourNewPlanCopy={yourNewPlanCopy}
        yourOldPlanCopy={yourOldPlanCopy}
        currentOffer={currentOffer}
      />
      <div className="flex space-between mr-4 mt-2">
        <label className="bold">Offer Code </label>
        <div>
          <input type="text" onChange={e => setOfferCode(e.target.value)} className={"offer-input"} />
          <button disabled className={"offer-btn"}>
            APPLY
          </button>
        </div>
      </div>
      <div className="row-border" />
      <div className={"flex space-between mr-4 mt-4"}>
        <div className={"less-bold"} dangerouslySetInnerHTML={{ __html: toPayText }} />
        <p>
          {!emptyOrNil(price.add) && !emptyOrNil(price.remove) ? (
            formatCurrency(Number(price.add.amountWithoutTax) + Number(price.remove.amountWithoutTax), "USD")
          ) : (
            <LoadingSpinner />
          )}
        </p>
      </div>
      <div className={"flex place-end mr-4 checkout-btn"}>
        <button onClick={handleSubmit} className={"add-remove-btns add-btn cont-btn "} disabled={submitting}>
          {continueButtonText}
        </button>
        <PaymentMethodDeatils />
      </div>

      <section className={"description"} dangerouslySetInnerHTML={{ __html: longTexts }}></section>
    </div>
  )
}

export default EditBasePlanBasket
