import React from "react"
import FAQAccordion from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/FAQAccordion",
  component: FAQAccordion,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    borderColor: {
      control: { type: "color" },
      name: "Border Color",
      description: "Divider line color between FAQ items",
    },
  },
  args: {
    borderColor: "#e8ecf1",
  },
}

export const Default = {
  render: (args) => {
    __mockConfig.propsOverride = {
      borderColor__limio_color: args.borderColor,
    }
    return <FAQAccordion />
  },
}
