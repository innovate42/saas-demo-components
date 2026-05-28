import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CancelSurveyRadioButton from "../../../components/cancel-survey-radio-button-create-basket/index"

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
  title: "We're sorry to see you go",
  subtitle: "Before you cancel, please let us know why you're leaving. Your feedback helps us improve.",
  reasonsHeading: "Why are you cancelling?",
  reasons: [
    { label: "Too expensive", value: "too_expensive", url: "/cancel/confirm" },
    { label: "Not using it enough", value: "not_using", url: "/cancel/confirm" },
    { label: "Missing features I need", value: "missing_features", url: "/cancel/confirm" },
    { label: "Switching to a competitor", value: "switching", url: "/cancel/confirm" },
  ],
  showOtherReason: true,
  otherReasonLabel: "Other reason",
  otherReasonValue: "other",
  otherReasonUrl: "/cancel/confirm",
  captureOtherReasonText: true,
  otherReasonCaptureTextLabel: "Please tell us more",
  showImage: false,
  imageUrl: "",
  cancelButtonText: "Cancel my subscription",
  keepSubscriptionButtonText: "Keep my subscription",
  keepSubscriptionUrl: "/account",
}

export default {
  title: "Cancel Survey Radio Button",
  component: CancelSurveyRadioButton,
  parameters: { layout: "fullscreen" },
  decorators: [withContext],
}

export const Default = { args: { ...defaultArgs } }

export const WithImage = {
  args: {
    ...defaultArgs,
    showImage: true,
    imageUrl: "https://placehold.co/350x280",
  },
}
