import React from "react"
import { useLimioUserCustomer, useLimioUserPaymentMethods } from "@limio/internal-checkout-sdk"
import { usePaymentManagerContext } from "@limio/shop-payment-manager/src/usePaymentManagerContext"
import { updatePaymentAction, setOrderPaymentTypeAction } from "@limio/shop-redux/src/shop/redux"
import { useStaticProps } from "./componentStaticProps"
import CheckoutPaymentCard from "./components/CheckoutPaymentCard"
import type { PaymentMethod } from "./components/CheckoutPaymentCard"
import { s } from "./styles"

const PAYMENT_TYPE = "saved_payment"

// Safe wrapper — usePaymentManagerContext throws if rendered outside a PaymentManager provider.
// This can happen in page builder preview or when the component is placed outside the form.
function useSafePaymentManagerContext() {
    try {
        return usePaymentManagerContext()
    } catch {
        return { form: null, store: null }
    }
}

function SavedPaymentCheckout() {
    const props = useStaticProps()
    const { form, store } = useSafePaymentManagerContext()

    const { customer } = useLimioUserCustomer()
    const { paymentMethods } = useLimioUserPaymentMethods(customer?.id, {
        filterType: ["invoice"]
    })

    const defaultPaymentMethodId = customer?.data?.defaultPaymentMethodId
    const initialSelectedId = defaultPaymentMethodId || paymentMethods?.[0]?.id
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = React.useState<string | undefined>(initialSelectedId)

    // Sync initial selection when payment methods load async
    React.useEffect(() => {
        if (initialSelectedId && !selectedPaymentMethodId) {
            setSelectedPaymentMethodId(initialSelectedId)
        }
    }, [initialSelectedId])

    // Dispatch saved_payment type on mount if a method is pre-selected
    React.useEffect(() => {
        if (selectedPaymentMethodId && store) {
            store.dispatch(setOrderPaymentTypeAction(PAYMENT_TYPE))
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Listen to Redux store for paymentType changes from sibling subcomponents.
    // When another subcomponent (e.g. Card/Direct Debit/Invoice) sets a different
    // paymentType, deselect our saved payment cards.
    React.useEffect(() => {
        if (!store?.subscribe) return

        const unsubscribe = store.subscribe(() => {
            const state = store.getState()
            const currentPaymentType = state?.order?.paymentType

            if (currentPaymentType && currentPaymentType !== PAYMENT_TYPE) {
                setSelectedPaymentMethodId(undefined)
            }
        })

        return unsubscribe
    }, [store])

    // When a saved card is selected, dispatch the payment type immediately
    // so sibling subcomponents can deselect themselves
    function handleSelectCard(pmId: string) {
        setSelectedPaymentMethodId(pmId)
        if (store) {
            store.dispatch(setOrderPaymentTypeAction(PAYMENT_TYPE))
        }
    }

    const selectedPaymentMethod = paymentMethods?.find((pm: PaymentMethod) => pm.id === selectedPaymentMethodId)

    // Register submit handler — only processes payment if we're the active type
    React.useEffect(() => {
        if (!form || !store) return

        async function handleSubmitPayment() {
            const state = store.getState()
            if (state?.order?.paymentType !== PAYMENT_TYPE) return

            if (!selectedPaymentMethod) return

            const paymentData = selectedPaymentMethod.data

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

            store.dispatch(setOrderPaymentTypeAction(PAYMENT_TYPE))
        }

        form.addAsyncEventListener("submit", handleSubmitPayment)
        return () => {
            form.removeAsyncEventListener("submit", handleSubmitPayment)
        }
    }, [form, store, selectedPaymentMethod])

    if (!paymentMethods || paymentMethods.length === 0) {
        return (
            <div style={s.container}>
                <div style={s.warning}>{props.noPaymentMethodMessage}</div>
            </div>
        )
    }

    return (
        <div style={s.container}>
            {props.heading && <h4 style={s.heading}>{props.heading}</h4>}
            <fieldset style={s.fieldset}>
                <legend style={s.legend}>Select payment method</legend>
                <div style={s.cardList}>
                    {paymentMethods.map((pm: PaymentMethod) => (
                        <CheckoutPaymentCard
                            key={pm.id}
                            paymentMethod={pm}
                            isSelected={pm.id === selectedPaymentMethodId}
                            onSelect={() => handleSelectCard(pm.id)}
                            labels={{
                                expiryDateLabel: props.expiryDateLabel,
                                expiresSoonLabel: props.expiresSoonLabel,
                                expiredPaymentMethodLabel: props.expiredPaymentMethodLabel
                            }}
                        />
                    ))}
                </div>
                {props.changePaymentUrl && (
                    <a href={props.changePaymentUrl} style={s.addMethodLink}>
                        {props.changePaymentLabel}
                    </a>
                )}
            </fieldset>
        </div>
    )
}

SavedPaymentCheckout.Skeleton = function SavedPaymentCheckoutSkeleton() {
    return (
        <div style={s.container}>
            <div style={s.skeleton}>
                <div style={s.skeletonLine("40%")} />
                <div style={{ ...s.skeletonLine("60%"), marginTop: 10 }} />
            </div>
        </div>
    )
}

SavedPaymentCheckout.Error = function SavedPaymentCheckoutError({ errorText = "Unable to load payment method." }: { errorText?: string }) {
    return (
        <div style={s.container}>
            <div style={s.warning}>{errorText}</div>
        </div>
    )
}

export default SavedPaymentCheckout
