// @flow
// import { stateList } from "@limio/sdk"
import { DateTime } from "@limio/date"

export const getStateName = (state, country) => {
  let stateName = state

  if (["US", "CA"].includes(country)) {
    const states = stateList.find(countryData => countryData["alpha-2"] === country)?.states
    stateName = states?.find(stateObject => stateObject["alpha-2"] === state)?.name
  }

  return stateName
}

export const stripPathToProductName = (path: string): string => {
  // "/products/Hero Plan" => "Hero Plan")
  if (typeof path !== "string") {
    return console.log(path, "is not a string")
  }
  return path.split("/").pop()
}

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

export function checkCurrentSchedule(schedules = [], allowCancelled?) {
  const activeSchedules = allowCancelled ? schedules : schedules.filter(x => ["active", "pending", "pending-external"].includes(x.status))
  const currentDate = DateTime.utc().toISO()

  const sortedSchedules = activeSchedules.sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  let nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate && ["active", "pending", "pending-external"].includes(schedule.status))

  if (!nextSchedule && allowCancelled) {
    nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate)
  }

  return nextSchedule
}

export function formatDate(dateStr) {
  return DateTime.fromISO(dateStr).toFormat("yyyy/MM/dd")
}

export function checkActiveOffers(offers: LimioObject<Offer>[] = [], includeFuture: boolean = false): LimioObject<Offer>[] {
  const sortedOffers = offers.sort((a, b) => new Date(a.data.start) - new Date(b.data.start))
  const currentDate = DateTime.utc().toISO()
  // currentDate takes in the current date and time i.e. 2021-12-15T22:42:08.588Z
  let currentActiveOffers = sortedOffers.filter(relatedOffer => !relatedOffer.data?.end || DateTime.fromISO(relatedOffer.data?.end).toString() >= currentDate)
  //The end date is currently in the format 2021-12-15
  //Its a current active offer if there is no end date in the offer data or the currentDate is > or = to the end date (2021-12-15T00:00:00.000+00:00)

  if (!includeFuture) {
    currentActiveOffers = currentActiveOffers.filter(relatedOffer => relatedOffer.data?.start <= currentDate) // Offer might be future dated for next term etc.
  }

  return currentActiveOffers
}
