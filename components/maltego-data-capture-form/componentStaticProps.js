import { useComponentProps } from "@limio/sdk"

const defaultComponentProps = {
  subcomponentMetadata: [],
  requiredLabel: "Required",
  optionalLabel: "Optional",
  submitLabel: "Submit",
  successFormMessage: "Thank you! Your information has been submitted successfully.",
  successFormMessageFontColor: "#155724",
  successFormMessageBackgroundColor: "#d4edda",
  invalidFormMessage: "Please correct the errors below and try again.",
  invalidFormMessageFontColor: "#721c24",
  invalidFormMessageBackgroundColor: "#f8d7da"
}

export function useComponentStaticProps() {
  const componentProps = useComponentProps(defaultComponentProps)
  return componentProps
}
