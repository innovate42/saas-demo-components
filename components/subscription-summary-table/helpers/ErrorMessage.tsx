import React from "react"
import { sanitiseHTML } from "@limio/sdk"

type ErrorMessageProps = {
  text?: string
  icon?: React.ReactNode
}

export function ErrorMessage({ icon, text }: ErrorMessageProps): React.JSX.Element {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px", paddingBottom: "20px" }}>
      {icon}
      <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(text) }} />
    </div>
  )
}
