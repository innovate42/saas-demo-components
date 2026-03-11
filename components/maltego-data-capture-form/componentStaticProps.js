import { useComponentProps } from "@limio/sdk"

const defaultComponentProps = {
  subcomponentMetadata: [],
  requiredLabel: "Required",
  optionalLabel: "",
  submitLabel: "Submit",
  successFormMessage: "Thank you for submitting your information.",
  successFormMessageFontColor: "#155724",
  successFormMessageBackgroundColor: "#d4edda",
  invalidFormMessage: "We are sorry, but there was an error processing your order. Please try again later.",
  invalidFormMessageFontColor: "#856404",
  invalidFormMessageBackgroundColor: "#fff3cd",
  redirectUrl: ""
}

export function useComponentStaticProps() {
  const componentProps = useComponentProps(defaultComponentProps)
  return componentProps
}
