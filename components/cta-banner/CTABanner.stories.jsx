import React from "react"
import CTABanner from "./index"
import { __mockConfig } from "@limio/sdk"

export default {
  title: "Components/CTABanner",
  component: CTABanner,
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
    ctaBackgroundColor: {
      control: { type: "color" },
      name: "CTA Button Color",
    },
    ctaTextColor: {
      control: { type: "color" },
      name: "CTA Text Color",
    },
    layout: {
      control: { type: "select" },
      options: ["center", "left", "split"],
      name: "Layout",
    },
  },
  args: {
    backgroundColor: "#0B1D3A",
    textColor: "#FFFFFF",
    ctaBackgroundColor: "#E94560",
    ctaTextColor: "#FFFFFF",
    layout: "center",
  },
}

const Template = (args) => {
  __mockConfig.propsOverride = {
    backgroundColor__limio_color: args.backgroundColor,
    textColor__limio_color: args.textColor,
    ctaBackgroundColor__limio_color: args.ctaBackgroundColor,
    ctaTextColor__limio_color: args.ctaTextColor,
    layout: args.layout,
  }
  return <CTABanner />
}

export const Default = {
  name: "Center Layout",
  render: Template,
}

export const SplitLayout = {
  name: "Split Layout",
  args: {
    backgroundColor: "#F5F7FA",
    textColor: "#0B1D3A",
    ctaBackgroundColor: "#1A5DAD",
    ctaTextColor: "#FFFFFF",
    layout: "split",
  },
  render: (args) => {
    __mockConfig.propsOverride = {
      headline: "Need expert help?",
      "description__limio_richtext":
        "<p>Our team of email marketing experts is here to help you get the most out of your campaigns.</p>",
      ctaText: "Talk to an expert",
      ctaUrl: "/contact",
      backgroundColor__limio_color: args.backgroundColor,
      textColor__limio_color: args.textColor,
      ctaBackgroundColor__limio_color: args.ctaBackgroundColor,
      ctaTextColor__limio_color: args.ctaTextColor,
      layout: args.layout,
      componentId: "cta-expert",
    }
    return <CTABanner />
  },
}

export const LeftLayout = {
  name: "Left Layout",
  args: {
    backgroundColor: "#0B1D3A",
    textColor: "#FFFFFF",
    ctaBackgroundColor: "#E94560",
    ctaTextColor: "#FFFFFF",
    layout: "left",
  },
  render: (args) => {
    __mockConfig.propsOverride = {
      headline: "Ready to get started?",
      "description__limio_richtext":
        "<p>Join thousands of teams already using our platform.</p>",
      ctaText: "Start free trial",
      ctaUrl: "/trial",
      backgroundColor__limio_color: args.backgroundColor,
      textColor__limio_color: args.textColor,
      ctaBackgroundColor__limio_color: args.ctaBackgroundColor,
      ctaTextColor__limio_color: args.ctaTextColor,
      layout: args.layout,
      componentId: "cta-left",
    }
    return <CTABanner />
  },
}
