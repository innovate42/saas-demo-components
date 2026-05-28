import { DateTime } from "@limio/date"
import type { Schedule } from "@limio/types"
import type { ElasticOffer } from "@limio/types"


function formatBillingLabel(interval = 1, unit = "months") {
  const base = unit.toLowerCase().replace(/s$/, "")
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1)
  const unitLabel = interval === 1 ? capitalized : `${capitalized}s`
  return `${interval}-${unitLabel}`
}

export function getOfferBillingLabel(offer: ElasticOffer): string {
  const prices = offer?.data?.attributes?.price__limio
  if (prices?.[0]?.type === "onetime") return ""

  const term = offer?.data?.attributes?.term__limio
  if (!term) return "N/A"

  const { length = 1, type = "months" } = term
  return formatBillingLabel(length, type)
}

export function getAddOnBillingLabel(offer: ElasticOffer): string {
  const term = offer?.data?.attributes?.price__limio?.[0]
  if (!term) return "N/A"

  const { repeat_interval = 1, repeat_interval_type = "months" } = term
  return formatBillingLabel(repeat_interval, repeat_interval_type)
}

export function getBillThroughDate(schedules: Schedule[]): string {
  const currentDate = DateTime.utc().toISO()
  const nextBillingSchedule = (schedules ?? [])
    .filter(s => ["active", "pending", "pending-external"].includes(s.status))
    .sort((a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime())
    .find(s => s.data.date > currentDate)
  return nextBillingSchedule?.data?.date ? new Date(nextBillingSchedule.data.date).toLocaleDateString() : "N/A"
}
