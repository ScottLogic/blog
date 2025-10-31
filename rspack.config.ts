import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";

const isProd = process.env["JEKYLL_ENV"] === "production";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
            target: "es2020",
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  entry: {
    page: [
      "./scripts/index.ts",
      "./scripts/graft-studio/header-scroll.js",
      "./scripts/graft-studio/jquery.mmenu.all.js",
      "./scripts/graft-studio/jquery.matchHeight.js",
      "applause-button/dist/applause-button.js",
      "cookieconsent/build/cookieconsent.min.js",
    ],
  },
  output: {
    path: "_site/",
    filename: "script.js",
    scriptType: "module",
  },
  plugins: [
    new rspack.ProvidePlugin({
      // We have jquery, trust
      jQuery: "jquery",
    }),
    new rspack.DefinePlugin({
      BASE_URL: JSON.stringify(process.env["BASE_URL"] ?? ""),
    }),
  ],
  resolve: {
    extensions: [".js", ".json", ".wasm", ".ts"],
  },
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          compress: {
            passes: 0,
          },
        },
      }),
    ],
  },
  mode: isProd ? "production" : "development",
  devtool: isProd ? false : "source-map",
});
