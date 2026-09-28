import * as R from "ramda"
interface Offer {
  path: string
  data: {
    attributes: {
      [key: string]: unknown
    }
    products?: { attributes?: { [key: string]: unknown } }[]
  }
}

interface BasketItem {
  id: string
  parentId?: string
  offer?: Offer
}

interface AddToBasketParams {
  offer: Offer
  orderItems?: BasketItem[]
  isSubmitting: boolean
  setIsSubmitting: (v: boolean) => void
  setHasError: (v: boolean) => void
  addOfferToBasket: (args: { offer: Offer }) => Promise<void>
  initiateCheckout: (args: { order: { orderItems: { offer: Offer }[] } }) => Promise<void>
  swapOffer: (itemId: string, offer: Offer) => Promise<void>
  navigateToCheckout: () => Promise<void>
  pageOptions?: { pushToCheckout?: boolean }
  getCurrentBasketId: () => string | null | undefined
  captureException: (error: unknown) => void
}

// Product attribute: a stand-alone product is never in the basket with another item
const STANDALONE_ATTRIBUTE = "standalone_in_basket"

export function isStandalone(offer?: Offer): boolean {
  return (offer?.data?.products || []).some((product) => product?.attributes?.[STANDALONE_ATTRIBUTE] === true)
}

// Adding a stand-alone offer, or adding next to one, replaces the basket instead of adding to it.
// Add-ons (items with a parentId) belong to their parent, so only parent items count.
export function shouldReplaceBasket(offer: Offer, orderItems: BasketItem[] = []): boolean {
  const parents = orderItems.filter((item) => !item?.parentId)
  if (parents.length === 0) return false
  return isStandalone(offer) || parents.some((item) => isStandalone(item.offer))
}

async function replaceBasket(offer: Offer, orderItems: BasketItem[], { swapOffer, initiateCheckout }: Pick<AddToBasketParams, "swapOffer" | "initiateCheckout">) {
  if (orderItems.length === 1) {
    // One item and no add-ons: swap it in the same basket, in one operation
    await swapOffer(orderItems[0].id, offer)
  } else {
    // Otherwise start a new basket that holds only this offer, also in one operation
    await initiateCheckout({ order: { orderItems: [{ offer }] } })
  }
}

export async function addSelectionToBasket({
  offer,
  orderItems = [],
  isSubmitting,
  setIsSubmitting,
  setHasError,
  addOfferToBasket,
  initiateCheckout,
  swapOffer,
  navigateToCheckout,
  pageOptions,
  getCurrentBasketId,
  captureException,
}: AddToBasketParams) {
  if (isSubmitting) return
  setIsSubmitting(true)
  setHasError(false)

  try {
    const checkoutId = getCurrentBasketId()
    if (!checkoutId) {
      await initiateCheckout({ order: { orderItems: [{ offer }] } })
    } else if (shouldReplaceBasket(offer, orderItems)) {
      await replaceBasket(offer, orderItems, { swapOffer, initiateCheckout })
    } else {
      await addOfferToBasket({ offer })
    }
    if (pageOptions?.pushToCheckout) {
      await navigateToCheckout()
    }
  } catch (error) {
    console.error("Error adding offer to basket:", error)
    captureException(error)
    setHasError(true)
  } finally {
    setIsSubmitting(false)
  }
}

interface GroupLabel {
  id: string
  label: string
  thumbnail?: string
}

interface OfferGroup {
  groupId: string
  id: string
  label: string
  offers: OfferItem[]
  thumbnail?: string
}

interface OfferItem {
  path: string
  data: {
    attributes: {
      group__limio?: string
      best_value__limio?: boolean
      [key: string]: unknown
    }
  }
}

export function groupOffers(offers: OfferItem[], groupLabels: GroupLabel[]): (OfferGroup | undefined)[] {
  const groups = R.groupBy(R.path(["data", "attributes", "group__limio"]) as (offer: OfferItem) => string, offers)
  const groupLabelArray = groupLabels.map((group) => group.id)

  function reorderKeys(obj: Record<string, Offer[]>, order: string[]): Record<string, Offer[]> {
    const newObj: Record<string, Offer[]> = {}
    order.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key]
      }
    })
    return newObj
  }

  const sortedGroup = reorderKeys(groups, groupLabelArray)

  const groupedOffers = Object.keys(sortedGroup).map((groupId) => {
    const group = groupLabels.find((g) => g.id === groupId)
    if (group) {
      const { label, thumbnail } = group
      return {
        groupId,
        id: groupId,
        label,
        offers: groups[groupId],
        thumbnail
      }
    }
    return undefined
  })

  return groupedOffers
}
