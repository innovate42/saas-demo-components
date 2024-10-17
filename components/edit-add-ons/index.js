// @flow
import * as React from "react"
import StaticSection from "./components/StaticSection"
import CustomiseAddOns from "./components/CustomiseAddOns"
import EditAddOnsBasket from "./components/EditAddOnsBasket"
import { DateTime } from "@limio/date"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import "./index.css"
import { PreviewProvider } from "@limio/ui-preview-context"
import { findNextScheduleDate, mapTermObjectToDisplayStr, stripPathToProductName } from "./components/helpers"

type Props = {
  onlyShowPurchase: boolean,
  title: string,
  cantFindCopy: string,
  basketPayText: string,
  longTexts: string,
  continueWord: string,
  successLink: string
}

function EditAddOns({
  onlyShowPurchase,
  title,
  customiseAddOnTitle,
  cantFindCopy,
  basketPayText,
  longTexts,
  continueWord,
  successLink
}: Props): React.Node {
  const [updates, setUpdates] = React.useState([])
  const { addOns } = useCampaign()

  const { subscriptions } = useSubscriptions()
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]

  const activeOffer = subscription.offers.find(offer => offer.data.end === undefined || offer.data.end > DateTime.local().toISODate())
  const billingPlan = activeOffer.data.offer.data.productBundles[0].rate_plan
  const termObject = activeOffer.data.offer.data.attributes.term__limio

  const term = mapTermObjectToDisplayStr(termObject)
  const baseProductWithPlanSuffix = stripPathToProductName(activeOffer.data.offer.data.products[0].path)
  const baseProduct = baseProductWithPlanSuffix.split(" ")[0]
  const subName = activeOffer.data.name ?? stripPathToProductName(activeOffer.data.offer.data.products[0].path) ?? "No name"
  const nextScheduleDate = React.useMemo(() => findNextScheduleDate(subscription.schedule), [subscription.schedule])

  const handleAdd = event => {
    setUpdates([
      ...updates,
      {
        type: "add",
        quantity: event.currentTarget.dataset.quantity,
        id: event.target.id,
        version: event.currentTarget.dataset.version,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on"
      }
    ])
  }

  const handleRemove = event => {
    setUpdates([
      ...updates,
      {
        type: "remove",
        quantity: event.currentTarget.dataset.quantity,
        id: event.target.id,
        effective_date: nextScheduleDate,
        record_type: "add_on"
      }
    ])
  }

  const handleFilter = event => {
    setUpdates(updates.filter(update => update.id !== event.target.id))
  }

  const handleQuantityChange = event => {
    // handles a change to an add on if it is owned
    if (!updates.find(update => update.id === event.target.id)) {
      const addOnIds = addOns.map(addOn => addOn.id)
      if (addOnIds.includes(event.target.id)) {
        setUpdates([
          ...updates,
          {
            type: "add",
            quantity: event.target.value,
            id: event.target.id,
            effective_date: DateTime.local().toISODate(),
            record_type: "add_on",
            version: event.currentTarget.dataset.version
          }
        ])
        return
      }
      setUpdates([
        ...updates,
        {
          type: "update",
          quantity: event.target.value,
          id: event.target.id,
          effective_date: DateTime.local().toISODate(),
          record_type: "add_on"
        }
      ])
      return
    }
    // if add on owned remove update if quantity is same as owned quantity to handle changing around
    if (event.target.value === event.currentTarget.dataset.original) {
      setUpdates(updates.filter(update => update.id !== event.target.id))
      return
    }
    // handles an update in basket for a new add on purchase and if the subscription add on is not in updates
    setUpdates(
      updates.map(update => {
        return update.id === event.target.id ? { ...update, quantity: event.target.value } : update
      })
    )
  }

  return (
    <PreviewProvider>
      <div className={"grey m-all prlb-2 h-100"}>
        <div className="plan-page">
          <div className="left-side-plan-page border-pp">
            {/* column 1 */}
            <h2 className="grid-stretch text-left">{title}</h2>
            <StaticSection label={"Your Plan"} content={subName} />
            <StaticSection label={"Billing Plan"} content={billingPlan} />
            <StaticSection label={"Billing Frequency"} content={term} />
            <div className={"grid-stretch"}>
              <CustomiseAddOns
                cantFindCopy={cantFindCopy}
                customiseAddOnTitle={customiseAddOnTitle}
                onlyShowPurchase={onlyShowPurchase}
                updates={updates}
                handleRemove={handleRemove}
                handleAdd={handleAdd}
                handleFilter={handleFilter}
                billingPlan={billingPlan}
                handleQuantityChange={handleQuantityChange}
                baseProduct={baseProduct}
              />
            </div>
          </div>
          {/* column 2 */}
          <EditAddOnsBasket
            updates={updates}
            basketPayText={basketPayText}
            longTexts={longTexts}
            continueWord={continueWord}
            successLink={successLink}
          />
        </div>
      </div>
    </PreviewProvider>
  )
}

export default EditAddOns
