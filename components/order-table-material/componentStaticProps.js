// @flow
import { useComponentProps } from "@limio/sdk"
import { getPropsFromPackageJson } from "@limio/components/helpers"
import packageData from "./package.json"

type StaticProps = {
  showGoBackButton: boolean,
  cancelLink: string,
  cancelHeading: string,
  switchLink: string,
  switchHeading: string,
  changePaymentLink: string,
  reactivateCancelledSubUrl: string,
  changePaymentHeading: string,
  goBackLink: string,
  goBackHeading: string,
  subscriptionsHeading: string,
  productName: string,
  notFoundText__limio_richtext: string,
  pendingChangeMessage: string,
  noAddOnsText: string,
  componentId: string,
}

export function useComponentStaticProps(): StaticProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps<StaticProps>(defaultComponentProps)
  return componentProps
}
