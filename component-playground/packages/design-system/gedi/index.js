//@flow
import React, { useState } from "react"
import { Input as ReactStrapInput, Nav, NavItem, NavLink, TabContent, TabPane, FormFeedback as FormNotice } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Skeleton } from "@limio/ui/Skeleton"

const Input = ({ type, onChange, ...rest }) => {
  return <ReactStrapInput type={type} {...rest} onChange={onChange} />
}

const NavTabs = ({ content, renderContent }) => {
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

export * from "reactstrap"
export { Input, FormNotice, NavTabs, LoadingSpinner, LoadingSkeleton }
