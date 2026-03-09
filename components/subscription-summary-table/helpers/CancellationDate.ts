import type { Subscription } from "@limio/types"

export function calculateDaysUntilDate(futureDate: Date): number {
  const diffMs = futureDate.getTime() - Date.now()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function getDaysNoticeGiven(subscription: Subscription): number {
  const termEndDate = subscription.data?.termEndDate || subscription?.termEndDate
  if (!termEndDate) {
    throw new Error("No term end date found for subscription")
  }
  const date = new Date(termEndDate)
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid termEndDate: ${termEndDate}`)
  }
  return calculateDaysUntilDate(date)
}
