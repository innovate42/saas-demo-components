// @flow
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

type Props = {
  returnToAccountLink: string
}
function ReturnAccount({returnToAccountLink}: Props): React.Node {
  const onClick = () => {
    window.location.href = returnToAccountLink
  }

  return (
    <button className="link-button" onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
      {" "}Return to my account
    </button>
  )
}

export default ReturnAccount
