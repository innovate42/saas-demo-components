import React from "react"
import { LimioProvider, ComponentContext } from "@limio/sdk"
import IrmiHome from "../../../components/IRMI-HOME"

export default {
    title: "IRMI/Home",
    component: IrmiHome,
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

export const CustomLoginRoute = {
    args: {
        loginUrl: "/account",
        loginLabel: "Sign In",
        openLoginInNewTab: true,
    },
}
