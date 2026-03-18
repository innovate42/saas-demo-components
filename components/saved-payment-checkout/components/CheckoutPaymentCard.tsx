import React from "react"
import { getPaymentIcon } from "./paymentIcons"

type PaymentMethod = {
    id: string
    type: string
    data: {
        type?: string
        method?: string
        brand?: string
        last4?: string
        expirationMonth?: string
        expirationYear?: string
        holderName?: string
        email?: string
        zuora?: {
            refId: string
            result?: {
                CreditCardType?: string
                CreditCardMaskNumber?: string
                PaymentGateway?: string
                paymentGateway?: string
                Type?: string
            }
        }
    }
}

type Labels = {
    expiryDateLabel: string
    expiresSoonLabel: string
    expiredPaymentMethodLabel: string
}

type Props = {
    paymentMethod: PaymentMethod
    isSelected: boolean
    onSelect: () => void
    labels: Labels
}

function getCardLabel(paymentMethod: PaymentMethod): string {
    const zuoraResult = paymentMethod.data?.zuora?.result
    if (!zuoraResult) return paymentMethod.data?.brand || "Card"

    if (zuoraResult.Type === "CreditCard" || zuoraResult.CreditCardType) {
        const types: Record<string, string> = {
            AmericanExpress: "American Express",
            Visa: "Visa",
            MasterCard: "MasterCard",
        }
        return types[zuoraResult.CreditCardType || ""] || zuoraResult.CreditCardType || "Card"
    }

    const paymentTypes: Record<string, string> = {
        PayPal: "PayPal",
        BankTransfer: "Direct Debit",
        DirectDebit: "Direct Debit",
    }
    return paymentTypes[zuoraResult.Type || ""] || zuoraResult.Type || "Card"
}

function getLast4(paymentMethod: PaymentMethod): string {
    const mask = paymentMethod.data?.zuora?.result?.CreditCardMaskNumber
    if (mask) return mask.slice(-4)
    return paymentMethod.data?.last4 || ""
}

type ExpiryStatus = "valid" | "expiring-soon" | "expired"

function getExpiryStatus(month: string, year: string): ExpiryStatus {
    if (!month || !year) return "valid"

    const now = new Date()
    const expiryDate = new Date(parseInt(year), parseInt(month), 0) // last day of expiry month

    if (expiryDate < now) return "expired"

    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    if (expiryDate < threeMonthsFromNow) return "expiring-soon"

    return "valid"
}

function formatExpiryLabel(template: string, month: string, year: string): string {
    const expiryDate = `${month.padStart(2, "0")}/${year}`
    return template.replace("{{expiryDate}}", expiryDate)
}

function CheckoutPaymentCard({ paymentMethod, isSelected, onSelect, labels }: Props) {
    const label = getCardLabel(paymentMethod)
    const last4 = getLast4(paymentMethod)
    const expirationMonth = paymentMethod.data?.expirationMonth || ""
    const expirationYear = paymentMethod.data?.expirationYear || ""
    const holderName = paymentMethod.data?.holderName || ""
    const email = paymentMethod.data?.email || ""

    const expiryStatus = getExpiryStatus(expirationMonth, expirationYear)
    const icon = getPaymentIcon(paymentMethod.data?.zuora?.result?.CreditCardType || paymentMethod.data?.brand || "")

    const expiryLabel =
        expiryStatus === "expired"
            ? labels.expiredPaymentMethodLabel
            : expiryStatus === "expiring-soon"
              ? labels.expiresSoonLabel
              : labels.expiryDateLabel

    const expiryClassName =
        expiryStatus === "expired"
            ? "spc-expiry spc-expiry--expired"
            : expiryStatus === "expiring-soon"
              ? "spc-expiry spc-expiry--expiring-soon"
              : "spc-expiry"

    const cardClassName = `spc-card${isSelected ? " spc-card--selected" : ""}`
    const radioId = `spc-radio-${paymentMethod.id}`
    const accessibleLabel = `${label}${last4 ? ` ending in ${last4}` : ""}${holderName ? `, ${holderName}` : ""}`

    return (
        <label htmlFor={radioId} className={cardClassName}>
            <input
                type="radio"
                id={radioId}
                name="saved-payment-method"
                className="spc-radio-input"
                checked={isSelected}
                onChange={onSelect}
                aria-label={accessibleLabel}
            />
            <div className="spc-card-body">
                <div className="spc-card-header">
                    <div className="spc-card-info">
                        <div className="spc-card-top-row">
                            <span className="spc-card-label">{label}</span>
                            {last4 && <span className="spc-card-number">**** {last4}</span>}
                        </div>
                        {expirationMonth && expirationYear && (
                            <span className={expiryClassName}>
                                {formatExpiryLabel(expiryLabel, expirationMonth, expirationYear)}
                            </span>
                        )}
                    </div>
                    <div className="spc-icon">{icon}</div>
                </div>

                {(holderName || email) && (
                    <div className="spc-card-footer">
                        <span className="spc-holder">{holderName || email}</span>
                    </div>
                )}
            </div>
            <div className="spc-check-indicator" aria-hidden="true">
                {isSelected && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="currentColor" />
                        <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                {!isSelected && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                )}
            </div>
        </label>
    )
}

export default CheckoutPaymentCard
export type { PaymentMethod }
