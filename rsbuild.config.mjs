import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";
import { checkUniqueKeyPlugin } from "./build/plugins/checkUniqueKeyPlugin";
import apps from "./apps/apps.json";

const appsConfig = {};
apps.forEach((item) => {
  appsConfig[item.name] = {
    srcPah: `./apps/${item.name}/src`,
    source: {
      entry: {
        index: `./apps/${item.name}/src/main.js`,
      },
    },
    output: {
      distPath: {
        root: `./build/dist/${item.name}`,
      },
    },
    resolve: {
      alias: {
        "@": `./apps/${item.name}/src`,
      },
    },
    plugins: [
      checkUniqueKeyPlugin({
        checkPath: `./apps/${item.name}/src`,
        checkKeys: ["tableKey", "table-key"],
      }),
    ],
  };
});

export default defineConfig({
  plugins: [pluginVue(), pluginSass()],
  output: {
    legalComments: "none",
  },
  resolve: {
    alias: {
      "@Pcomponents": "./components",
      "@Pconfig": "./config",
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
        title: import.meta.env.PUBLIC_TITLE,
        favicon: "./main/src/assets/imgs/logo.png",
      },
      srcPah: "./main/src",
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
        pluginVue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => /^micro-app/.test(tag),
            },
          },
        }),
        checkUniqueKeyPlugin({
          checkPath: "./main/src",
          checkKeys: ["tableKey", "table-key"],
        }),
      ],
    },
    ...appsConfig,
  },
});
