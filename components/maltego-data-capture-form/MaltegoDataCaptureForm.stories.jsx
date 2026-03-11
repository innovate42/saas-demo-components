import React from "react"
import MaltegoDataCaptureForm from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/MaltegoDataCaptureForm",
  component: MaltegoDataCaptureForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    redirectUrl: {
      control: { type: "text" },
      name: "Redirect URL",
    },
    submitLabel: {
      control: { type: "text" },
      name: "Submit Button Label",
    },
  },
  args: {
    redirectUrl: "",
    submitLabel: "Submit",
  },
}

const SampleFields = () => (
  <>
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor="email" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#333" }}>
        Email Address <span style={{ color: "#dc3545" }}>*</span>
      </label>
      <input type="email" id="email" name="email" required placeholder="you@company.com" />
    </div>
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor="orgType" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#333" }}>
        Organisation Type <span style={{ color: "#dc3545" }}>*</span>
      </label>
      <select id="orgType" name="orgType" required>
        <option value="">Select...</option>
        <option value="law_enforcement">Law Enforcement</option>
        <option value="government">Government Agency</option>
        <option value="enterprise">Enterprise</option>
        <option value="education">Education / Research</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor="country" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#333" }}>
        Country <span style={{ color: "#dc3545" }}>*</span>
      </label>
      <input type="text" id="country" name="country" required placeholder="e.g. Germany" />
    </div>
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor="companyName" style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#333" }}>
        Company Name
      </label>
      <input type="text" id="companyName" name="companyName" placeholder="Your company name" />
    </div>
  </>
)

const Template = (args) => {
  __mockConfig.propsOverride = {
    requiredLabel: "Required",
    optionalLabel: "",
    submitLabel: args.submitLabel,
    "successFormMessage__limio_richtext": "Thank you for submitting your information.",
    "invalidFormMessage__limio_richtext": "Your information could not be submitted. Please check your answers and try again.",
    redirectUrl: args.redirectUrl,
  }
  return (
    <MaltegoDataCaptureForm>
      <SampleFields />
    </MaltegoDataCaptureForm>
  )
}

export const Default = {
  name: "Default (No Redirect)",
  render: Template,
}

export const WithRedirect = {
  name: "With Redirect URL",
  args: {
    redirectUrl: "/checkout",
    submitLabel: "Continue to Checkout",
  },
  render: Template,
}

export const CustomMessages = {
  name: "Custom Messages & Colors",
  render: (args) => {
    __mockConfig.propsOverride = {
      requiredLabel: "Required",
      submitLabel: "Send",
      "successFormMessage__limio_richtext": "<strong>Success!</strong> Your vetting information has been received.",
      "successFormMessageFontColor__limio_color": "#155724",
      "successFormMessageBackgroundColor__limio_color": "#d4edda",
      "invalidFormMessage__limio_richtext": "<strong>Error:</strong> Please check the form fields and try again.",
      "invalidFormMessageFontColor__limio_color": "#721c24",
      "invalidFormMessageBackgroundColor__limio_color": "#f8d7da",
      redirectUrl: "",
    }
    return (
      <MaltegoDataCaptureForm>
        <SampleFields />
      </MaltegoDataCaptureForm>
    )
  },
}
