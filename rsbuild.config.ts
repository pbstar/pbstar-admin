import { defineConfig, loadEnv } from "@rsbuild/core";
import type { EnvironmentConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";
import { distZipPlugin } from "./tools/plugins/distZipPlugin";
import apps from "./apps/apps.json" with { type: "json" };

// 配置文件运行在 Node 侧，显式读取 .env 环境变量（import.meta.env 不可靠）
const { rawPublicVars } = loadEnv();
const PUBLIC_TITLE = rawPublicVars.PUBLIC_TITLE;
const PUBLIC_API_BASE_URL = rawPublicVars.PUBLIC_API_BASE_URL;

const createAppConfig = (app: { key: string }): EnvironmentConfig => {
  const basePath = `./apps/${app.key}`;
  return {
    source: {
      entry: { index: `${basePath}/src/main.ts` },
    },
    output: {
      distPath: { root: `./build/dist/${app.key}` },
    },
    resolve: {
      alias: {
        "@": basePath + "/src",
      },
    },
  };
};

const mainConfig: EnvironmentConfig = {
  html: {
    template: "./main/src/assets/html/index.html",
    title: PUBLIC_TITLE,
    favicon: "./main/src/assets/imgs/logo.png",
  },
  source: {
    entry: { index: "./main/src/main.ts" },
  },
  output: {
    distPath: { root: "./build/dist/main" },
  },
  resolve: {
    alias: { "@": "./main/src" },
  },
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
        target: PUBLIC_API_BASE_URL,
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
    printUrls: false,
  },
  environments: {
    main: mainConfig,
    ...Object.fromEntries(apps.map((app) => [app.key, createAppConfig(app)])),
  },
});
