// @flow
import * as React from "react"
import {SubscriptionDetails} from "./SubscriptionDetails.js"
import {useSubscriptions, useTranslation} from "@limio/sdk"
import {checkActiveOffers} from "../helpers/index.js"
import {Button} from "@limio/design-system"

const noop = () => undefined

type Props = {
    id: string,
    onClick: () => void,
    expanded: boolean,
    headings: { [key: string]: string },
    links: { [key: string]: string },
    updateNotification: UpdateNotification,
    propsObject: {
        pendingChangeMessage: string,
        reactivateCancelledSubUrl: string,
    },
    subId: string
}

export function SubscriptionItem({
                                     id,
                                     onClick = noop,
                                     expanded,
                                     links,
                                     headings,
                                     updateNotification,
                                     propsObject,
                                     subId
                                 }: Props): React.Node {
    const {pendingChangeMessage, reactivateCancelledSubUrl} = propsObject
    const {t} = useTranslation()
    const {subscriptions} = useSubscriptions()
    const subscription = subscriptions.find(sub => sub.id === subId)
    const {schedule, offers, addOns} = subscription

    // gets offers that are active
    const currentOffers = checkActiveOffers(offers)
    const hasPendingChange = false
    // const status = subscription.status ?? "Active"

    const status = "Active"
    // TODO: handle auto renew
    const notCancelledOrOneOff = true
    // !status?.includes("cancel") //&& isAutoRenew

    React.useEffect(() => {
        if (hasPendingChange === true) {
            updateNotification({pendingChange: {show: true, message: pendingChangeMessage, variant: "error"}})
        }
    }, [pendingChangeMessage, hasPendingChange, subscriptions[0]])

    // button handlers
    const reactivateCancelledSub = () => {
        window.location.href = `${reactivateCancelledSubUrl}`
    }

    const handleEditAddOnsClick = () => {
        window.location.href = `${links.editAddOns}`
    }

    const handleEditBasePlanClick = () => {
        window.location.href = `${links.editBasePlan}`
    }


    return (
        <div className={`orders-table-order${expanded ? " expanded" : ""}`} onClick={onClick}>
            {/* order table subscription line */}
            <div className="orders-table-order-body">
                <SubscriptionDetails
                    subscription={subscription}
                    schedule={schedule}
                    currentOffers={currentOffers}
                    notCancelledOrOneOff={notCancelledOrOneOff}
                    showPendingChange={hasPendingChange}
                    links={links}
                    headings={headings}
                    propsObject={propsObject}
                />
            </div>
            {/* action buttons */}
            <>
                <div className="orders-table-buttons">
                    {notCancelledOrOneOff && (
                        <div className="customer-information-block">
                            <div className="customer-information-body">
                                {/* maybe do not disable this if there is a pending change */}
                                <Button
                                    disabled={hasPendingChange}
                                    className={`change-subscription base-plan ${hasPendingChange ? "disabled" : ""}`}
                                    onClick={handleEditBasePlanClick}
                                >
                                    {t(headings.basePlanSwitchHeading || "Change Base-Plan")}
                                </Button>
                            </div>
                        </div>
                    )}
                    {notCancelledOrOneOff && (
                        <div className="customer-information-block">
                            <div className="customer-information-body">
                                {/* maybe do not disable this if there is a pending change */}
                                <Button
                                    disabled={hasPendingChange}
                                    className={`change-subscription edit-add-on ${hasPendingChange ? "disabled" : ""}`}
                                    onClick={handleEditAddOnsClick}
                                >
                                    {t(headings.switch || "Edit Add-Ons")}
                                </Button>
                            </div>
                        </div>
                    )}
                    {
                        <div className="cancel-payment-button">
                            <div className="customer-information-block">
                                <div className="customer-information-body">
                                    <Button
                                        disabled={hasPendingChange}
                                        className={`cancel-subscription ${hasPendingChange ? "disabled" : ""}`}
                                        onClick={() => (window.location.href = `${links.cancel}?subId=${subId}`)}
                                    >
                                        {t(headings.cancel || "Cancel subscription")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </>
        </div>
    )
}
