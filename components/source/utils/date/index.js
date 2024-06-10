import { DateTime } from "@limio/date"

export function formatDate(date, format) {
    let formattedDate
  
    if (format === "DATE_EN") {
      // ie. 23 Feb 1994
      formattedDate = DateTime.fromISO(date).toFormat("d LLL yyyy")
    } else if (format === "DATE_MED") {
      // ie. Feb 23, 1994
      formattedDate = DateTime.fromISO(date).toFormat("LLL d, yyyy")
    } else if (format === "DATE_FULL") {
      // ie. February 23, 1994
      formattedDate = DateTime.fromISO(date).toFormat("MMMM d, yyyy")
    } else if (format === "DATE_SHORT") {
      //  ie. 23/02/1994
      formattedDate = DateTime.fromISO(date).toFormat("dd/MM/yyyy")
    } else {
      // Handle unknown format/default to locale
      formattedDate = DateTime.fromISO(date).toLocaleString(DateTime[format])
    }
  
    return formattedDate
  }


export const getTermDates = (order, paymentMethod, purchasedSubscription) => {
    const { order_type, isGift: isGiftPurchase, recipientDetails, orderItems } = order
    const isRenewal = order_type === "renew"
  
    let termStartDate
    let termEndDate
  
    if (isRenewal && purchasedSubscription?.data.pendingRenewalChange) {
      termStartDate = purchasedSubscription.data.pendingRenewalChange
      termEndDate = getEndDate(termStartDate, orderItems[0])
    } else if (isGiftPurchase) {
      termStartDate = recipientDetails?.startDate
    } else {
      termStartDate = purchasedSubscription?.termStartDate || purchasedSubscription?.start
      termEndDate = purchasedSubscription?.termEndDate || getEndDate(termStartDate, orderItems[0])
    }
  
    return { termStartDate, termEndDate }
  }