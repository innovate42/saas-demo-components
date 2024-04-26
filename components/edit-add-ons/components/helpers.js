// @flow
import { DateTime } from "@limio/date"

export const standariseString = str => {
  return str.replace(/\s+/g, "-").toLowerCase()
}

export const stripAdd_on_id = s => (s.startsWith("add_on-") ? s.slice("add_on-".length) : s)

export const hasDesc = addOn => {
  return addOn.data.attributes.description__limio !== undefined
}
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
  const dateObj = new Date(date)
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0") // Months are 0-based, so +1 is needed.
  const dd = String(dateObj.getDate()).padStart(2, "0")
  const yyyy = dateObj.getFullYear()

  return `${mm}/${dd}/${yyyy}`
}

export const getEarliestScheduleDate = schedules => {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return null // or throw an error if appropriate
  }

  const sortedSchedules = schedules.sort((a, b) => {
    const dateA = new Date(a.data.schedule_date)
    const dateB = new Date(b.data.schedule_date)
    return dateA - dateB // sort in ascending order
  })

  return sortedSchedules[0].data.schedule_date
}

export function formatCurrency(amount: Number, currency: string): string {
  if (typeof Intl !== "undefined" && typeof Intl.NumberFormat !== "undefined") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
  } else {
    return `${currency} ${amount}`
  }
}

type LimioTermObject = {
  renewal_type: string, // "TERMED"
  length: number, // "1"
  renewal_trigger: string, // "EXTERNAL"
  type: string // "months"
}

export function mapTermObjectToDisplayStr(termObj: LimioTermObject): string {
  if (termObj === null) {
    return ""
  }
  const { length, type } = termObj
  if (type === "months") {
    return `${length} month${length > 1 ? "s" : ""}`
  }
  if (type === "years") {
    return `${length} year${length > 1 ? "s" : ""}`
  }
  return `${length} ${type}`
}

export function checkCurrentSchedule(schedules = [], allowCancelled?: boolean) {
  const activeSchedules = allowCancelled ? schedules : schedules.filter(x => ["active", "pending", "pending-external"].includes(x.status))
  const currentDate = DateTime.utc().toISO()

  const sortedSchedules = activeSchedules.sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  let nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate && ["active", "pending", "pending-external"].includes(schedule.status))

  if (!nextSchedule && allowCancelled) {
    nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate)
  }

  return nextSchedule
}
