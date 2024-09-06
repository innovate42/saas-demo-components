//@flow
import * as React from "react";

type Props = {
  heading: string
}

function OpenText({ heading }: Props): React.Node {
  return <div>{heading}</div>;
}

export default OpenText