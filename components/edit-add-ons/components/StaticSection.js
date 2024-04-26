// @flow

import * as React from "react"

type Props = {
  label: string,
  content: string,
}

function StaticSection({ label, content }: Props): React.Node {
  return (
    <>
      <div className="plan-title">{label}</div>
      <p>{content}</p>
      <div className="row-border"/>
    </>)
}

export default StaticSection
