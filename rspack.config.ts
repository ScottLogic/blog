import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";

export default defineConfig({
  entry: {
    page: [
      "./scripts/initialise-menu.js",
      "./scripts/jquery-1.9.1.js",
      "./scripts/load-clap-count.js",
      "./scripts/elapsed.js",
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
    scriptType: "text/javascript",
  },
  plugins: [
    new rspack.ProvidePlugin({
      // We have jquery, trust
      jQuery: "jquery",
    }),
  ],
  mode: process.env.JEKYLL_ENV === "production" ? "production" : "development",
});
