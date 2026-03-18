export function updatePaymentAction(payment) {
  return { type: "UPDATE_PAYMENT", payload: payment }
}

export function setOrderPaymentTypeAction(paymentType) {
  return { type: "SET_ORDER_PAYMENT_TYPE", payload: paymentType }
}
