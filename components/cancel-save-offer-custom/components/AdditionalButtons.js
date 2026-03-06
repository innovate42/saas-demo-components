import * as React from "react"
import { useComponentStaticProps } from "../componentStaticProps"
import { Button } from "@limio/design-system"

export function AdditionalButtons() {
  const { additionalButtons } = useComponentStaticProps()

  const onRedirectClick = url => {
    let params = new URL(window.location).searchParams
    window.location.href = `${url}?subId=${params.get("subId")}`
  }

  return (
    <div className="additional-buttons-container">
      {additionalButtons.length > 0 &&
        additionalButtons.map((additionalButton, index) => (
          <Button className="additional-button" onClick={() => onRedirectClick(additionalButton.url)} key={`additional-button-${index}`}>
            {additionalButton.label}
          </Button>
        ))}
    </div>
  )
}

export default AdditionalButtons
