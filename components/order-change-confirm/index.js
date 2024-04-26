// @flow
import * as React from "react"
import "./index.css"
import { Button } from "@limio/design-system"
import SubscriptionSection from "./components/SubscriptionSection"
import { useSubscriptions, useUser } from "@limio/sdk"
import { DateTime } from "@limio/date"
import * as R from "ramda"

type Props = {
  buttonLink: string
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

const datesAreOnSameDay = (first, second) => {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate()
}

function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

function formatDate(dateStr) {
  return DateTime.fromISO(dateStr).toFormat("yyyy/MM/dd")
}

function checkPayment(schedules = []) {
  // Get today's date for comparison
  const today = DateTime.fromISO(new Date().toISOString())

  const activeSchedules = schedules.filter(schedule => {
    // Check if the schedule status is one of the specified statuses
    const isActiveStatus = ["active", "pending", "pending-external"].includes(schedule.status)
    // Parse the date from the schedule and compare it with today's date
    const scheduleDate = DateTime.fromISO(schedule.data.date)
    const isToday = scheduleDate.day === today.day && scheduleDate.month === today.month && scheduleDate.year === today.year

    // Return true if both conditions are met
    return isActiveStatus && isToday
  })

  return activeSchedules
}

function OrderChangeConfirm({ buttonLink }: Props): React.Node {
  const { subscriptions } = useSubscriptions()
  const { user } = useUser()

  const email = R.pathOr("No email stored in the user data", ["data", "email"], user)
  const subscription = subscriptions[0]
  const { schedule } = subscription

  const todaySchedules = checkPayment(schedule)

  const priceToday = todaySchedules.reduce((acc, schedule) => {
    acc = acc + +schedule.data.amountWithoutTax
    return acc
  }, 0)

  const currency = schedule[0].data.currency

  const nextSchedule = checkCurrentSchedule(schedule)

  const handleClick = () => (window.location.href = buttonLink || "/billing")

  return (
    <div className={"h-100 bg-grey"}>
      <div className={"flex center justify-center"}>
        {/*thanks section*/}
        <div className={"bg-white w-100 m-all-2 flex col text-center"}>
          <section className={"mb-6 mt-4"}>
            <h1>You have changed your subscription.</h1>
            {priceToday > 0 ? (
              <section>
                <p>You will be charged {formatCurrency(priceToday, currency)} today</p>
                {!R.isNil(nextSchedule) ? (
                  <p>
                    Your next payment of {formatCurrency(nextSchedule.data.amountWithoutTax, currency)} will be taken on your next renewal date of{" "}
                    {formatDate(nextSchedule.data.date)}
                  </p>
                ) : null}
              </section>
            ) : !R.isNil(nextSchedule) ? (
              <p>You will not be charged today. Your changes will take affect on your next billing cycle date of {formatDate(nextSchedule.data.date)}</p>
            ) : null}

            <p>A confirmation email has been sent {email}.</p>
            <Button onClick={handleClick} className={"button"}>
              GO TO MY ACCOUNT
            </Button>
          </section>
          {/* subscription summary section     */}
          <SubscriptionSection email={email} />
        </div>
      </div>
    </div>
  )
}

export default OrderChangeConfirm
