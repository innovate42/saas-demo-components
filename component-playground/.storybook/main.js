const path = require("path")

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
module.exports = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
        "@storybook/addon-styling-webpack",
        path.join(__dirname, "addon-prompt"),
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    webpackFinal: async (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "react-native": "react-native-web",
            "@limio/design-system": path.resolve(__dirname, "../packages/design-system/default"),
            "@limio/currency": path.resolve(__dirname, "../packages/limio/currency"),
            "@limio/date": path.resolve(__dirname, "../packages/limio/utils/string"),
            "@limio/resources": path.resolve(__dirname, "../packages/limio/resources"),
            "@limio/sdk": path.resolve(__dirname, "../packages/limio/sdk"),
            "@limio/sdk/components": path.resolve(__dirname, "../packages/limio/sdk/src/components"),
            "@limio/internal-checkout-sdk": path.resolve(__dirname, "../packages/limio/internal-checkout-sdk"),
            "@limio/shop": path.resolve(__dirname, "../packages/limio/shop"),
            "@limio/utils": path.resolve(__dirname, "../packages/limio/utils"),
            "@limio/ui": path.resolve(__dirname, "../packages/limio/ui"),
            "@limio/ui-preview-context": path.resolve(__dirname, "../packages/limio/ui-preview-context"),
            "@limio/shop-redux": path.resolve(__dirname, "../packages/limio/shop-redux"),
        }
        return config
    }
}
