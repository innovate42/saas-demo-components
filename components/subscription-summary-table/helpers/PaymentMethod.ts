/**
 * Reads the payment method currently attached to a subscription so the card can
 * show how it is billed, and offer a "pay invoice" route when it is invoiced.
 *
 * Mirrors the shape handled by getCurrentPayment/getPaymentLabel in the shared
 * shop utils: `type` is the Limio payment type ("zuora", "invoice", "nexi",
 * "twikey"), and `data[type].result` is the provider payload.
 */

type ProviderResult = {
  Type?: string
  CreditCardType?: string
}

export type PaymentMethodRecord = {
  start?: string
  type?: string
  data?: Record<string, any> & {
    isExternalIntegration?: boolean
    integrationData?: { self_service?: { label?: string } }
  }
}

export type PaymentMethodInfo = {
  /** Display label, e.g. "Credit Card", "Invoice", "Direct Debit". */
  label: string
  /** Billed by invoice, so payment is the subscriber's to settle. */
  isInvoice: boolean
}

const PROVIDER_LABELS: Record<string, string> = {
  CreditCard: "Credit Card",
  CreditCardReferenceTransaction: "Credit Card",
  PayPal: "PayPal",
  DirectDebit: "Direct Debit",
  ACH: "Bank Transfer (ACH)",
  BankTransfer: "Bank Transfer",
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Most recently added payment method wins — the same rule as the shop utils. */
export function getCurrentPaymentMethod(
  paymentMethods: PaymentMethodRecord[] = [],
): PaymentMethodRecord | undefined {
  return [...paymentMethods].sort(
    (a, b) => new Date(b.start ?? 0).getTime() - new Date(a.start ?? 0).getTime(),
  )[0]
}

/**
 * Null when there is no payment method to describe — the caller renders nothing
 * rather than guessing, so a missing/renamed payload can't produce a wrong claim.
 */
export function getPaymentMethodInfo(
  paymentMethods: PaymentMethodRecord[] = [],
): PaymentMethodInfo | null {
  const current = getCurrentPaymentMethod(paymentMethods)
  const type = current?.type

  if (!type) return null
  if (type === "invoice") return { label: "Invoice", isInvoice: true }

  // External payment integrations supply their own label.
  if (current?.data?.isExternalIntegration) {
    const label = current?.data?.integrationData?.self_service?.label
    return label ? { label, isInvoice: false } : null
  }

  const result = current?.data?.[type]?.result
  const providerType = result?.Type

  if (result?.CreditCardType?.includes("Apple")) {
    return { label: "Apple Pay", isInvoice: false }
  }

  const label =
    (providerType && PROVIDER_LABELS[providerType]) || providerType || capitalise(type)

  return { label, isInvoice: false }
}
