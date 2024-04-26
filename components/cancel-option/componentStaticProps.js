// @flow
import { useComponentProps } from "@limio/sdk"

type StaticProps = {
  pageTitle: string,
  boxTextAndTitles: [],
  existingTermBoxTitle: string,
  highlightBoxText: string
}

const defaultComponentProps: $Shape<StaticProps> = {
  pageTitle: "Cancellation Options",
  boxTextAndTitles: [
    {
      "boxTitle": "Hibernate",
      "boxText": "freeze your subscription to be able to resume it at a later day.",
      "highlighted": true,
      "buttonText": "Request Hibernation",
    },
    {
      "boxTitle": "Cancel",
      "boxText": "click here to cancel your subscription.",
      "highlighted": false,
      "buttonText": "Request Cancellation",

    }
    ],
  existingTermBoxTitle: "hibernate",
  highlightBoxText: "freeze your subscription"
}

export function useComponentStaticProps(): StaticProps {
  const componentProps = useComponentProps(defaultComponentProps)
}
