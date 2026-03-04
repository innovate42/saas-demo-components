// @flow
import * as React from "react"
import * as R from "ramda"
import { useCampaign, useSubscriptions } from "@limio/sdk"
import { checkActiveSubscriptionOffer, formatCurrency } from "./helpers"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests"
import { v4 as uuid } from "uuid"
import { DateTime } from "@limio/date"
import { usePreview } from "@limio/ui-preview-context"
import { Typography, Button, CircularProgress, Box, Divider, Stack, Skeleton } from "@mui/material"
import { useSelector } from "@limio/shop"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"

const themeStyles = {
    orange: {
        primary: "#E16A00",
        background: "#FEF1E9",
        cardBackground: "#FFFBF7",
        pillBackground: "#FBE9D8",
        pillText: "#B84C00",
        borderColor: "#E16A00",
        text: "#6B3E26",
        buttonHover: "rgba(225, 106, 0, 0.9)",
        cardShadow: "0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06)"
    }
}

const getAddonUpdates = (subscription, selectedOffer, addOns) => {
    const ownedAddOns = subscription.subscriptionAddOns?.filter(addOn => addOn.status === "active") || []
    const selectedEntitlements = selectedOffer?.data.products[0].entitlements?.map(e => e.$ref) || []

    const toRemove = []
    const toReAdd = []

    ownedAddOns.forEach(addOn => {
        const entitlements = addOn.data.add_on?.data.products[0].entitlements?.map(e => e.$ref) || []
        const hasConflict = entitlements.some(e => selectedEntitlements.includes(e))
        if (hasConflict) {
            toRemove.push(addOn)
        } else {
            toReAdd.push(addOn)
        }
    })

    const removeUpdates = toRemove.map(addOn => ({
        type: "remove",
        quantity: 1,
        id: addOn.id,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on"
    }))

    const reAddProducts = toReAdd.map(a => a.data.add_on.data.products[0].path)
    const matchedReAdd = addOns.filter(a =>
        reAddProducts.includes(a.data.products[0].path) &&
        selectedOffer.data.attributes.billing_plan[0] === a.data.attributes.billing_option[0]
    )

    const addUpdates = matchedReAdd.map(addOn => ({
        type: "add",
        quantity: 1,
        id: addOn.id,
        version: addOn.version,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on"
    }))

    return [...removeUpdates, ...addUpdates]
}

const getUpdates = (subscription, selectedOffer, quantity, addOns) => {
    const currentOffer = checkActiveSubscriptionOffer(subscription.offers)
    const isSameOffer = currentOffer.data.offer?.id === selectedOffer.id
    const updates = []

    if (isSameOffer) {
        if (subscription.data.quantity !== Number(quantity)) {
            updates.push({
                type: "update",
                id: currentOffer.id,
                quantity: Number(quantity),
                effective_date: DateTime.local().toISODate(),
                record_type: "offer"
            })
        }
    } else {
        updates.push({
            type: "remove",
            id: currentOffer.id,
            quantity: subscription.data.quantity,
            effective_date: DateTime.local().toISODate(),
            record_type: "offer"
        })
        updates.push({
            type: "add",
            id: selectedOffer.id,
            version: selectedOffer.version,
            quantity: Number(quantity),
            effective_date: DateTime.local().toISODate(),
            record_type: "offer"
        })
    }

    return [...updates, ...getAddonUpdates(subscription, selectedOffer, addOns)]
}

const createOrder = (subscription, updates) => ({
    order_type: "update_subscription",
    orderItems: [],
    billingDetails: {},
    forSubscription: { name: subscription.name },
    updates,
    owner: subscription.owner,
    external_id: uuid(),
    source: "online",
    process_immediately: true
})

const getOfferDisplayName = offer => (
    offer?.data?.offer?.data?.attributes?.display_name__limio ||
    offer?.data?.attributes?.display_name__limio ||
    offer?.data?.name ||
    "Unnamed Plan"
)

