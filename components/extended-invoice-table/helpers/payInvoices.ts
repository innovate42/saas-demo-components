import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests"
import type { Invoice, PaymentResult } from "../types"

type ProgressCallback = (current: number, total: number) => void

export async function payInvoicesSequentially(
  invoices: Invoice[],
  onProgress?: ProgressCallback
): Promise<PaymentResult[]> {
  const results: PaymentResult[] = []

  for (let i = 0; i < invoices.length; i++) {
    onProgress?.(i + 1, invoices.length)

    try {
      const order = {
        order_type: "pay_invoice",
        invoice: invoices[i],
        payment: {
          amount: invoices[i].balance
        }
      }

      const result = await sendOrder(order)

      if (result.error) {
        results.push({
          invoice: invoices[i],
          success: false,
          error: result.error?.message || "Payment failed"
        })
      } else {
        results.push({
          invoice: invoices[i],
          success: true
        })
      }
    } catch (error) {
      results.push({
        invoice: invoices[i],
        success: false,
        error: error instanceof Error ? error.message : "Payment failed"
      })
    }
  }

  return results
}
