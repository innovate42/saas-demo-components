import path, {dirname, join} from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        getAbsolutePath("@storybook/addon-onboarding"),
        getAbsolutePath("@storybook/addon-links"),
        getAbsolutePath("@storybook/addon-essentials"),
        getAbsolutePath("@chromatic-com/storybook"),
        getAbsolutePath("@storybook/addon-interactions"),
        "@storybook/addon-styling-webpack",
        path.resolve(__dirname, "addon-prompt"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/react-webpack5"),
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    webpackFinal: async (config) => {
        // Ensure babel-loader handles JS/JSX with React preset
        config.module.rules.push({
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: require.resolve("babel-loader"),
                options: {
                    presets: [
                        require.resolve("@babel/preset-react"),
                    ],
                },
            },
        })

        config.resolve.alias = {
            ...config.resolve.alias,
            "react-native": "react-native-web",
            "@limio/design-system": path.resolve(
                __dirname,
                path.join("..", "packages", "design-system", "default")
            ),
            "@limio/currency": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "currency")
            ),
            "@limio/date": path.resolve(__dirname, path.join("..", "packages", "limio", "utils", "string")),
            "@limio/resources": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "resources")
            ),
            "@limio/sdk": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "sdk")
            ),
            "@limio/sdk/offers": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "sdk", "offers.js")
            ),
            "@limio/sdk/subscription": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "sdk", "subscription.js")
            ),
            "@limio/sdk/components": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "sdk", "src", "components")
            ),
            "@limio/internal-checkout-sdk": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "internal-checkout-sdk")
            ),
            "@limio/shop": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "shop")
            ),
            "@limio/utils": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "utils")
            ),
            "@limio/ui": path.resolve(
                __dirname,
                path.join("..", "packages", "limio", "ui")
            ),
        };

        return config;
    }
};

export default config;
