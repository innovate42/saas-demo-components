export async function sendOrder(order) {
  console.log("[Mock] sendOrder called with:", order)
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
}
