import * as React from "react"
import { useComponentProps } from "@limio/sdk"

const defaultProps = {
  submitLabel: "Submit",
  requiredLabel: "Required",
  optionalLabel: "",
  successFormMessage: "Thank you for submitting your information.",
  successFormMessageFontColor: "#155724",
  successFormMessageBackgroundColor: "#d4edda",
  invalidFormMessage: "We are sorry, but there was an error processing your order. Please try again later.",
  invalidFormMessageFontColor: "#856404",
  invalidFormMessageBackgroundColor: "#fff3cd"
}

function MaltegoDataCaptureForm({ children }) {
  const props = useComponentProps(defaultProps)

  return (
    <div>
      <p>Maltego Data Capture Form - Loading...</p>
      {children}
    </div>
  )
}

MaltegoDataCaptureForm.displayName = "MaltegoDataCaptureForm"

export default MaltegoDataCaptureForm
