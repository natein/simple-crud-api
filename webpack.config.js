module.exports = {
  target: `node16`,
  entry: "./src/server.js",
  mode: "production",
  output: {
    module: false,
    filename: "bundle.js",
  },
  experiments: {
    outputModule: false,
  },
};