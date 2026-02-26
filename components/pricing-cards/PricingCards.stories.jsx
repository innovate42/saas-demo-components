import React from "react"
import PricingCards from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/PricingCards",
  component: PricingCards,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    primaryColor: {
      control: { type: "color" },
      name: "Primary Color",
      description: "CTA button color for non-highlighted cards",
    },
    highlightColor: {
      control: { type: "color" },
      name: "Highlight Tier Background",
      description: "Background color for the best-value card",
    },
    checkColor: {
      control: { type: "color" },
      name: "Checkmark Color",
      description: "Feature list checkmark color",
    },
  },
  args: {
    primaryColor: "#0B1D3A",
    highlightColor: "#0B1D3A",
    checkColor: "#1A5DAD",
  },
}

export const Default = {
  render: (args) => {
    __mockConfig.propsOverride = {
      primaryColor__limio_color: args.primaryColor,
      highlightColor__limio_color: args.highlightColor,
      checkColor__limio_color: args.checkColor,
    }
    return <PricingCards />
  },
}
