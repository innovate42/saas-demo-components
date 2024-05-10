//@flow
import * as R from "ramda"

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
