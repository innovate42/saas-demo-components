module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": ["babel-jest", { presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-react"] }],
  },
  transformIgnorePatterns: ["/node_modules/"],
}
