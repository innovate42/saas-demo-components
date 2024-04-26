// a little bit complicated as we want to transpile files both during the gatsby pre-build stage and also during the build phases.
module.exports = function (api) {
  // docs are not clear https://babeljs.io/docs/en/babelconfigjs
  const gatsby_stage = process.env.GATSBY_BUILD_STAGE || "test"; // if we run things outside of gastby (eg jest) then this wont be defined
  api.cache.using(() => gatsby_stage);

  // watch up - gastby doesn't like inline pluings.  They need to be resolved from a file
  let config = {
    presets: [
      "@babel/preset-flow",
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
    babelrcRoots: [".", "../../packages/*"],
  };

  // dont print this during tests
  if (!process.env.NODE_ENV === "test") {
    console.log(
      `gatsby stage is ${
        process.env.GATSBY_BUILD_STAGE
      }, returning config ${JSON.stringify(config)}`
    );
  }

  return config;
};
