import * as R from "ramda"
interface Offer {
  path: string
  data: {
    attributes: {
      [key: string]: unknown
    }
  }
}

interface AddToBasketParams {
  offer: Offer
  isSubmitting: boolean
  setIsSubmitting: (v: boolean) => void
  setHasError: (v: boolean) => void
  addOfferToBasket: (args: { offer: Offer }) => Promise<void>
  initiateCheckout: (args: { order: { orderItems: { offer: Offer }[] } }) => Promise<void>
  navigateToCheckout: () => Promise<void>
  pageOptions?: { pushToCheckout?: boolean }
  getCurrentBasketId: () => string | null | undefined
  captureException: (error: unknown) => void
}

export async function addSelectionToBasket({
  offer,
  isSubmitting,
  setIsSubmitting,
  setHasError,
  addOfferToBasket,
  initiateCheckout,
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
