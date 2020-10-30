const path = require("path");
const slsWebpack = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: slsWebpack.lib.webpack.isLocal ? "development" : "production",
  entry: slsWebpack.lib.entries,
  devtool: "source-map",
  externals: [nodeExternals()],
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  resolve: { extensions: [".ts", ".js"] },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
};
