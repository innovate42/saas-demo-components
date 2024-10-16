//@flow
import * as R from "ramda"
import React from "react";

export const stripPathToProductName = (path: string): string => {
  //"/products/Hero Plan" => "Hero Plan")
  return path.split("/").pop()
}

export const stripHTMLtags = (str: string): string => {
  let removedTags = str.replace(/(<([^>]+)*>)/gi, "")
  removedTags = removedTags.replace(/&nbsp;/gi, " ")
  return removedTags
}

export const groupPath = offer => {
  const product = offer.data.products[0]
  const path = R.pathOr(product, ["path"], product)
  return path
}

// this is a bit of a hack to make sure that the memoization works as i need it to
export function useDeepCompareMemoize(value) {
  const ref = React.useRef()

  if (!R.equals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export const standardiseString = str => str.split(" ")[0].toLowerCase().replace(/\s/g, "")

export const getStrippedProductName = obj => stripPathToProductName(obj.data.products[0].path)

export const normaliseString = str => str.replace(/[^a-z0-9]/gi, "").toLowerCase()

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
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

export const formatTerm = (term, termLabels) => {
  const {
    monthlyTermLabel = "Month to Month",
    oneYearTermLabel = "1 Year Agreement",
    twoYearTermLabel = "2 Year Agreement",
    threeYearTermLabel = "3 Year Agreement"
  } = termLabels

  const { length, type } = term
  switch (type) {
    case "years":
      if (length === 1) return oneYearTermLabel
      if (length === 2) return twoYearTermLabel
      if (length === 3) return threeYearTermLabel
      return `${length} ${type}`
    case "months":
      return monthlyTermLabel
    default:
      return `${length} ${type}`
  }
}

