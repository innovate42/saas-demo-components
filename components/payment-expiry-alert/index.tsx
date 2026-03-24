import React from "react"
import { useLimioUserCustomer, useLimioUserPaymentMethods } from "@limio/internal-checkout-sdk"
import { sanitiseHTML, useLimioContext } from "@limio/sdk"
import { useStaticProps } from "./componentStaticProps"
import { s } from "./styles"

type PaymentMethod = {
    id: string
    type: string
    data: {
        type?: string
        method?: string
        brand?: string
        last4?: string
        expirationMonth?: string | number
        expirationYear?: string | number
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

function isMoustache(val: string | undefined): boolean {
    return typeof val === "string" && val.includes("{{")
}

function resolveTemplate(template: string, vars: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value)
    }
    return result
}

function isExpiringWithinDays(month: string | number | undefined, year: string | number | undefined, days: number): boolean {
    if (!month || !year) return false
    const expiryDate = new Date(parseInt(String(year)), parseInt(String(month)), 0)
    const now = new Date()
    if (expiryDate < now) return false // already expired, not "expiring soon"
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + days)
    return expiryDate < thresholdDate
}

function getDaysUntilExpiry(month: string | number, year: string | number): number {
    const expiryDate = new Date(parseInt(String(year)), parseInt(String(month)), 0)
    const now = new Date()
    return Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

function isPaymentMethodExpired(pm: PaymentMethod): boolean {
    const month = pm.data?.expirationMonth
    const year = pm.data?.expirationYear
    if (!month || !year) return false
    const expiryDate = new Date(parseInt(String(year)), parseInt(String(month)), 0)
    return expiryDate < new Date()
}

function getCardBrand(pm: PaymentMethod): string {
    const zuoraResult = pm.data?.zuora?.result
    if (zuoraResult?.CreditCardType) {
        const types: Record<string, string> = {
            AmericanExpress: "American Express",
            Visa: "Visa",
            MasterCard: "MasterCard",
        }
        return types[zuoraResult.CreditCardType] || zuoraResult.CreditCardType
    }
    return pm.data?.brand || "Card"
}

function getLast4(pm: PaymentMethod): string {
    const mask = pm.data?.zuora?.result?.CreditCardMaskNumber
    if (mask) return mask.slice(-4)
    return pm.data?.last4 || ""
}

function ClockWarningIcon() {
    return (
        <svg style={s.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
            <line x1="4" y1="2" x2="2" y2="4" />
            <line x1="20" y1="2" x2="22" y2="4" />
        </svg>
    )
}

function PaymentExpiryAlert() {
    const props = useStaticProps()
    const {
        heading,
        "subline__limio_richtext": sublineTemplate,
        ctaLabel,
        ctaUrl,
        expiryThresholdDays,
        "backgroundColor__limio_color": backgroundColor,
        "borderColor__limio_color": borderColor,
        "textColor__limio_color": textColor,
    } = props

    const { isInPageBuilder } = useLimioContext() || {}
    const threshold = parseInt(expiryThresholdDays) || 90

    const { customer } = useLimioUserCustomer()
    const { paymentMethods } = useLimioUserPaymentMethods(customer?.id, {
        filterType: ["invoice"],
    })

    // In page builder, always show with preview placeholder values
    if (!isInPageBuilder) {
        const defaultPaymentMethodId = customer?.data?.defaultPaymentMethodId

        // No default payment → hide
        if (!defaultPaymentMethodId || !paymentMethods?.length) return null

        const defaultPayment = paymentMethods.find((pm: PaymentMethod) => pm.id === defaultPaymentMethodId)
        if (!defaultPayment) return null

        // Default not expiring within threshold → hide
        const defaultIsExpiring = isExpiringWithinDays(
            defaultPayment.data?.expirationMonth,
            defaultPayment.data?.expirationYear,
            threshold
        )
        if (!defaultIsExpiring) return null

        // Check if there's a valid non-expiring backup
        const backupMethods = paymentMethods.filter((pm: PaymentMethod) => pm.id !== defaultPaymentMethodId)
        const hasValidNonExpiringBackup = backupMethods.some((pm: PaymentMethod) => {
            if (isPaymentMethodExpired(pm)) return false
            const month = pm.data?.expirationMonth
            const year = pm.data?.expirationYear
            if (!month || !year) return true // no expiry data = valid (e.g. direct debit)
            return !isExpiringWithinDays(month, year, threshold)
        })

        // Valid non-expiring backup exists → user is covered → hide
        if (hasValidNonExpiringBackup) return null
    }

    // Build subline with template replacements (use preview values in page builder)
    const defaultPayment = paymentMethods?.find((pm: PaymentMethod) => pm.id === customer?.data?.defaultPaymentMethodId)
    const brand = defaultPayment ? getCardBrand(defaultPayment) : "Visa"
    const last4 = defaultPayment ? getLast4(defaultPayment) : "4242"
    const daysUntilExpiry = defaultPayment
        ? getDaysUntilExpiry(defaultPayment.data?.expirationMonth!, defaultPayment.data?.expirationYear!)
        : 45

    const subline = isMoustache(sublineTemplate)
        ? resolveTemplate(sublineTemplate, { brand, last4, daysUntilExpiry: String(daysUntilExpiry) })
        : sublineTemplate

    return (
        <div style={s.centerWrapper}>
        <div className="expiry-alert-grid" style={s.outerGrid}>
            <style dangerouslySetInnerHTML={{ __html: s.responsiveCss }} />
            <div style={s.alertCard(backgroundColor, borderColor, textColor)}>
                <div style={s.iconContainer}>
                    <ClockWarningIcon />
                </div>
                <div style={s.contentArea}>
                    {heading && <h4 style={s.heading}>{heading}</h4>}
                    {subline && (
                        <div
                            style={s.subline}
                            dangerouslySetInnerHTML={{ __html: sanitiseHTML(subline) }}
                        />
                    )}
                    {ctaUrl && ctaLabel && (
                        <a href={ctaUrl} style={s.ctaButton}>
                            {ctaLabel}
                        </a>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}

PaymentExpiryAlert.Skeleton = function PaymentExpiryAlertSkeleton() {
    return (
        <div style={s.centerWrapper}>
        <div className="expiry-alert-grid" style={s.outerGrid}>
            <div style={s.skeleton}>
                <div style={s.skeletonLine("50%")} />
                <div style={{ ...s.skeletonLine("80%"), marginTop: 10 }} />
                <div style={{ ...s.skeletonLine("30%"), marginTop: 16 }} />
            </div>
        </div>
        </div>
    )
}

PaymentExpiryAlert.Error = function PaymentExpiryAlertError({ errorText = "Unable to load payment information." }: { errorText?: string }) {
    return (
        <div style={s.centerWrapper}>
        <div className="expiry-alert-grid" style={s.outerGrid}>
            <div style={{
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                borderRadius: 10,
                padding: "14px 20px",
                fontSize: 14,
                color: "#9a3412",
                lineHeight: 1.5,
            }}>
                {errorText}
            </div>
        </div>
        </div>
    )
}

export default PaymentExpiryAlert

// Pure presentational export for Storybook mockups
export function ExpiryAlertBanner({
    heading = "Your payment method is expiring soon",
    subline = "<p>Your Visa ending in 4242 expires in 45 days. Update your payment method to avoid interruptions.</p>",
    ctaLabel = "Update payment method",
    ctaUrl = "/add-payment-method",
    backgroundColor = "#fff7ed",
    borderColor = "#fed7aa",
    textColor = "#9a3412",
}: {
    heading?: string
    subline?: string
    ctaLabel?: string
    ctaUrl?: string
    backgroundColor?: string
    borderColor?: string
    textColor?: string
}) {
    return (
        <div style={s.centerWrapper}>
        <div className="expiry-alert-grid" style={s.outerGrid}>
            <div style={s.alertCard(backgroundColor, borderColor, textColor)}>
                <div style={s.iconContainer}>
                    <ClockWarningIcon />
                </div>
                <div style={s.contentArea}>
                    {heading && <h4 style={s.heading}>{heading}</h4>}
                    {subline && (
                        <div
                            style={s.subline}
                            dangerouslySetInnerHTML={{ __html: subline }}
                        />
                    )}
                    {ctaUrl && ctaLabel && (
                        <a href={ctaUrl} style={s.ctaButton}>
                            {ctaLabel}
                        </a>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}
