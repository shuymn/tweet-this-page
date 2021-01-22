const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/**
 * @type import("webpack").Configuration
 */
const config = {
  entry: {
    background: path.join(__dirname, "src/scripts/background.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "scripts/[name].js",
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks: "initial",
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: "ts-loader", options: { transpileOnly: true } },
        exclude: [/node_modules/, "/**/*.test.ts"],
      },
    ],
  },
  resolve: { extensions: [".js", ".ts", ".json"] },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "./" },
        { from: "./src/locales", to: "./_locales" },
        { from: "./src/images", to: "./images" },
      ],
    }),
  ],
};

module.exports = (_env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
  }
  return config;
};
