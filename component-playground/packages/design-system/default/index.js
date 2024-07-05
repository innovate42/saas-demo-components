// @flow

import * as React from "react"
import { Input as ReactStrapInput, FormFeedback as FormNotice, CustomInput as StrapCustomInput, Button as StrapButton } from "reactstrap"
import { useState } from "react"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
// import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Skeleton } from "@limio/ui/Skeleton"

type InputProps = {
  type: string,
  error: string
}

export function Button({ minor, ...props }): React.Node {
  // ignore minor as that is an economist
  return <StrapButton {...props} />
}

export function CustomInput({ error, ...props }): React.Node {
  // ignore error as that is an economist
  return <StrapCustomInput {...props} />
}

function Input({ type, onChange, error, ...rest }: InputProps): React.Node {
  // ignore the error field here as that is used by the economist design system. TODO: we need to address this as we shouldn't need to do this
  return <ReactStrapInput type={type} {...rest} onChange={onChange} />
}

function NavTabs({ content, renderContent }): React.Node {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <Nav tabs>
        {content.map((data, index) => (
          <NavItem>
            <NavLink className={activeTab == index ? "active" : ""} onClick={() => setActiveTab(index)}>
              {data.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <TabContent activeTab={activeTab}>
        {content.map((contentGroup, index) => (
          <TabPane tabId={index}> {renderContent(contentGroup)}</TabPane>
        ))}
      </TabContent>
    </div>
  )
}

// function LoadingSpinner(): React$Element<any> {
//   return (
//     <FontAwesomeIcon
//       icon={faSpinner}
//       style={{ margin: "auto", width: "100%", textAlign: "center" }}
//       className="fa-spin"
//       title="loading"
//       aria-busy="true"
//       aria-live="polite"
//     />
//   )
// }
//
type SkeletonProps = {
  width: string,
  height: string
}

function LoadingSkeleton({ width, height }: SkeletonProps): React.Node {
  return <Skeleton variant="rect" width={width} height={height} />
}

export * from "reactstrap"
export { Input, FormNotice, NavTabs, LoadingSkeleton }
// LoadingSpinner

// make the export explict so they are picked up by flow
export { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
export { Tooltip } from "reactstrap"
export { Alert } from "reactstrap"
export { ListGroup, ListGroupItem } from "reactstrap"
export { Table, Col, Row } from "reactstrap"
export { Form, FormFeedback, FormText, FormGroup } from "reactstrap"
export { Label } from "reactstrap"

