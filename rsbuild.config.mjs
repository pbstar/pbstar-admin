import { defineConfig } from "@rsbuild/core";
import fs from "fs-extra";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";
import { checkUniqueKeyPlugin } from "./tools/plugins/checkUniqueKeyPlugin";
import { distZipPlugin } from "./tools/plugins/distZipPlugin";
import { outAppRegisterPackages } from "./tools/plugins/outAppRegisterPackages";
import apps from "./apps/apps.json" with { type: "json" };
import rootPackage from "./package.json" with { type: "json" };

const createAppConfig = (app) => {
  const isInternal = app.type === "in";
  const basePath = isInternal
    ? `./apps/${app.key}`
    : `../pbstar-admin-apps/${app.key}`;
  const appPackage = isInternal
    ? null
    : fs.readJsonSync(`${basePath}/package.json`);

  return {
    source: {
      entry: { index: `${basePath}/src/main.js` },
    },
    output: {
      distPath: { root: `./build/dist/${app.key}` },
    },
    resolve: {
      alias: {
        "@": basePath + "/src",
        ...(appPackage ? outAppRegisterPackages(rootPackage, appPackage) : {}),
      },
    },
    plugins: [
      checkUniqueKeyPlugin({
        checkPath: `${basePath}/src`,
        checkKeys: ["tableKey", "table-key"],
      }),
    ],
  };
};

const mainConfig = {
  html: {
    template: "./main/src/assets/html/index.html",
    title: import.meta.env.PUBLIC_TITLE,
    favicon: "./main/src/assets/imgs/logo.png",
  },
  source: {
    entry: { index: "./main/src/main.js" },
  },
  output: {
    distPath: { root: "./build/dist/main" },
  },
  resolve: {
    alias: { "@": "./main/src" },
  },
  plugins: [
    checkUniqueKeyPlugin({
      checkPath: "./main/src",
      checkKeys: ["tableKey", "table-key"],
    }),
  ],
};

export default defineConfig({
  plugins: [pluginVue(), pluginSass(), distZipPlugin()],
  output: { legalComments: "none" },
  resolve: {
    alias: {
      "@Pcomponents": "./components",
      "@Passets": "./assets",
    },
  },
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.PUBLIC_API_BASE_URL,
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
  environments: {
    main: mainConfig,
    ...Object.fromEntries(apps.map((app) => [app.key, createAppConfig(app)])),
  },
});
