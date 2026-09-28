const STANDALONE_ATTRIBUTE = "standalone_in_basket"

type Product = { attributes?: Record<string, unknown> }

export type BasketItem = {
  id: string
  name?: string
  parentId?: string
  offer?: {
    name?: string
    data?: {
      attributes?: { display_name__limio?: string }
      products?: Product[]
    }
  }
}

export function isStandalone(item: BasketItem): boolean {
  return (item?.offer?.data?.products || []).some((product) => product?.attributes?.[STANDALONE_ATTRIBUTE] === true)
}

/**
 * Returns the parent items to remove so that only the last-added parent stays,
 * or an empty list when no stand-alone product is in the basket.
 * The basket appends on add, so the last parent in the array is the newest.
 */
export function getItemsToRemove(orderItems: BasketItem[]): BasketItem[] {
  const parents = orderItems.filter((item) => !item?.parentId)
  if (parents.length < 2 || !parents.some(isStandalone)) return []

  const keep = parents[parents.length - 1]
  return parents.filter((item) => item.id !== keep.id)
}

// Add-ons are not removed with their parent server side (see orphaned-addon-cleaner)
export function getChildren(orderItems: BasketItem[], parent: BasketItem): BasketItem[] {
  return orderItems.filter((item) => item?.parentId === parent.id)
}

// Same label as the floating cart: "<product> - <offer>", e.g. "Essentials - Billed Annually"
export function getItemLabel(item: BasketItem): string {
  const productName = item?.offer?.data?.products?.[0]?.attributes?.display_name__limio
  const offerName = item?.offer?.data?.attributes?.display_name__limio || item?.name
  const label = [productName, offerName].filter(Boolean).join(" - ")
  return label || item?.offer?.name || ""
}

function escapeHTML(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export function formatNotice(template: string, labels: string[]): string {
  return template.split("{{items}}").join(escapeHTML(labels.join(", ")))
}
