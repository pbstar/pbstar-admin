import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";
import { checkUniqueKeyPlugin } from "./tools/plugins/checkUniqueKeyPlugin";
import { distZipPlugin } from "./tools/plugins/distZipPlugin";
import apps from "./apps/apps.json";

const appsConfig = {};
apps.forEach((item) => {
  const base = `./apps/${item.type}/${item.key}`;
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
