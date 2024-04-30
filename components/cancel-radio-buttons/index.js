//@flow
import "./index.css"
import React, {useState} from "react"
import {Button, Input, Label} from "@limio/design-system"
import {sendOrder} from "@limio/shop/src/shop/helpers/postRequests.js"
import {v4 as uuid} from "uuid"
import {useSubscriptions} from "@limio/sdk"

type Props = {
    title: string,
    subtitle: string,
    reasonsHeading: string,
    reasons: Array<{ label: string, value: string, url: string }>,
    showImage: boolean,
    imageUrl: string,
    cancelButtonText: string,
    keepSubscriptionButtonText: string,
    keepSubscriptionUrl: string,
    useCancelIntent: boolean,
}

function CancelRadioButtons({
                                title,
                                subtitle,
                                reasonsHeading,
                                reasons,
                                showImage,
                                imageUrl,
                                cancelButtonText,
                                keepSubscriptionButtonText,
                                keepSubscriptionUrl,
                                cancelLink,
                                useCancelIntent = false,
                            }: Props) {

    const {subscriptions = []} = useSubscriptions()

    const [selectedReason, setSelectedReason] = useState(null)
    const [otherReasonText, setOtherReasonText] = useState("")

    const onCancel = async () => {
        const searchParams = new URLSearchParams(window.location.search)
        const option = searchParams.get("ltm_option")
        const subId = searchParams.get("subId")
        const subscription = subscriptions.find(sub => sub.id === subId)

        const cancelIntentOrder = {
            order_type: "cancel_intent",
            forSubscription: {
                name: subscription.name
            },
            owner: subscription.owner,
            external_id: uuid(),
            source: "online",
            orderDate: new Date().toISOString(),
            cancelInformation: {
                reason: selectedReason.value,
                text: otherReasonText,
                option: option
            }
        }

        const cancelOrder = {
            order_type: "cancel_subscription",
            data: {
                reason: {
                    id: selectedReason.id,
                }
            },
            subscriptionId: subId,
            external_id: params.get("subId") || params.get("subRef")
        }

        const order = useCancelIntent ? cancelIntentOrder : cancelOrder
        await sendOrder(order)
        window.location.href = cancelLink
    }

    const onKeepSubscription = () => {
        window.location.assign(keepSubscriptionUrl)
    }

    return (
        <div className={"container"}>
            <div className={"contentWrapper"}>
                <div className={"contentWrapperLeft"}>
                    <h1 className={"heading"}>{title}</h1>
                    <p className={"paragraph"} dangerouslySetInnerHTML={{__html: subtitle}}></p>
                    <div className={"reasonList"}>
                        <h2 className={"reasonListHeading"} dangerouslySetInnerHTML={{__html: reasonsHeading}}></h2>
                        {reasons.map((r, i) => {
                            const id = `reason_${i}`
                            return (
                                <div key={r.value} className={"reasonListItem"}>
                                    <Input type="radio" id={id} value={r.value} checked={selectedReason === r}
                                           onChange={() => setSelectedReason(r)} className={"radioButton"}/>
                                    <Label htmlFor={id} className={"reasonListItemLabel"}>
                                        {r.label}
                                    </Label>
                                </div>
                            )
                        })}
                        <div>
                            <Input
                                type={"textarea"}
                                id="other-reason-text"
                                rows={5}
                                className={"textbox"}
                                value={otherReasonText}
                                onChange={e => setOtherReasonText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {showImage && imageUrl && (
                    <div className={"contentWrapperRight"}>
                        <img src={imageUrl} role="presentation" className={"reasonImage"}/>
                    </div>
                )}
            </div>
            <hr className={"divider"}/>
            <div className={"list"}>
                <div className={"listItem"}>
                    <Button onClick={onCancel} disabled={selectedReason == null}>
                        {cancelButtonText}
                    </Button>
                </div>
                <div className={"listItem"}>
                    <Button onClick={onKeepSubscription}>{keepSubscriptionButtonText}</Button>
                </div>
            </div>
        </div>
    )
}

export default CancelRadioButtons
