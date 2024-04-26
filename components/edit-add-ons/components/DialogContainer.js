// @flow

import React from "react"
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js"
import { v4 as uuid } from "uuid"
import { Alert, Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader } from "@limio/design-system"

type Props = {
  open: boolean,
  setOpen: boolean => void,
  order: Object,
  subscription: Object
}

const industries = [
  "AGRICULTURE",
  "AUTOMOTIVE",
  "BANKING",
  "CONSUMER",
  "EDUCATION",
  "ELECTRONICS",
  "ENERGY",
  "ENGINEERING",
  "FAST_MOVING_CONSUMER_GOODS",
  "FINANCIAL",
  "FINTECH",
  "FOOD_AND_BEVERAGE",
  "GOVERNMENT",
  "HEALTHCARE",
  "HOSPITALITY",
  "INSURANCE",
  "JEWELRY",
  "LEGAL",
  "MANUFACTURING",
  "MEDIA",
  "NOT_FOR_PROFIT",
  "OIL_AND_GAS",
  "ONLINE",
  "RAW_MATERIALS",
  "REAL_ESTATE",
  "RELIGION",
  "RETAIL",
  "TECHNOLOGY",
  "TELECOMMUNICATIONS",
  "TRANSPORTATION",
  "TRAVEL"
]

const companyStatuses = ["PUBLIC", "PRIVATE", "NON_PROFIT"]

const businessTypes = ["Corporation", "Limited Liability Corporation", "Non-Profit Corporation", "Partnership", "Sole Proprietorship", "Co-operative"]

export function DialogContainer({ open, setOpen, order, subscription }: Props) {
  const [errorMsg, setErrorMsg] = React.useState("")

  const [companyName, setCompanyName] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [companyIndustry, setCompanyIndustry] = React.useState("")
  const [taxNum, setTaxNum] = React.useState("")
  const [companyStatus, setCompanyStatus] = React.useState("")
  const [businessType, setBusinessType] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  const [missingFields, setMissingFields] = React.useState([])


  const handleClose = () => {
    setOpen(false)
  }

  const clearErrorMsg = () => {
    setTimeout(() => {
      setErrorMsg("")
    }, 5000)
  }

  const validate = () => {
    const emptyFields = [companyName, fullName, email, companyIndustry, taxNum, companyStatus, businessType].filter(val => val === "")
    const emailRegex = /\S+@\S+\.\S+/
    const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/

    if (!emailRegex.test(email)) {
      emptyFields.push(email)
    }

    if (!fullNameRegex.test(fullName)) {
      emptyFields.push(fullName)
    }

    if (emptyFields.length > 0) {
      setErrorMsg("Please fill out all fields.")
      clearErrorMsg()
      setMissingFields(emptyFields)
      setSubmitting(false)
      return false
    }
    setMissingFields(emptyFields)
    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    if (!validate()) return

    // update customer details order

    try {
      await sendOrder({
        order_type: "update_customer_details",
        forSubscription: {
          name: subscription.name
        },
        owner: subscription.owner,
        customerDetails: {
          company_name: companyName,
          full_name: fullName,
          email: email,
          company_industry: companyIndustry,
          tax_number: taxNum,
          company_status: companyStatus,
          business_type: businessType
        },
        external_id: uuid(),
        source: "string",
        process_immediately: true
      })
    } catch (e) {
      setErrorMsg("There has been an issue updating your details. Please try again later.")
      clearErrorMsg()
      return
    }
    await sendOrder(order)
    window.location.href = "/updateSuccess"
  }

  if (!open) return null

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" role="dialog" tabIndex="-1" style={{ display: "block" }}>
        <ModalHeader toggle={handleClose}>Additional Information Required</ModalHeader>
        {errorMsg !== "" && <Alert color="danger">{errorMsg}</Alert>}
        <ModalBody>
          <Form>
            {/* Replace MUI TextFields with Reactstrap Inputs */}
            <FormGroup>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyName"
                id="companyName"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                invalid={missingFields.includes(companyName)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Full Name (First & Last)"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                invalid={missingFields.includes(fullName)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                invalid={missingFields.includes(email)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Company Industry</Label>
              <Input
                type="select"
                name="select"
                id="companyIndustry"
                value={companyIndustry}
                onChange={e => setCompanyIndustry(e.target.value)}
                invalid={missingFields.includes(companyIndustry)}
              >
                {industries.map(industry => (
                  <option key={industry}>{industry}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Tax EIN (US) or BN (Canada)</Label>
              <Input
                type="text"
                name="taxNum"
                id="taxNum"
                placeholder="Tax EIN (US) or BN (Canada)"
                value={taxNum}
                onChange={e => setTaxNum(e.target.value)}
                invalid={missingFields.includes(taxNum)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Company Status</Label>
              <Input
                type="select"
                name="select"
                id="companyStatus"
                value={companyStatus}
                onChange={e => setCompanyStatus(e.target.value)}
                invalid={missingFields.includes(companyStatus)}
              >
                {companyStatuses.map(status => (
                  <option key={status}>{status}</option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Business Type</Label>
              <Input
                type="select"
                name="select"
                id="businessType"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                invalid={missingFields.includes(businessType)}
              >
                {businessTypes.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit} disabled={submitting}>
            Submit
          </Button>
        </ModalFooter>
      </div>
    </>
  )
}

export default DialogContainer
