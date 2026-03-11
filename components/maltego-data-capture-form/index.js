import * as React from "react"
import { LimioFieldContext, sanitiseHTML } from "@limio/sdk"
import { useComponentStaticProps } from "./componentStaticProps"
import { TooltipProvider } from "@limio/component-library"
import { sendOrder, getRecaptchaToken } from "@limio/shop/src/shop/helpers/postRequests"

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
    invalidFormMessageBackgroundColor,
    redirectUrl
  } = useComponentStaticProps()

  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const formRef = React.useRef(null)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    const form = formRef.current
    const formDataObj = {}
    const formData = new FormData(form)
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value
    }

    const unverifiedRecaptchaToken = await getRecaptchaToken("dataCaptureForm")

    try {
      await sendOrder({ order_type: "data_capture", data: formDataObj }, { "x-limio-recaptcha": unverifiedRecaptchaToken })
      setSuccess(true)

      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    } catch (err) {
      setError(err)
    }
  }

  return (
    <TooltipProvider>
      <LimioFieldContext.Provider value={{ optionalLabel, requiredLabel }}>
        <form
          ref={formRef}
          name="maltego-data-capture-form"
          onSubmit={onSubmit}
        >
          <fieldset disabled={success}>{children}</fieldset>
          {!success && (
            <button type="submit" className="btn btn-primary py-2 col-12">
              {submitLabel}
            </button>
          )}
        </form>
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
