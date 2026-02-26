import React from "react"
import ComparisonTable from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/ComparisonTable",
  component: ComparisonTable,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    primaryColor: {
      control: { type: "color" },
      name: "Primary Color",
      description: "Accent color for table headers and checkmarks",
    },
  },
  args: {
    primaryColor: "#1A5DAD",
  },
}

export const Default = {
  render: (args) => {
    __mockConfig.propsOverride = {
      primaryColor__limio_color: args.primaryColor,
    }
    return <ComparisonTable />
  },
}
