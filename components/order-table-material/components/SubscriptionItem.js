import * as React from 'react';
import { SubscriptionDetails } from './SubscriptionDetails.js';
import { useTranslation, useLimioPageContext, useBasket } from '@limio/sdk';
import {
    Button,
    Stack,
    Card,
    CardContent,
    Divider,
    CardHeader,
    Chip,
    Typography,
    Tooltip
} from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ExtensionIcon from '@mui/icons-material/Extension';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateSubscriptionCheckout } from "@limio/shop/src/shop/checkout/basket";
import { useSubInfo } from "@limio/sdk/subscription"

export function SubscriptionItem({
                                     subscription,
                                     links,
                                     headings,
                                     updateNotification,
                                     propsObject,
                                 }) {
    const { t } = useTranslation();
    const { actions } = useLimioPageContext();
    const { initiateCheckout } = useBasket();

    const { hasPendingChange } = useSubInfo(subscription);
    const canUpdateSubscription = !hasPendingChange && subscription.status === 'active';

    const schedule = subscription.schedule || [];
    const currentOffers = subscription.offers || [];

    const status = subscription?.status || 'Unknown';

    const handleUpdateSubscriptionClick = async() => {
        const basket = await initiateCheckout({
            order: {
                order_type: "update_subscription",
                forSubscription: { id: subscription.id },
                orderItems: currentOffers.map(offer => ({
                    orderItemActionType: "update",
                    type: "subscription_offer",
                    quantity: offer.data.quantity,
                    offer: {
                        id: offer.id
                    }
                }))
            }
        });

        const { order } = basket;
        const checkoutId = order.checkoutId;

        window.location.href = `${propsObject.updateSubscriptionLink}?basket=${checkoutId}`;
    };

    const handleEditAddOnsClick = async() => {
        const basket = await initiateCheckout({
            order: {
                order_type: "update_subscription",
                forSubscription: { id: subscription.id },

            }
        });

        const { order } = basket;
        const checkoutId = order.checkoutId;

        window.location.href = `${propsObject.editAddOnsLink}?basket=${checkoutId}`;
    };

    const handleEditBasePlanClick = async() => {
        const basket = await initiateCheckout({
            order: {
                order_type: "update_subscription",
                forSubscription: { id: subscription.id }
            }
        });

        const { order } = basket;
        const checkoutId = order.checkoutId;

        window.location.href = `${propsObject.editBasePlanLink}?basket=${checkoutId}`;
    };

    const handleCancelClick = () => {
        window.location.href = `${propsObject.cancelLink}?subId=${subscription.id}`;
    };

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardHeader
                title={<><Typography variant="subtitle2" color="text.secondary">
                    Subscription ID
                </Typography>
                    <Typography variant="body1" fontWeight={500}>
                        {subscription.name}
                    </Typography></>}
                action={
                    <Chip
                        label={status}
                        size="small"
                        color={
                            status.toLowerCase() === 'active'
                                ? 'success'
                                : status.toLowerCase() === 'cancelled'
                                    ? 'default'
                                    : 'warning'
                        }
                        sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                }
            />
            <CardContent>
                <SubscriptionDetails
                    subscription={subscription}
                    schedule={schedule}
                    currentOffers={currentOffers}
                    showPendingChange={hasPendingChange}
                    links={links}
                    headings={headings}
                    propsObject={propsObject}
                />

                <Divider sx={{ my: 2 }} />

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="flex-end"
                >
                    {propsObject.shopUpdateSubscription && (
                        <Tooltip title={canUpdateSubscription ? undefined : headings.pendingChangeTooltip}>
                            <span>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={handleUpdateSubscriptionClick}
                                    disabled={!canUpdateSubscription}
                                >
                                    {t(propsObject.updateSubscriptionHeading || 'Cancel subscription')}
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                    <Tooltip title={canUpdateSubscription ? undefined : headings.pendingChangeTooltip}>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<AutorenewIcon />}
                                onClick={() => handleEditBasePlanClick()}
                                disabled={!canUpdateSubscription}
                            >
                                {t(headings.basePlanSwitchHeading || 'Change Base-Plan')}
                            </Button>
                        </span>
                    </Tooltip>
                    <Tooltip title={canUpdateSubscription ? undefined : headings.pendingChangeTooltip}>
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<ExtensionIcon />}
                                onClick={handleEditAddOnsClick}
                                disabled={!canUpdateSubscription}
                            >
                                {t(headings.switchHeading || 'Edit Add-Ons')}
                            </Button>
                        </span>
                    </Tooltip>
                    {propsObject.showCancelButton && (
                        <Tooltip title={canUpdateSubscription ? undefined : headings.pendingChangeTooltip}>
                            <span>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancelClick}
                                    disabled={!canUpdateSubscription}
                                >
                                    {t(headings.cancel || 'Cancel subscription')}
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
