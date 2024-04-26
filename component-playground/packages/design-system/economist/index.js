//@flow

export * from "reactstrap"
import React from "react"
import {
  FormCheckbox,
  FormRadioButton,
  FormFieldText,
  FormFieldSelect,
  FormFieldNumber,
  FormFieldDate,
  FormFieldTextArea,
  FormLabel as Label,
  FormNotice,
  Button as _Button,
  BannerAlert,
  Tooltip,
  LinkWithArrow,
  Tabs,
  Tab
} from "@economist/design-system/dist/umd/common"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Skeleton } from "@limio/ui/Skeleton"

const CustomInput = ({ type, label, error, ...rest }) => (
  <>
    {type === "radio" ? <FormRadioButton labelText={label} error={error} {...rest} /> : <FormCheckbox error={error} labelText={label} {...rest} />}
    {error && <FormNotice text={error} />}
  </>
)

const SelectField = ({ childOpts = [], ...rest }) => {
  const options = childOpts.map(child => ({ value: child?.props?.value, label: child?.props?.children }))

  return <FormFieldSelect options={options} {...rest} />
}

const Button = ({ type, children, ...rest }) =>
  type === "link-with-arrow" ? <LinkWithArrow childOpts={children} {...rest} /> : <_Button {...rest}>{children}</_Button>

const Input = ({ type, children, ...rest }) => {
  switch (type) {
    case "select":
      return <SelectField childOpts={children} {...rest} />
    case "number":
      return <FormFieldNumber {...rest} />
    case "date":
      return <FormFieldDate {...rest} />
    case "text-area":
      return <FormFieldTextArea {...rest} />
    default:
      return <FormFieldText {...rest} />
  }
}

const Alert = ({ isOpen, variant, toggle, ...rest }) => <BannerAlert isClosed={!isOpen} handleClose={toggle} {...rest} variant={variant} />

const NavTabs = ({ content, renderContent, subOfferGroup }) => {
  return (
    <Tabs>
      {content.map((contentGroup, index) => (
        <Tab key={index} id={`tab${index}`} title={contentGroup.label} defaultSelected={contentGroup.id === subOfferGroup}>
          {renderContent(contentGroup)}
        </Tab>
      ))}
    </Tabs>
  )
}

function LoadingSpinner(): React$Element<any> {
  return <FontAwesomeIcon icon={faSpinner} style={{ margin: "auto", width: "100%", textAlign: "center" }} spin />
}

type SkeletonProps = {
  width: string,
  height: string
}

function LoadingSkeleton({ width, height }: SkeletonProps): React.Node {
  return <Skeleton variant="rect" width={width} height={height} />
}

export { Input, Button, Alert, CustomInput, Label, Tooltip, FormNotice, NavTabs, LoadingSpinner, LoadingSkeleton }
