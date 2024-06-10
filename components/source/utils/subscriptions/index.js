
import { DateTime } from "@limio/date"
import {getCurrentOffer} from "../offers"
import {formatCurrency} from "../../currency"
import { getAppConfigValue } from "@limio/shop/src/shop/appConfig.js"
import { formatDate } from "../date"

export function getPriceForUserSubscription(userSubscription) {
    const { status, schedule } = userSubscription
    const nextSchedule = checkPreviousSchedule(schedule)
    const offer = getCurrentOffer(userSubscription)
  
    const hasRecurringCharge = offer?.data?.attributes?.price__limio?.some(charge => charge.type === "recurring")
  
    if (status === "cancelled") {
      return "N/A"
    }
  
    let paymentAmount
    // sometimes a zuora preview or zuora renewal fail may result in a sub to not have a price available
    // if this happens we don't want to render undefined.
  
    // check schedule first renewals and external pricing use this
    if (nextSchedule?.data?.amount) {
      paymentAmount = ` ${formatCurrency(nextSchedule.data.amount, nextSchedule.data.currency)}`
  
      // check price__limio for one off offers
    } else if (!hasRecurringCharge && offer?.data?.attributes?.price__limio?.[0]?.value) {
      paymentAmount = ` ${formatCurrency(offer.data.attributes.price__limio[0].value, offer.data.attributes.price__limio?.[0].currencyCode)}`
    } else {
      paymentAmount = "Currently unavailable"
    }
    return paymentAmount
  }

  export function checkPreviousSchedule(schedules) {
    console.log("schedules", schedules)
    const activeSchedules = schedules.filter(schedule => ["active", "pending", "pending-external"].includes(schedule.status))
    const currentDate = DateTime.utc().toISO()
  
    const prevSchedules = activeSchedules.filter(schedule => schedule.data.date < currentDate)
    const sortedSchedules = prevSchedules.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  
    return sortedSchedules?.[0]
  }


  export function getRenewalDateForUserSubscription(userSubscription)  {
    const dateFormat = getAppConfigValue(["shop", "default_date_format"])
  
    const { status, schedule } = userSubscription
    const nextSchedule = checkCurrentSchedule(schedule)
    if (status === "cancelled") {
      return "N/A"
    }
  
    // TODO:   remove formatDate from here and format in componet.
    // ie formatDate(getRenewalDateForUserSubscription(userSubscription)))
    // that breaks things down and allows the format to be controlled in the component
    return formatDate(nextSchedule?.data?.date || userSubscription.data.termEndDate, dateFormat)
  }

  export function checkCurrentSchedule(schedules = [], allowCancelled)  {
    const activeSchedules = allowCancelled ? schedules : schedules.filter(x => ["active", "pending", "pending-external"].includes(x.status))
    const currentDate = DateTime.utc().toISO()
  
    const sortedSchedules = activeSchedules.sort((a, b) => new Date(a.data.date) - new Date(b.data.date))



    let nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate && ["active", "pending", "pending-external"].includes(schedule.status))
  
    if (!nextSchedule && allowCancelled) {
      nextSchedule = sortedSchedules.find(schedule => schedule.data.date > currentDate)
    }
  
    return nextSchedule
  }