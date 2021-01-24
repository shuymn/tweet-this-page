const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

/**
 * @type import("webpack").Configuration
 */
const config = {
  entry: {
    background: path.join(__dirname, "src/background.ts"),
    content: path.join(__dirname, "src/content.ts"),
    popup: path.join(__dirname, "src/popup.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "scripts/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: "ts-loader", options: { transpileOnly: true } },
        exclude: [/node_modules/, "/**/*.test.ts"],
      },
    ],
  },
  resolve: { extensions: [".js", ".ts", ".tsx"], modules: ["node_modules"] },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/static", to: "./" },
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

  config.optimization = { minimize: argv.mode === "production" };

  return config;
};
