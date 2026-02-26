import React from "react"
import PricingHero from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/PricingHero",
  component: PricingHero,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    backgroundColor: {
      control: { type: "color" },
      name: "Background Color",
    },
    textColor: {
      control: { type: "color" },
      name: "Text Color",
    },
  },
  args: {
    backgroundColor: "#0B1D3A",
    textColor: "#FFFFFF",
  },
}

export const Default = {
  render: (args) => {
    __mockConfig.propsOverride = {
      backgroundColor__limio_color: args.backgroundColor,
      textColor__limio_color: args.textColor,
    }
    return <PricingHero />
  },
}
