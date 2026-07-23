import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CafeynHero from "../../../components/cafeyn-hero"

export default {
    title: "Cafeyn/Hero",
    component: CafeynHero,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
    decorators: [
        (Story, context) => (
            <LimioProvider>
                <ComponentContext.Provider value={context.args}>
                    <Story />
                </ComponentContext.Provider>
            </LimioProvider>
        ),
    ],
}

export const Default = { args: {} }

export const WithoutCovers = {
    args: { showCovers: false },
}

export const EnglishFallback = {
    args: {
        kicker: "Cafeyn for Business",
        heading: "The entire press for your team",
        subheading: "<p>2,500+ newspapers and magazines for every employee — one subscription, every title.</p>",
        primaryCta: "See plans",
        secondaryCta: "Contact sales",
        finePrint: "1–10 licenses self-serve · invoice & card payment",
    },
}
