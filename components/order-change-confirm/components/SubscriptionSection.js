// @flow
import * as React from "react"
import { useSubscriptions } from "@limio/sdk"
import { DateTime } from "@limio/date"
import * as R from "ramda"

type Props = {
  email: string
}

function checkCurrentSchedule(schedules = [], allowCancelled?: boolean) {
  const activeSchedules = allowCancelled ? schedules : schedules.filter(x => ["active", "pending", "pending-external"].includes(x.status))
  const currentDate = DateTime.utc().toISO()

  const sortedSchedules = activeSchedules.sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  let nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate && ["active", "pending", "pending-external"].includes(schedule.status))

  if (!nextSchedule && allowCancelled) {
    nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate)
  }

  return nextSchedule
}

const stripPathToProductName = (path: string): string => {
  // "/products/Hero Plan" => "Hero Plan")
  if (typeof path !== "string") {
    return console.log(path, "is not a string")
  }
  return path.split("/").pop()
}

function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

const displayDate = date => DateTime.fromISO(date).toFormat("MM/dd/yyyy")

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

function mapTermObjectToDisplayStr(termObj: LimioTermObject): string {
  if (termObj === null) {
    return ""
  }
  const { length, type } = termObj
  if (type === "months") {
    return `${length} month${length > 1 ? "s" : ""}`
  }
  if (type === "years") {
    return `${length} year${length > 1 ? "s" : ""}`
  }
  return `${length} ${type}`
}

function getActiveOffer(subscriptions) {
  // check if window is saas-dev.prod.limio.com and if so return [0].offers[0]
  let activeOffer
  try {
    if (subscriptions.length > 1) {
      activeOffer = subscriptions.sort((a, b) => new Date(b.created) - new Date(a.created))[0].offer
    } else {
      const offers = subscriptions[0].offers
      if (offers.length > 1) {
        activeOffer = offers.sort((a, b) => new Date(b.created) - new Date(a.created))[0]
      } else {
        activeOffer = offers[0]
      }
    }
  } catch (e) {
    // not really sure what this is doing just leaving here to test the components
    const subscription = subscriptions[0]
    activeOffer = subscription.sort((a, b) => new Date(b.created) - new Date(a.created))[0].offer
  }

  return activeOffer
}

function SubscriptionSection(): React.Node {
  const { subscriptions } = useSubscriptions()
  const subscription = subscriptions[0]

  // get active offer from offers array
  // const activeOffer = subscription.offers.find(offer => offer.data.end === undefined || offer.data.end > DateTime.local().toISODate())
  // get the latest created offer from offers array
  const activeOffer = getActiveOffer(subscriptions)
  const product = stripPathToProductName(activeOffer.data.offer.data.products[0].path)
  const billingPlan = activeOffer.data.offer.data.productBundles[0].rate_plan
  const termObj = activeOffer.data.offer.data.attributes.term__limio
  const addOns = subscription.addOns.filter(isExpired)
  const addOnsProductName = addOns.map(addOn => stripPathToProductName(addOn.data.add_on.data.products[0].path))

  const addOnList = addOnsProductName.length
    ? addOnsProductName.map((addOn, index) => {
        return (
          <li key={index} className={"li-no"}>
            {addOn}
          </li>
        )
      })
    : "N/A"
  const schedule = checkCurrentSchedule(subscription.schedule)

  const price = formatCurrency(schedule.data.amountWithoutTax, schedule.data.currency)
  const paymentDate = displayDate(schedule.data.date)

  return (
    <section>
      <h5 className={"px-18"}>Your Subscription</h5>
      <table className={"styled-table"}>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Billing Plan</th>
            <th>Billing Frequency</th>
            <th>Add-Ons</th>
            <th>Price</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product}</td>
            <td>{billingPlan}</td>
            <td>{mapTermObjectToDisplayStr(termObj)}</td>
            <td>{addOnList}</td>
            <td>{price}</td>
            <td>{paymentDate}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default SubscriptionSection
