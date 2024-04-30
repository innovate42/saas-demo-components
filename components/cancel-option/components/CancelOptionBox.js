// @flow

import React from "react"

type Props = {
    boxTitle: string,
    boxText: string,
    buttonText: string,
    highlighted: boolean,
    highlightBoxText: string,
    buttonLink: string
}

function CancelOptionBox({
                             boxTitle,
                             boxText,
                             buttonText,
                             highlighted,
                             highlightBoxText,
                             buttonLink
                         }: Props): React.Node {

    const handleClick = () => {
        const absoluteUrl = new URL(buttonLink, window.location.origin)
        const searchParams = new URLSearchParams(absoluteUrl.search)
        const subscriptionId = searchParams.get("subId")

        searchParams.set("ltm_option", boxTitle)
        searchParams.set("subId", subscriptionId)
        // Append search parameters back to the URL
        absoluteUrl.search = searchParams.toString()

        // Update state with the new URL
        window.location.href = absoluteUrl.toString()
    }

    return (
        <div
            className={`basis-650 flex col flex-1 justify-center align-center bg-white p-0 shadow mw-custom mh-max mh-min  ${highlighted ? "highlighted" : ""}`}
            style={{"--dynamicContent": `"${highlightBoxText}"`}}>
            <h2 className={"p-1r brandon-regular"}>{boxTitle}</h2>
            <div className={"flex col align-center bg-light-grey p-1r space-between"}>
        <span>
          <div dangerouslySetInnerHTML={{__html: boxText}}/>
        </span>
                <button onClick={handleClick} className={"purple-btn"}>
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

export default CancelOptionBox