function EditBasePlanBasket({
                                selectedOffer,
                                quantity,
                                yourPlanTitle,
                                toPayText,
                                onSuccess,
                                continueButtonText,
                                yourOldPlanCopy,
                                yourNewPlanCopy,
                                themeColor = "orange",
                                theme
                            }) {
    // const theme = themeStyles[themeColor]
    const { subscriptions = [] } = useSubscriptions()
    const subId = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("subId")
    const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
    const { offers = [], addOns = [] } = useCampaign()
    const { preview, loadingPreview } = usePreview()
    const { previewSchedule } = useSelector(s => s.previewResults)
    const currentOffer = checkActiveSubscriptionOffer(subscription.offers)
    const currency = currentOffer?.data?.price?.currency

    const selectedOfferObj = React.useMemo(() => offers.find(offer => offer.id === selectedOffer), [offers, selectedOffer])
    const [updates, setUpdates] = React.useState([])
    const [price, setPrice] = React.useState({})
    const [submitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (selectedOfferObj) {
            const updated = getUpdates(subscription, selectedOfferObj, quantity, addOns)
            setUpdates(updated)
        }
    }, [selectedOfferObj, quantity])

    React.useEffect(() => {
        if (updates.length > 0) {
            const previewOrder = {
                ...createOrder(subscription, updates),
                billingDetails: { state: "NY", postalCode: "10001", country: "US" },
                orderDiscount: { name: JSON.stringify(updates) }
            }
            preview(previewOrder, true)
        }
    }, [updates])

    React.useEffect(() => {
        if (!R.isEmpty(previewSchedule)) {
            const lineItems = previewSchedule[0]?.lineItems || []
            const removeSchedule = lineItems.find(item => Number(item.amountWithoutTax) < 0)
            const addSchedule = lineItems.find(item => Number(item.amountWithoutTax) > 0)
            setPrice({ remove: removeSchedule, add: addSchedule })
        }
    }, [previewSchedule])

    const handleSubmit = async () => {
        setSubmitting(true)
        const order = createOrder(subscription, updates)
        await sendOrder(order)
        onSuccess()
    }

    const calculateTotal = (add, remove) => {
        const addAmount = Number(add?.amountWithoutTax || 0)
        const removeAmount = Number(remove?.amountWithoutTax || 0)
        return formatCurrency(addAmount + removeAmount, currency)
    }

    return (
        <Box sx={{ backgroundColor: theme.background, boxShadow: theme.cardShadow, border: `1px solid ${theme.borderColor}`, borderRadius: 2, p: 3, mt: 4 }}>
            <Typography variant="h6" sx={{ color: theme.text, mb: 2 }}>{yourPlanTitle}</Typography>

            {updates.length > 0 && selectedOfferObj && (
                <Box sx={{ backgroundColor: theme.cardBackground, border: `1px solid ${theme.borderColor}`, borderRadius: 2, p: 2, mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.text, fontWeight: 600, mb: 1 }}>Your new plan</Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                        <Typography variant="body1" sx={{ color: theme.text, fontWeight: 500 }}>{getOfferDisplayName(selectedOfferObj)}</Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={{ xs: 1, sm: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    backgroundColor: theme.pillBackground,
                                    color: theme.pillText,
                                    borderRadius: '16px',
                                    px: 1.5,
                                    py: 0.5,
                                    fontWeight: 500
                                }}>
                                Effective date: {DateTime.local().toFormat('d LLLL yyyy')}
                            </Typography>
                        </Box>
                    </Box>
                    {subscription.data.quantity !== Number(quantity) && (
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.text }}>Quantity: {quantity}</Typography>
                    )}
                </Box>
            )}

            <Box mt={3}>
                {loadingPreview ? (
                    <Box sx={{ backgroundColor: theme.cardBackground, borderRadius: 2, p: 2, border: `1px solid ${theme.borderColor}` }}>
                        <Skeleton variant="text" height={28} width="40%" sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Skeleton variant="rectangular" height={24} width="60%" />
                                <Skeleton variant="text" height={24} width="15%" />
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Skeleton variant="rectangular" height={24} width="60%" />
                                <Skeleton variant="text" height={24} width="15%" />
                            </Box>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Skeleton variant="text" height={24} width="40%" />
                            <Skeleton variant="text" height={24} width="20%" />
                        </Box>
                    </Box>
                ) : (
                    price.add && price.remove && (
                        <Box sx={{ backgroundColor: theme.cardBackground, borderRadius: 2, p: 2, border: `1px solid ${theme.borderColor}` }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.text }}>Price Breakdown</Typography>
                            <Stack spacing={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" gap={1} alignItems="center">
                                        <CancelIcon sx={{ fontSize: 18, color: "#B42318" }} />
                                        <Typography variant="body2" sx={{ color: theme.text }}>{price.remove?.chargeName}</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: theme.text }}>-{formatCurrency(Number(price.remove?.amountWithoutTax || 0), currency)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" gap={1} alignItems="center">
                                        <CheckCircleIcon sx={{ fontSize: 18, color: "#027A48" }} />
                                        <Typography variant="body2" sx={{ color: theme.text }}>{price.add?.chargeName}</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: theme.text }}>{formatCurrency(Number(price.add?.amountWithoutTax || 0), currency)}</Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body1" fontWeight={600} sx={{ color: theme.text }}>Total to pay today</Typography>
                                <Typography variant="body1" fontWeight={600} sx={{ color: theme.text }}>{calculateTotal(price.add, price.remove)}</Typography>
                            </Box>
                        </Box>
                    )
                )}
            </Box>

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    fullWidth
                    disabled={submitting}
                    sx={{
                        backgroundColor: theme.primary,
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 600,
                        '&:hover': { backgroundColor: theme.buttonHover }
                    }}
                    onClick={handleSubmit}
                >
                    {submitting || loadingPreview ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : continueButtonText}
                </Button>
            </Box>
        </Box>
    )
}

export default EditBasePlanBasket
