// @flow

import * as R from "ramda"

export const standariseString = str => {
  return str.replace(/\s+/g, "-").toLowerCase()
}

export const stripAdd_on_id = s => (s.startsWith("add_on-") ? s.slice("add_on-".length) : s)

export const stripHTMLtags = (str: string): string => {
  let removedTags = str.replace(/(<([^>]+)*>)/gi, "")
  removedTags = removedTags.replace(/&nbsp;/gi, " ")
  return removedTags
}
export const getStrippedProductName = obj => stripPathToProductName(obj.data.products[0].path)

export const stripPathToProductName = (path: string): string => {
  // "/products/Hero Plan" => "Hero Plan")
  if (typeof path !== "string") {
    return console.log(path, "is not a string")
  }
  return path.split("/").pop()
}

export const formatDate = date => {
  if (date === "N/A") return date

  const dateObj = new Date(date)
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0") // Months are 0-based, so +1 is needed.
  const dd = String(dateObj.getDate()).padStart(2, "0")
  const yyyy = dateObj.getFullYear()

  return `${mm}/${dd}/${yyyy}`
}

export const getLatestScheduleDate = schedules => {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return null // or throw an error if appropriate
  }

  const sortedSchedules = schedules.sort((a, b) => {
    const dateA = new Date(a.data.schedule_date)
    const dateB = new Date(b.data.schedule_date)
    return dateB - dateA // sort in descending order
  })

  return sortedSchedules[0].data.schedule_date
}

export const getLastScheduleDate = shceudles => {
  if (!Array.isArray(shceudles) || shceudles.length === 0) {
    return null // or throw an error if appropriate
  }

  const sortedSchedules = shceudles.sort((a, b) => {
    const dateA = new Date(a.data.schedule_date)
    const dateB = new Date(b.data.schedule_date)
    return dateA - dateB // sort in ascending order
  })

  return sortedSchedules[0].data.schedule_date
}

export const planChangeStatus = (currentPlan, newPlan) => {
  const plans = {
    "Hero Plan": 1, // Base level
    "Plus Plan": 2, // Mid level
    "Pro Plan": 3 // Top level
  }

  const strippedCurrentPlan = stripPathToProductName(currentPlan)

  const currentPlanLevel = plans[strippedCurrentPlan]
  const newPlanLevel = plans[newPlan]

  if (newPlanLevel < currentPlanLevel) {
    return "downgrade"
  } else if (newPlanLevel > currentPlanLevel) {
    return "upgrade"
  } else {
    return "no change" // In case the new plan is the same as the current
  }
}

export const checkActiveSubscriptionOffer = offersList => {
  let currentActiveOffer = offersList.filter(offer => !offer.data?.end)
  return currentActiveOffer[0]
}

export const matchPartialString = (sourceStr, targetStr) => {
  let basePlanMatch = sourceStr.match(/^(.*?)(?: -|$)/)
  if (!basePlanMatch) {
    return null // No match found in the description
  }
  let basePlan = basePlanMatch[1].trim()
  return basePlan === targetStr
}

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

export const emptyOrNil = R.either(R.isEmpty, R.isNil)

export const groupPath = offer => {
  const product = offer.data.products[0]
  const path = R.pathOr(product, ["path"], product)
  return path
}
