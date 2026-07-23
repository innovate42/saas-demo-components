import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import CafeynCoversBand from "../../../components/cafeyn-covers-band"

export default {
    title: "Cafeyn/Covers Band",
    component: CafeynCoversBand,
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

export const SlowScroll = {
    args: { scrollSeconds: 60 },
}
