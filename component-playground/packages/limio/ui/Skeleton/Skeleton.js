// @flow
import * as React from "react"
import "./Skeleton.css"

type Props = {
  width: string,
  height: string
}

export function Skeleton({ width = "auto", height = "auto" }: Props) {
  return <span className={`root pulse`} style={{ width: width, height: height }}></span>
}
