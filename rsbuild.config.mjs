import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
  plugins: [
    pluginVue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      },
    }),
    pluginSass(),
  ],
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
      },
      source: {
        entry: {
          index: "./main/src/main.js",
        },
      },
      output: {
        distPath: {
          root: "./dist/main",
        },
      },
      resolve: {
        alias: {
          "@": "./main/src",
        },
      },
    },
    "app-example": {
      source: {
        entry: {
          index: "./apps/app-example/src/main.js",
        },
      },
      output: {
        distPath: {
          root: "./dist/app-example",
        },
      },
      resolve: {
        alias: {
          "@": "./apps/app-example/src",
        },
      },
    },
    "app-system": {
      source: {
        entry: {
          index: "./apps/app-system/src/main.js",
        },
      },
      output: {
        distPath: {
          root: "./dist/app-system",
        },
      },
      resolve: {
        alias: {
          "@": "./apps/app-system/src",
        },
      },
    },
  },
});
