// @flow
import * as React from "react"
import { v4 as uuid } from "uuid"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { useStaticProps } from "./componentStaticProps"
import "./index.css"

type FormState = "idle" | "submitting" | "success" | "error"

function MaltegoDataCaptureForm({ children }): React.Node {
  const props = useStaticProps() || {}
  const {
    requiredLabel,
    optionalLabel,
    submitLabel,
    "successFormMessage__limio_richtext": successFormMessage,
    "successFormMessageFontColor__limio_color": successFontColor,
    "successFormMessageBackgroundColor__limio_color": successBgColor,
    "invalidFormMessage__limio_richtext": invalidFormMessage,
    "invalidFormMessageFontColor__limio_color": invalidFontColor,
    "invalidFormMessageBackgroundColor__limio_color": invalidBgColor,
    redirectUrl,
  } = props
  const formRef = React.useRef(null)
  const [formState, setFormState] = React.useState<FormState>("idle")
  const [errors, setErrors] = React.useState<{ [string]: string }>({})

  const isDisabled = formState === "submitting" || formState === "success"

  const collectFormData = (): Object => {
    const formData = {}
    if (!formRef.current) return formData

    const inputs = formRef.current.querySelectorAll("input, select, textarea")
    inputs.forEach(input => {
      const name = input.name || input.id
      if (!name) return

      if (input.type === "checkbox") {
        formData[name] = input.checked
      } else if (input.type === "radio") {
        if (input.checked) {
          formData[name] = input.value
        }
      } else {
        formData[name] = input.value
      }
    })

    return formData
  }

  const validateForm = (): { isValid: boolean, errors: { [string]: string } } => {
    const validationErrors = {}
    if (!formRef.current) return { isValid: true, errors: {} }

    const requiredInputs = formRef.current.querySelectorAll("[required]")
    requiredInputs.forEach(input => {
      const name = input.name || input.id
      if (!name) return

      if (input.type === "checkbox" && !input.checked) {
        validationErrors[name] = "This field is required"
      } else if (!input.value || !input.value.trim()) {
        validationErrors[name] = "This field is required"
      }

      // Email validation
      if (input.type === "email" && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input.value)) {
          validationErrors[name] = "Please enter a valid email address"
        }
      }
    })

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors,
    }
  }

  const scrollToFirstError = () => {
    if (!formRef.current) return
    const firstErrorField = formRef.current.querySelector(".dcf-field-error")
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    // Validate
    const { isValid, errors: validationErrors } = validateForm()
    setErrors(validationErrors)

    if (!isValid) {
      setFormState("error")
      setTimeout(scrollToFirstError, 100)
      return
    }

    // Collect form data and submit
    setFormState("submitting")
    const formData = collectFormData()

    try {
      const order = {
        order_type: "data_capture",
        data: formData,
        external_id: uuid(),
        source: "online",
      }

      await sendOrder(order)
      setFormState("success")

      // Redirect if URL is configured
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    } catch (err) {
      console.error("Data capture form submission failed:", err)
      setFormState("error")
    }
  }

  const renderMessage = () => {
    if (formState === "success") {
      return (
        <div
          className="dcf-message dcf-message-success"
          style={{
            color: successFontColor || undefined,
            backgroundColor: successBgColor || undefined,
          }}
          dangerouslySetInnerHTML={{ __html: successFormMessage }}
        />
      )
    }

    if (formState === "error") {
      return (
        <div
          className="dcf-message dcf-message-error"
          style={{
            color: invalidFontColor || undefined,
            backgroundColor: invalidBgColor || undefined,
          }}
          dangerouslySetInnerHTML={{ __html: invalidFormMessage }}
        />
      )
    }

    return null
  }

  return (
    <div className="dcf-container">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className={`dcf-form ${isDisabled ? "dcf-disabled" : ""}`}>
        {requiredLabel && (
          <p className="dcf-required-label">
            <span className="dcf-asterisk">*</span> {requiredLabel}
          </p>
        )}

        <div className="dcf-fields">
          {children}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="dcf-field-errors">
            {Object.entries(errors).map(([field, message]) => (
              <p key={field} className="dcf-field-error">
                {field}: {String(message)}
              </p>
            ))}
          </div>
        )}

        {renderMessage()}

        <div className="dcf-submit-container">
          <button
            type="submit"
            className="dcf-submit-button"
            disabled={isDisabled}
          >
            {formState === "submitting" ? (
              <span className="dcf-spinner" />
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MaltegoDataCaptureForm
