// @flow
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import packageData from "./package.json"

type StaticProps = {
  heading: string,
  subheading: string,
  showImage: boolean,
  componentId: string,
  offerWidth: number,
  themeColor: string,
  groupLabels: Array<any>,
  showGroupedOffers: boolean,
  freeTrialLink: string,
  initiateCheckoutPartner: boolean
}

export function useComponentStaticProps(): StaticProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData)
  const componentProps = useComponentProps<StaticProps>(defaultComponentProps)
  return componentProps
}
