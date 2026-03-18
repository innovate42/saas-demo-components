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
    const initialSelectedId = defaultPaymentMethodId || paymentMethods?.[0]?.id
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string | undefined>(initialSelectedId)

    React.useEffect(() => {
        if (initialSelectedId && !selectedPaymentMethodId) {
            setSelectedPaymentMethodId(initialSelectedId)
        }
    }, [initialSelectedId])

    const selectedPaymentMethod = paymentMethods?.find((pm: PaymentMethod) => pm.id === selectedPaymentMethodId)

    React.useEffect(() => {
        if (!selectedPaymentMethod || !form || !store) return

        async function handleSubmitPayment() {
            const paymentData = selectedPaymentMethod!.data

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
    }, [form, store, selectedPaymentMethod])

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
            <fieldset className="spc-fieldset">
                <legend className="spc-legend">Select payment method</legend>
                <div className="spc-card-list">
                    {paymentMethods.map((pm: PaymentMethod) => (
                        <CheckoutPaymentCard
                            key={pm.id}
                            paymentMethod={pm}
                            isSelected={pm.id === selectedPaymentMethodId}
                            onSelect={() => setSelectedPaymentMethodId(pm.id)}
                            labels={{
                                expiryDateLabel: props.expiryDateLabel,
                                expiresSoonLabel: props.expiresSoonLabel,
                                expiredPaymentMethodLabel: props.expiredPaymentMethodLabel
                            }}
                        />
                    ))}
                </div>
                {props.changePaymentUrl && (
                    <a href={props.changePaymentUrl} className="spc-add-method-link">
                        {props.changePaymentLabel}
                    </a>
                )}
            </fieldset>
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
