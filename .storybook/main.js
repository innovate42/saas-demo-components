const path = require("path")

module.exports = {
  stories: [
    "../components/**/*.stories.@(js|jsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-webpack5-compiler-babel",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // Resolve @limio/sdk to our mock
    config.resolve.alias = {
      ...config.resolve.alias,
      "@limio/sdk": path.resolve(__dirname, "../__mocks__/@limio/sdk.js"),
      "@limio/shop/src/shop/checkout/basket": path.resolve(__dirname, "../__mocks__/@limio/shop/basket.js"),
    }

    // Process .js/.jsx files in components/ with babel-loader (for JSX support)
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      include: [
        path.resolve(__dirname, "../components"),
        path.resolve(__dirname, "../__mocks__"),
      ],
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
        },
      },
    })

    // Ensure Storybook's built-in CSS rule covers the components directory
    // by modifying existing CSS rules to not exclude our components
    config.module.rules.forEach((rule) => {
      if (rule && rule.test && rule.test.toString().includes("css")) {
        if (rule.exclude) {
          // Remove exclude so it processes components CSS too
          delete rule.exclude
        }
      }
    })

    return config
  },
}
