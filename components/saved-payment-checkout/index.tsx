import React from "react"
import { useLimioUserCustomer, useLimioUserPaymentMethods } from "@limio/internal-checkout-sdk"
import { usePaymentManagerContext } from "@limio/shop-payment-manager/src/usePaymentManagerContext"
import { updatePaymentAction, setOrderPaymentTypeAction } from "@limio/shop-redux/src/shop/redux"
import { useStaticProps } from "./componentStaticProps"
import CheckoutPaymentCard from "./components/CheckoutPaymentCard"
import type { PaymentMethod } from "./components/CheckoutPaymentCard"
import "./index.css"

function SavedPaymentCheckout() {
    const props = useStaticProps()
    const { form, store } = usePaymentManagerContext()

    const { customer } = useLimioUserCustomer()
    const { paymentMethods } = useLimioUserPaymentMethods(customer?.id, {
        filterType: ["invoice"]
    })

    const defaultPaymentMethodId = customer?.data?.defaultPaymentMethodId
    const defaultPaymentMethod: PaymentMethod | undefined =
        paymentMethods?.find((pm: PaymentMethod) => pm.id === defaultPaymentMethodId)
        || paymentMethods?.[0]

    React.useEffect(() => {
        if (!defaultPaymentMethod || !form || !store) return

        async function handleSubmitPayment() {
            const paymentData = defaultPaymentMethod!.data

            if (paymentData.type === "zuora" || paymentData.zuora) {
                store.dispatch(updatePaymentAction({
                    type: "zuora",
                    zuora: {
                        refId: paymentData.zuora?.refId,
                        paymentGateway: paymentData.zuora?.result?.PaymentGateway
                            || paymentData.zuora?.result?.paymentGateway
                    }
                }))
            }

            store.dispatch(setOrderPaymentTypeAction("saved_payment"))
        }

        form.addAsyncEventListener("submit", handleSubmitPayment)
        return () => {
            form.removeAsyncEventListener("submit", handleSubmitPayment)
        }
    }, [form, store, defaultPaymentMethod])

    if (!paymentMethods || paymentMethods.length === 0) {
        return (
            <div className="spc-container">
                <div className="spc-warning">{props.noPaymentMethodMessage}</div>
            </div>
        )
    }

    return (
        <div className="spc-container">
            {props.heading && <h4 className="spc-heading">{props.heading}</h4>}
            {defaultPaymentMethod && (
                <CheckoutPaymentCard
                    paymentMethod={defaultPaymentMethod}
                    changePaymentLabel={props.changePaymentLabel}
                    changePaymentUrl={props.changePaymentUrl}
                    labels={{
                        expiryDateLabel: props.expiryDateLabel,
                        expiresSoonLabel: props.expiresSoonLabel,
                        expiredPaymentMethodLabel: props.expiredPaymentMethodLabel
                    }}
                />
            )}
        </div>
    )
}

SavedPaymentCheckout.Skeleton = function SavedPaymentCheckoutSkeleton() {
    return (
        <div className="spc-container">
            <div className="spc-skeleton">
                <div className="spc-skeleton-line spc-skeleton-line--short" />
                <div className="spc-skeleton-line spc-skeleton-line--medium" />
            </div>
        </div>
    )
}

SavedPaymentCheckout.Error = function SavedPaymentCheckoutError({ errorText = "Unable to load payment method." }: { errorText?: string }) {
    return (
        <div className="spc-container">
            <div className="spc-warning">{errorText}</div>
        </div>
    )
}

export default SavedPaymentCheckout
