import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CancelSurveyRadioButtonMaterial from "../../../components/cancel-survey-radio-button-material/index"

function withContext(Story, context) {
    return (
        <LimioProvider value={{}}>
            <ComponentContext.Provider value={context.args}>
                <Story />
            </ComponentContext.Provider>
        </LimioProvider>
    )
}

const defaultArgs = {
    title: "Before you go",
    subtitle: "Please tell us why you want to cancel your subscription",
    reasonsHeading: "Why would you like to cancel your subscription?",
    reasons: [
        { label: "This subscription is too expensive", value: "too_expensive", url: "/expensive", createBasket__limio_boolean: false },
        { label: "I have too much content", value: "too_much", url: "/quantity", createBasket__limio_boolean: false },
        { label: "I did not like the membership benefits", value: "dislike_benefits", url: "/dislike", createBasket__limio_boolean: false },
        { label: "I found an alternative", value: "found_alternative", url: "/alternative", createBasket__limio_boolean: false },
        { label: "I'd rather not say", value: "no_reason", url: "/help", createBasket__limio_boolean: false },
    ],
    showOtherReason: true,
    otherReasonLabel: "Other",
    otherReasonValue: "other",
    otherReasonUrl: "/other",
    captureOtherReasonText: true,
    otherReasonCaptureTextLabel: "Tell us more (optional)",
    showImage: true,
    imageUrl: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_auto/1156184/860406_495342.png",
    cancelButtonText: "Continue to cancel",
    keepSubscriptionButtonText: "Keep my subscription",
    keepSubscriptionUrl: "https://limio.com",
    themeColor: "orange",
}

export default {
    title: "Cancel Survey Radio Button Material",
    component: CancelSurveyRadioButtonMaterial,
    parameters: { layout: "fullscreen" },
    decorators: [withContext],
}

export const Default = { args: { ...defaultArgs } }

export const NoImage = {
    args: { ...defaultArgs, showImage: false },
}

export const BlueTheme = {
    args: { ...defaultArgs, themeColor: "blue" },
}

export const GreenTheme = {
    args: { ...defaultArgs, themeColor: "green" },
}

export const NoOtherReason = {
    args: { ...defaultArgs, showOtherReason: false, captureOtherReasonText: false },
}
