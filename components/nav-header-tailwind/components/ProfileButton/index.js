// @flow
import React, { useState } from "react"
import { useLimioContext } from "@limio/sdk"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "@limio/design-system"


type Props = {
  mobile: boolean,
  signOut: () => void,
  username: string,
  userEmail: string
}

function ProfileButton({ mobile, signOut, username, userEmail, profileColor__limio_color, profileHref }: Props): React.Node {

  const [profileOpen, setProfileOpen] = useState(false)
  const { isInPageBuilder } = useLimioContext()

  return (
    <Dropdown
      className={`profile-button ${mobile ? "mobile" : ""}`}
      isOpen={profileOpen}
      direction="down"
      toggle={() => {
        if (!isInPageBuilder) {
          setProfileOpen(!profileOpen)
        }
      }}
    >
      <DropdownToggle
        style={{
          color: profileColor__limio_color,
          borderColor: profileColor__limio_color
        }}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="user-circle"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          className="svg-inline--fa fa-user-circle fa-w-18"
          style={{ width: "1.125em", height: "1em" }}
        >
          <path
            fill="currentColor"
            d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"
          />
        </svg>
      </DropdownToggle>
      <DropdownMenu right>
        {username ? (
          <>
            <DropdownItem header>{userEmail ? `Signed in as ${userEmail}` : "Signed in"}</DropdownItem>
            <DropdownItem onClick={signOut}>Logout</DropdownItem>
          </>
        ) : (
          <DropdownItem href={profileHref}>Log In</DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileButton
