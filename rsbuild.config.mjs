import { defineConfig } from "@rsbuild/core";
import fs from "fs-extra";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";
import { checkUniqueKeyPlugin } from "./tools/plugins/checkUniqueKeyPlugin";
import { distZipPlugin } from "./tools/plugins/distZipPlugin";
import { outAppRegisterPackages } from "./tools/plugins/outAppRegisterPackages";

import apps from "./apps/apps.json" with { type: "json" };
import rootPackage from "./package.json" with { type: "json" };

const appsConfig = {};
apps.forEach((item) => {
  let base = "";
  let appPackage = null;
  if (item.type === "in") {
    base = `./apps/${item.key}`;
  } else {
    base = `../pbstar-admin-apps/${item.key}`;
    appPackage = fs.readJsonSync(`${base}/package.json`);
  }
  appsConfig[item.key] = {
    source: {
      entry: {
        index: `${base}/src/main.js`,
      },
    },
    output: {
      distPath: {
        root: `./build/dist/${item.key}`,
      },
    },
    resolve: {
      alias: {
        "@": `${base}/src`,
        ...(appPackage ? outAppRegisterPackages(rootPackage, appPackage) : {}),
      },
    },
    plugins: [
      checkUniqueKeyPlugin({
        checkPath: `${base}/src`,
        checkKeys: ["tableKey", "table-key"],
      }),
    ],
  };
});

export default defineConfig({
  plugins: [pluginVue(), pluginSass(), distZipPlugin()],
  output: {
    legalComments: "none",
  },
  resolve: {
    alias: {
      "@Pcomponents": "./components",
      "@Passets": "./assets",
    },
  },
  server: {
    proxy: {
      "/api_base": {
        target: import.meta.env.PUBLIC_API_BASE_URL,
        pathRewrite: { "^/api_base": "" },
        changeOrigin: true,
      },
    },
  },
  environments: {
    main: {
      html: {
        template: "./main/src/assets/html/index.html",
        title: import.meta.env.PUBLIC_TITLE,
        favicon: "./main/src/assets/imgs/logo.png",
      },
      source: {
        entry: {
          index: "./main/src/main.js",
        },
      },
      output: {
        distPath: {
          root: "./build/dist/main",
        },
      },
      resolve: {
        alias: {
          "@": "./main/src",
        },
      },
      plugins: [
        checkUniqueKeyPlugin({
          checkPath: "./main/src",
          checkKeys: ["tableKey", "table-key"],
        }),
      ],
    },
    ...appsConfig,
  },
});
