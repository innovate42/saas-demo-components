import { DateTime } from "@limio/date"
import type { LimioObject, SubscriptionOffer, AddOn } from "@limio/types"
import { getOfferBillingLabel, getAddOnBillingLabel } from "./Schedule"

export type SubscriptionRowData = {
  displayName: string
  billingPlan: string
  quantity: number
  unitPrice: string
}

type FormatPrice = (rawPrice: { amount: number; currency?: string } | undefined) => string

export function mapOfferToRow(subscriptionOffer: LimioObject<SubscriptionOffer>, formatPrice: FormatPrice): SubscriptionRowData {
  const offer = subscriptionOffer?.data?.offer
  const displayName = offer?.data?.attributes?.display_name__limio || offer?.data?.productBundles?.[0]?.rate_plan || offer?.name || "N/A"
  return {
    displayName,
    billingPlan: getOfferBillingLabel(offer),
    quantity: subscriptionOffer?.data?.quantity ?? 0,
    unitPrice: formatPrice(subscriptionOffer?.data?.price)
  }
}

export function mapAddOnToRow(addOn: AddOn, formatPrice: FormatPrice): SubscriptionRowData {
  const displayName = addOn?.data?.offer?.data?.products?.[0]?.attributes?.display_name__limio || addOn?.data?.offer?.name || "N/A"
  return {
    displayName,
    billingPlan: getAddOnBillingLabel(addOn?.data?.offer),
    quantity: addOn?.data?.quantity ?? 1,
    unitPrice: formatPrice(addOn?.data?.price)
  }
}

type WithDateRange = { data: { start: string; end?: string } }

export function checkActiveOffersAndAddOns<T extends WithDateRange>(items: T[] = []): T[] {
  const currentDate = DateTime.utc().toISO()
  return items
    .sort((a, b) => new Date(a.data.start).getTime() - new Date(b.data.start).getTime())
    .filter((item) => !item.data?.end || DateTime.fromISO(item.data.end).toString() >= currentDate)
    .filter((item) => item.data.start <= currentDate) // Item might be future dated for next term etc.
}
