import path, { join, dirname } from "path";

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
      getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
      getAbsolutePath("@storybook/addon-onboarding"),
      getAbsolutePath("@storybook/addon-links"),
      getAbsolutePath("@storybook/addon-essentials"),
      getAbsolutePath("@chromatic-com/storybook"),
      getAbsolutePath("@storybook/addon-interactions"),
      "@storybook/addon-styling-webpack"
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
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
      "@limio/resources": path.resolve(
          __dirname,
          path.join("..", "packages", "limio", "resources")
      ),
      "@limio/sdk": path.resolve(
          __dirname,
          path.join("..", "packages", "limio", "sdk")
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
