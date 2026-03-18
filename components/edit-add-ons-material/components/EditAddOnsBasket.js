// @flow
import * as React from "react";
import { v4 as uuid } from "uuid";
import { useCampaign, useSubscriptions } from "@limio/sdk";
import { useSelector } from "@limio/shop"
import { usePreview } from "@limio/ui-preview-context";
import * as R from "ramda";
import {
    Box,
    Typography,
    Divider,
    Button,
    TextField,
    Alert,
    Stack,
    Chip,
    CircularProgress,
    Paper
} from "@mui/material";
import {
    checkCurrentSchedule,
    formatCurrency,
    formatDate,
    normalizeString,
    stripPathToProductName
} from "./helpers";
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js";
import PaymentMethodDetails from "./PaymentMethodDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

type AddOnUpdateAction = {
    type: "add" | "remove",
    quantity: number,
    id: string,
    version?: string,
    effective_date: string,
    record_type: "add_on"
};

type Props = {
    updates: Array<AddOnUpdateAction>,
    basketPayText: string,
    longTexts: string,
    continueWord: string,
    successLink: string,
    themeStyles: Object
};

function EditAddOnsBasket({
                              updates,
                              basketPayText,
                              longTexts,
                              continueWord,
                              successLink,
                              themeStyles
                          }: Props): React.Node {
    const { subscriptions = [] } = useSubscriptions();
    const subId = new URLSearchParams(window.location.search).get("subId");
    const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0];
    const currency = subscription?.data?.price?.currency;
    const { addOns } = useCampaign();

    const [_, setOfferCode] = React.useState("");
    const [addOnsPrice, setAddOnsPrice] = React.useState([]);
    const [submitting, setSubmitting] = React.useState(false);

    const { loadingPreview, preview } = usePreview();
    const { previewSchedule } = useSelector(s => s.previewResults)


    const dateOfEffect = formatDate(
        checkCurrentSchedule(subscription.schedule)?.data?.date || new Date()
    )

    console.log({ previewSchedule, loadingPreview, preview });

    const additions = updates.filter(update => update.type === "add").map(({ id }) => id);
    const removals = updates.filter(update => update.type === "remove").map(({ id }) => id);
    const addEmpty = R.isEmpty(additions);
    const removeEmpty = R.isEmpty(removals);
    const allEmpty = removeEmpty && addEmpty;

    const matchedAdditionAddOns = addOnIds => addOnIds.map(addOnId => addOns.find(addOn => addOn.id === addOnId));
    const matchedRemovalAddOns = addOnIds => addOnIds.map(addOnId => subscription.addOns.find(addOn => addOn.id === addOnId));

    const handleSubmit = async () => {
        const order = {
            order_type: "update_subscription",
            forSubscription: { name: subscription.name },
            updates: [...updates],
            owner: subscription.owner,
            external_id: uuid(),
            source: "online",
            process_immediately: true
        };
        setSubmitting(true);
        await sendOrder(order);
        window.location.href = successLink;
    };

    React.useEffect(() => {
        if (updates.length < 1) return;
        const order = {
            order_type: "update_subscription",
            forSubscription: { name: subscription.name },
            updates,
            owner: subscription.owner,
            external_id: uuid(),
            source: "online",
            process_immediately: true,
            orderItems: [],
            orderDiscount: { name: JSON.stringify(updates) },
            billingDetails: { state: "NY", postalCode: "10001", country: "US" }
        };
        preview(order, true);
    }, [updates]);

    React.useEffect(() => {
        if (!loadingPreview && previewSchedule?.[0]?.lineItems?.length) {
            const currentSchedule = previewSchedule.find(s => new Date(s.date).getDay() === new Date().getDay());
            setAddOnsPrice(currentSchedule.lineItems);
        } else {
            setAddOnsPrice([]);
        }
    },  [loadingPreview, previewSchedule]);

    const matchAddOnSchedule = (productName, returnNumber = false) => {
        console.log(productName)

        const schedule = addOnsPrice.find(
            addOn => normalizeString(addOn.productName) === normalizeString(productName)
        );
        if (!schedule) return <CircularProgress size={16} />;
        return returnNumber ? Number(schedule.amountWithoutTax) : formatCurrency(schedule.amountWithoutTax, currency);
    };

    const orderTotal = () => {
        const matchedAddOns = matchedAdditionAddOns(additions);
        const total = matchedAddOns.reduce((acc, curr) => {
            console.log(curr)
            const priceMatch = matchAddOnSchedule(stripPathToProductName(curr.data.productBundles[0].product_path), true);
            return acc + (priceMatch || 0);
        }, 0);
        return formatCurrency(total, currency);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: `1px solid ${themeStyles.primary}`,
                bgcolor: themeStyles.background,
                borderRadius: 2,
                boxShadow: themeStyles.cardShadow,
                mt: 10
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: themeStyles.text }}>
                Your Changes
            </Typography>

            {allEmpty ? (
                <Alert
                    severity="info"
                    iconMapping={{ info: <FontAwesomeIcon icon={faCircleInfo} /> }}
                    sx={{ backgroundColor: themeStyles.pillBackground, color: themeStyles.text, mb: 3 }}
                >
                    No add-ons selected. You can choose from the list on the left. Changes will be reflected here and billed according to your cycle.
                </Alert>
            ) : (
                <>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            backgroundColor: themeStyles.background,
                            borderColor: themeStyles.primary,
                            borderRadius: 2,
                            mb: 3
                        }}
                    >
                        <Stack spacing={1}>
                            {!addEmpty && matchedAdditionAddOns(additions).map(addOn => {
                                const productName = stripPathToProductName(addOn.data.productBundles[0].product_path);
                                const amount = matchAddOnSchedule(productName);
                                return (
                                    <Box
                                        key={addOn.id}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography variant="body2">{productName}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{amount}</Typography>
                                    </Box>
                                );
                            })}

                            {!removeEmpty && matchedRemovalAddOns(removals).map(addOn => {
                                const productName = stripPathToProductName(addOn.data.add_on.data.products[0].path);
                                return (
                                    <Box
                                        key={addOn.id}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography variant="body2">{productName}</Typography>
                                        <Typography variant="body2" color="text.secondary">Removed</Typography>
                                    </Box>
                                );
                            })}
                        </Stack>

                        {!removeEmpty && (
                            <Alert
                                severity="warning"
                                iconMapping={{ warning: <FontAwesomeIcon icon={faTriangleExclamation} /> }}
                                sx={{ mt: 2, backgroundColor: themeStyles.pillBackground }}
                            >
                                Your removed add-ons will take effect on <strong>{dateOfEffect}</strong>.
                            </Alert>
                        )}
                    </Paper>

                    {previewSchedule?.length > 0 && (
                        <Paper
                            variant="outlined"
                            sx={{
                                backgroundColor: themeStyles.background,
                                borderColor: themeStyles.primary,
                                borderRadius: 2,
                                p: 2,
                                mb: 3
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Billing Schedule
                            </Typography>

                            <Stack spacing={2}>
                                {previewSchedule.slice(0, 2).map((schedule, index) => {
                                    const isToday = index === 0;
                                    const chipLabel = isToday ? 'Today' : `Next: ${formatDate(schedule.date)}`;

                                    return (
                                        <Box key={schedule.date}>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{ mb: 0.5 }}
                                            >
                                                <Chip
                                                    label={chipLabel}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: isToday ? themeStyles.primary : themeStyles.primaryMuted || '#ccc',
                                                        color: '#fff',
                                                        fontWeight: 500
                                                    }}
                                                />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {formatCurrency(schedule.amount, schedule.currency)}
                                                </Typography>
                                            </Box>

                                            {schedule.lineItems?.map((item, i) => (
                                                <Box
                                                    key={i}
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="flex-start"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ maxWidth: '70%', lineHeight: 1.4 }}
                                                    >
                                                        {item.productName} ({item.quantity} x {formatCurrency(item.amountWithoutTax / item.quantity, schedule.currency)})
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ fontWeight: 500 }}
                                                    >
                                                        {formatCurrency(item.amountWithoutTax, schedule.currency)}
                                                    </Typography>
                                                </Box>
                                            ))}

                                            <Divider sx={{ my: 1 }} />
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Paper>
                    )}
                </>
            )}



            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    disabled={submitting}
                    onClick={handleSubmit}
                    sx={{
                        all: 'unset', // wipe inherited styles (if absolutely necessary)
                        display: 'inline-flex !important',
                        alignItems: 'center !important',
                        justifyContent: 'center !important',
                        backgroundColor: `${themeStyles.primary} !important`,
                        color: '#fff !important',
                        fontFamily: `'Inter', sans-serif !important`,
                        fontWeight: '600 !important',
                        fontSize: '0.875rem !important', // 14px
                        lineHeight: '1.5 !important',
                        textTransform: 'capitalize !important',
                        borderRadius: '8px !important',
                        minWidth: '160px !important',
                        padding: '10px 24px !important',
                        width: "100% !important",
                        boxShadow: '0px 4px 6px rgba(16, 24, 40, 0.08), 0px 2px 4px rgba(16, 24, 40, 0.06) !important',
                        transition: 'all 0.2s ease-in-out !important',
                        '&:hover': {
                            backgroundColor: `${themeStyles.buttonHover} !important`,
                            boxShadow: '0px 6px 12px rgba(16, 24, 40, 0.1) !important'
                        },
                        '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed',
                            backgroundColor: `${themeStyles.primary} !important`, // keep bg consistent when disabled
                        }
                    }}
                >
                    {submitting ? <CircularProgress size={20} color="inherit" /> : continueWord}
                </Button>


            </Box>

            <PaymentMethodDetails />

            {/*<Box mt={3}>*/}
            {/*    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: longTexts }} />*/}
            {/*</Box>*/}
        </Paper>
    );
}

export default EditAddOnsBasket;
