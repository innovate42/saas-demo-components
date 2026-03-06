import { useComponentProps } from "@limio/sdk"

type StaticProps = {
  heading: string
  subheading__limio_richtext: string
  detailedSubheading: string
  discountDetails: string
  nextPaymentDetails__limio__richtext: string
  imageUrl: string
  imagePosition: "top" | "bottom" | "left" | "right"
  confirmOfferButtonLabel: string
  offerLineText: string
  processChangeSub: "onPageNoModal" | "onPageWithModal" | "redirect"
  confirmHeading: string
  confirmSubheading: string
  confirmationOk: string
  confirmationCancel: string
  redirectUrl: string
  redirectToConfirmationUrl: string
  showPaymentMethod: boolean
  paymentMethodHeading: string
  paymentFrequencyLabel: string
  paymentAmountLabel: string
  paymentDateLabel: string
  showAdditionalButtons: boolean
  additionalButtons: Array<{
    label: string
    url: string
  }>
  componentId: string
}

const defaultComponentProps: Partial<StaticProps> = {
  heading: "Your cancel/save offer",
  subheading__limio_richtext: "Stay with us",
  detailedSubheading: "We won't charge you until your subscription renews.",
  discountDetails: "Get {{discountRate}} off for the next {{discountPeriod}}.",
  nextPaymentDetails__limio__richtext: "",
  imageUrl: "",
  imagePosition: "top",
  confirmOfferButtonLabel: "I'd like to change my subscription",
  offerLineText: "Get this offer",
  processChangeSub: "onPageNoModal",
  redirectToConfirmationUrl: "amend/change",
  confirmHeading: "Are you sure you want to update your subscription?",
  confirmSubheading: "You will be switched over to this offer, starting on your next billing date.",
  confirmationOk: "I want to change my subscription",
  confirmationCancel: "Go back",
  redirectUrl: "cancel/save-confirm",
  showPaymentMethod: false,
  paymentMethodHeading: "Payment Method",
  paymentFrequencyLabel: "Payment Frequency",
  paymentAmountLabel: "Payment Amount",
  paymentDateLabel: "Payment Date",
  showAdditionalButtons: false,
  additionalButtons: [
    {
      label: "Continue",
      url: ""
    },
    {
      label: "Go back",
      url: "/mma"
    }
  ],
  componentId: "cancel-save-offer-limio"
}

export function useComponentStaticProps(): StaticProps {
  const componentProps = useComponentProps(defaultComponentProps)
  return componentProps
}
