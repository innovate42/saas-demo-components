import React from "react"
import { useLimioUserCustomer, useLimioUserPaymentMethods } from "@limio/internal-checkout-sdk"
import { sanitiseHTML } from "@limio/sdk"
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
            result?: Record<string, string>
        }
    }
}

function isPaymentMethodValid(pm: PaymentMethod): boolean {
    const month = pm.data?.expirationMonth
    const year = pm.data?.expirationYear
    if (!month || !year) return true // no expiry data = valid (e.g. direct debit, PayPal)
    const expiryDate = new Date(parseInt(String(year)), parseInt(String(month)), 0)
    return expiryDate >= new Date()
}

function WarningShieldIcon() {
    return (
        <svg style={s.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 4v6c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
        </svg>
    )
}

function NoBackupPaymentAlert() {
    const props = useStaticProps()
    const {
        heading,
        "subline__limio_richtext": subline,
        ctaLabel,
        ctaUrl,
        "backgroundColor__limio_color": backgroundColor,
        "borderColor__limio_color": borderColor,
        "textColor__limio_color": textColor,
    } = props

    const { customer } = useLimioUserCustomer()
    const { paymentMethods } = useLimioUserPaymentMethods(customer?.id, {
        filterType: ["invoice"],
    })

    const defaultPaymentMethodId = customer?.data?.defaultPaymentMethodId

    // No default payment → nothing to protect → hide
    if (!defaultPaymentMethodId || !paymentMethods?.length) return null

    const defaultPayment = paymentMethods.find((pm: PaymentMethod) => pm.id === defaultPaymentMethodId)
    if (!defaultPayment) return null

    const backupMethods = paymentMethods.filter((pm: PaymentMethod) => pm.id !== defaultPaymentMethodId)
    const hasValidBackup = backupMethods.some((pm: PaymentMethod) => isPaymentMethodValid(pm))

    // Valid backup exists → user is covered → hide
    if (hasValidBackup) return null

    return (
        <div style={s.container}>
            <div style={s.alertCard(backgroundColor, borderColor, textColor)}>
                <div style={s.iconContainer}>
                    <WarningShieldIcon />
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
    )
}

NoBackupPaymentAlert.Skeleton = function NoBackupPaymentAlertSkeleton() {
    return (
        <div style={s.container}>
            <div style={s.skeleton}>
                <div style={s.skeletonLine("40%")} />
                <div style={{ ...s.skeletonLine("70%"), marginTop: 10 }} />
                <div style={{ ...s.skeletonLine("30%"), marginTop: 16 }} />
            </div>
        </div>
    )
}

NoBackupPaymentAlert.Error = function NoBackupPaymentAlertError({ errorText = "Unable to load payment information." }: { errorText?: string }) {
    return (
        <div style={s.container}>
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
    )
}

export default NoBackupPaymentAlert

// Pure presentational export for Storybook mockups
export function AlertBanner({
    heading = "No backup payment method",
    subline = "<p>If your primary payment fails, there's no backup. Add a second method to avoid interruptions.</p>",
    ctaLabel = "Add backup method",
    ctaUrl = "/account/payment-methods",
    backgroundColor = "#fff7ed",
    borderColor = "#fed7aa",
    textColor = "#9a3412",
    icon,
}: {
    heading?: string
    subline?: string
    ctaLabel?: string
    ctaUrl?: string
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    icon?: React.ReactNode
}) {
    return (
        <div style={s.container}>
            <div style={s.alertCard(backgroundColor, borderColor, textColor)}>
                <div style={s.iconContainer}>
                    {icon || <WarningShieldIcon />}
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
    )
}
