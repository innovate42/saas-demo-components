import * as React from "react"
import { Form, SubmitButton } from "@limio/ui-form"
import { LimioFieldContext } from "@limio/sdk"
import { useComponentStaticProps } from "./componentStaticProps"
import { sanitiseHTML } from "@limio/sdk"
import { TooltipProvider } from "@limio/component-library"
import { sendOrder, getRecaptchaToken } from "@limio/shop/src/shop/helpers/postRequests.ts"

function MaltegoDataCaptureForm({ children }) {
  const {
    submitLabel = "Submit",
    optionalLabel,
    requiredLabel,
    successFormMessage,
    successFormMessageFontColor,
    successFormMessageBackgroundColor,
    invalidFormMessage,
    invalidFormMessageFontColor,
    invalidFormMessageBackgroundColor
  } = useComponentStaticProps()

  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const formRef = React.useRef(null)

  const onSubmit = async (event) => {
    const formData = event.value.formData
    setError(null)

    const unverifiedRecaptchaToken = await getRecaptchaToken("dataCaptureForm")

    try {
      await sendOrder({ order_type: "data_capture", data: formData }, { "x-limio-recaptcha": unverifiedRecaptchaToken })
      setSuccess(true)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <TooltipProvider>
      <LimioFieldContext.Provider value={{ optionalLabel, requiredLabel }}>
        <Form
          ref={formRef}
          name="data-capture-form"
          onSubmitError={(error) => {
            setError(error)
          }}
          onSubmit={onSubmit}
        >
          <fieldset disabled={success}>{children}</fieldset>
          {!success && <SubmitButton submitLabel={submitLabel} className={"py-2 col-12"} />}
        </Form>
        {success ? (
          <div className="alert alert-success" role="alert" style={{ color: successFormMessageFontColor, backgroundColor: successFormMessageBackgroundColor }}>
            {successFormMessage && <p dangerouslySetInnerHTML={{ __html: sanitiseHTML(successFormMessage) }} />}
          </div>
        ) : error ? (
          <div className="alert alert-warning" role="alert" style={{ color: invalidFormMessageFontColor, backgroundColor: invalidFormMessageBackgroundColor }}>
            {invalidFormMessage && <p dangerouslySetInnerHTML={{ __html: sanitiseHTML(invalidFormMessage) }} />}
          </div>
        ) : null}
      </LimioFieldContext.Provider>
    </TooltipProvider>
  )
}

MaltegoDataCaptureForm.displayName = "MaltegoDataCaptureForm"

MaltegoDataCaptureForm.Skeleton = ({ children }) => {
  const Skeletons = React.Children.map(children, (child) => {
    if (child.props.children) {
      return React.Children.map(child.props.children, (child) => {
        if (child.type?.Skeleton) {
          return <child.type.Skeleton {...child.props} />
        }
      })
    }
  })

  return <div className={"row tw-bg-surface"}>{Skeletons}</div>
}

export default MaltegoDataCaptureForm
