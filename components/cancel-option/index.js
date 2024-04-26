//@flow

import React from "react"
import "./index.css"
import CancelOptionBox from "./components/CancelOptionBox"
import ReturnAccount from "./components/ReturnAccount"
// import { useSubscriptions } from "@limio/sdk"

type Props = {
  pageTitle: string,
  boxTextAndTitles: Array<{
    boxTitle: string,
    boxText: string,
    onTermText?: string,
    buttonText: string,
    highlighted: boolean,
    buttonLink: string
  }>,
  existingTermBoxTitle: string,
  highlightBoxText: string,
  returnToAccountLink: string,
}

function CancelOption({ pageTitle, boxTextAndTitles, existingTermBoxTitle, highlightBoxText, returnToAccountLink }: Props): React.Node {
  const onTerm = false // false is 2 boxes true is 1 box
  // const { subscriptions } = useSubscriptions() // returns a subscription[]
  // const onTerm = subscriptions.some((subscription) => subscription.status === "active" && new Date(subscription.offers.termEndDate) > new Date())

  const onAnActiveTerm = boxTextAndTitles.filter(item => !(onTerm && item.boxTitle.toLowerCase() === existingTermBoxTitle.toLowerCase()))

  return (
    <div className={"bg-grey flex col align-center height-100"}>
      <div className={"flex align-center relative w-full"}>
        <ReturnAccount returnToAccountLink={returnToAccountLink}/>
        <h1 className={"pb-2r pt-2r title brandon-bold"}>{pageTitle}</h1>
      </div>
      <div className={"flex justify-center align-center padding-10 gap-2r wrap"}>
        {onAnActiveTerm.map((item) => (
          <CancelOptionBox
            boxTitle={item.boxTitle}
            boxText={onTerm ? item.onTermText : item.boxText}
            buttonText={item.buttonText}
            highlighted={item.highlighted}
            key={JSON.stringify(item)}
            highlightBoxText={highlightBoxText}
            buttonLink={item.buttonLink}/>
        ))}
      </div>
    </div>
  )
}

export default CancelOption
