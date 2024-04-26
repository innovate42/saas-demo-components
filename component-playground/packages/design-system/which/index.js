//@flow

export * from "reactstrap"
import React from "react"
import { Input as RSInput, Button as RSButton } from "reactstrap"
import { Button as _Button, Tooltip, Input as _Input, Checkbox, Radio } from "@which/seatbelt"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const CustomInput = ({ type, onChange, error, ...rest }) => (
  <>
    {type === "checkbox" ? <Checkbox onChangeCallback={onChange} {...rest} /> : <Radio type={type} onChange={onChange} {...rest} />}
    {error && (
      <span className={"custom-input-error"} data-testid="input-validation-error">
        {error}
      </span>
    )}
  </>
)

const Input = ({ type, error, children, ...rest }) => {
  switch (type) {
    case "select":
      return (
        <RSInput type={type} error={error} {...rest}>
          {children}
        </RSInput>
      )
    case "date":
      return (
        <RSInput type={type} error={error} {...rest}>
          {children}
        </RSInput>
      )
    default:
      return <_Input type={type} hasErrors={!!error} className={!!error ? "is-invalid" : "is-valid"} {...rest} />
  }
}

function LoadingSpinner(): React$Element<any> {
  return <FontAwesomeIcon icon={faSpinner} style={{ margin: "auto", width: "100%", textAlign: "center" }} spin />
}

function LoadingSkeleton(): React.Node {
  return <LoadingSpinner />
}

function Button({ disabled, ...rest }) {
  return <_Button appearance={disabled} disabled={disabled} {...rest} />
}

export { Button, Tooltip, Input, CustomInput, LoadingSpinner, LoadingSkeleton }
