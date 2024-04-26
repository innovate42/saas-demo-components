// @flow
import { useComponentProps } from "@limio/sdk"
import { getPropsFromPackageJson } from "@limio/components/helpers"
import packageData from "./package.json"

type StaticProps = {
  showCancelButton: boolean,
  showChangePaymentButton: boolean,
  showExchangeButton: boolean,
  showGoBackButton: boolean,
  showPaymentAmount: boolean,
  showSubscriptionNumber: boolean,
  showTermEndMessage: boolean,
  showAutoRenew: boolean,
  subheading__limio_richtext: string,
  cancelLink: string,
  cancelHeading: string,
  switchLink: string,
  switchHeading: string,
  changePaymentLink: string,
  reactivateCancelledSubUrl: string,
  showReactivateCancelledSubButton: boolean,
  showReactiveCancelledSubLabel: string,
  changePaymentHeading: string,
  goBackLink: string,
  goBackHeading: string,
  subscriptionsHeading: string,
  productName: string,
  showOfferImage: boolean,
  showMmaDescription: boolean,
  notFoundText__limio_richtext: string,
  pendingChangeMessage: string,
  limitSubscriptions: boolean,
  subscriptionLimit: number,
  noAddOnsText: string,
  componentId: string,
  showNextPayments: boolean
}

export function useComponentStaticProps(): StaticProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps<StaticProps>(defaultComponentProps)
  return componentProps
}
