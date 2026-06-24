// @flow
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk";
import packageData from "./package.json";

type StaticProps = {
  subheading: string,
  componentId: string,
  accentColor: string,
  showSideImage: boolean,
  sideImageUrl: string,
  backLinkUrl: string,
  backLinkText: string,
  showPromoCode: boolean,
  promoAppliedText: string,
  showGiftSection: boolean,
  showGiftToggle: boolean,
  giftSectionHeading: string,
  giftModalHeading: string,
  giftLinkUrl: string,
  giftConfirmButtonUrl: string,
  showDisclaimer: boolean,
  disclaimerText: string,
  moreInfoText: string,
};

export function useComponentStaticProps(): StaticProps {
  const defaultComponentProps = getPropsFromPackageJson(packageData);
  const componentProps = useComponentProps<StaticProps>(defaultComponentProps);
  return componentProps;
}
