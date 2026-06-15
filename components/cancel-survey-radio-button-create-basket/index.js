import "./index.css"
import React, { useState } from "react"
import { Input, Label, Button } from "@limio/design-system"
import { sanitiseHTML, useBasket } from "@limio/sdk"

const CancelSurveyRadioButton = ({
  title,
  subtitle,
  reasonsHeading,
  reasons,
  otherReasonLabel,
  otherReasonValue,
  otherReasonUrl,
  showOtherReason,
  captureOtherReasonText,
  otherReasonCaptureTextLabel,
  showImage,
  imageUrl,
  cancelButtonText,
  keepSubscriptionButtonText,
  keepSubscriptionUrl
}) => {
  const { initiateCheckout } = useBasket()

  const [selectedReason, setSelectedReason] = useState(null)
  const [otherReasonText, setOtherReasonText] = useState("")

  const otherReason = {
    label: otherReasonLabel,
    value: otherReasonValue,
    url: otherReasonUrl
  }

  const onCancel = async () => {
    const subId = new URLSearchParams(window.location.search).get("subId")

    const url = new URL(selectedReason.url, window.location.origin)
    url.searchParams.set("subId", subId)
    url.searchParams.set("reason", selectedReason.value)

    if (selectedReason?.createBasket__limio_boolean) {
      // Logic to create a new basket
      const basket = await initiateCheckout({
        order: {
          order_type: "update_subscription",
          forSubscription: {
            id: subId
          }
        }
      })

      url.searchParams.set("basket", basket.order.checkoutId)
    }

    window.location.assign(url.toString())
  }

  const onKeepSubscription = () => {
    window.location.assign(keepSubscriptionUrl)
  }

  return (
    <main className={"container"}>
      <div className={"contentWrapper"}>
        <div className={"contentWrapperLeft"}>
          <h1 className={"heading"}>{title}</h1>
          <p
            className={"paragraph"}
            dangerouslySetInnerHTML={{ __html: sanitiseHTML(subtitle) }}
          ></p>
          <div className={"reasonList"}>
            <h2
              className={"reasonListHeading"}
              dangerouslySetInnerHTML={{ __html: sanitiseHTML(reasonsHeading) }}
            ></h2>
            {reasons.map((r, i) => {
              const id = `reason_${i}`

              return (
                <div key={r.value} className={"reasonListItem"}>
                  <Input
                    type="radio"
                    id={id}
                    value={r.value}
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className={"radioButton"}
                  />
                  <Label htmlFor={id} className={"reasonListItemLabel"}>
                    {r.label}
                  </Label>
                </div>
              )
            })}
            {showOtherReason && (
              <div className={"reasonListItem"}>
                <Input
                  type="radio"
                  id="reason_other"
                  value={otherReason.value}
                  checked={selectedReason?.value === otherReason.value}
                  onChange={() => setSelectedReason(otherReason)}
                  className={"radioButton"}
                />
                <Label htmlFor="reason_other" className={"reasonListItemLabel"}>
                  {otherReason.label}
                </Label>
              </div>
            )}
            {captureOtherReasonText &&
              selectedReason?.value === otherReason.value && (
                <div>
                  <Label htmlFor="other-reason-text" className={"textboxLabel"}>
                    {otherReasonCaptureTextLabel}
                  </Label>
                  <Input
                    type={"textarea"}
                    id="other-reason-text"
                    rows={5}
                    className={"textbox"}
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                  />
                </div>
              )}
          </div>
        </div>
        {showImage && imageUrl && (
          <div className={"contentWrapperRight"}>
            <img src={imageUrl} role="presentation" className={"reasonImage"} />
          </div>
        )}
      </div>
      <hr className={"divider"} />
      <div className={"list"}>
        <div className={"listItem"}>
          <Button onClick={onCancel} disabled={selectedReason == null}>
            {cancelButtonText}
          </Button>
        </div>
        <div className={"listItem"}>
          <Button onClick={onKeepSubscription}>
            {keepSubscriptionButtonText}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default CancelSurveyRadioButton
