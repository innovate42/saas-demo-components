// @flow

import * as R from "ramda"

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

export const checkActiveSubscriptionOffer = offersList => {
  let currentActiveOffer = offersList.filter(offer => !offer.data?.end)
  return currentActiveOffer[0]
}

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency
    }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

export const emptyOrNil = R.either(R.isEmpty, R.isNil)

export const groupPath = offer => {
  const product = offer.data.products[0]
  return R.pathOr(product, ["path"], product)
}

export const toDays = obj => {
  switch (obj.type) {
    case "years":
      return obj.length * 365
    case "months":
      return obj.length * 30
    case "days":
      return obj.length
    default:
      return 0
  }
}

export const formatTerm = term => {
  const { length, type } = term
  switch (type) {
    case "years":
      if (length === 1) return "1 Year Agreement"
      if (length === 2) return "2 Year Agreement"
      if (length === 3) return "3 Year Agreement"
      return `${length} ${type}`
    case "months":
      return "Month-to-Month"
    default:
      return `${length} ${type}`
  }
}
