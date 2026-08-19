import { createApp } from "vue";
import { createPinia } from "pinia";
import type { Component, Plugin } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@Passets/css/base.css";
import { permission } from "@Passets/directives/permission";

/**
 * 创建微应用实例的通用方法
 * @param App 根组件
 * @param useList 配置选项
 */
export function createMicroApp(App: Component, useList: Plugin[] = []) {
  let instance: ReturnType<typeof createApp> | null = null;
  const mainPinia = window.parent?.$mainPinia;

  const render = () => {
    const app = createApp(App);
    instance = app;

    // 配置Element Plus
    app.use(ElementPlus, {
      locale: zhCn,
    });

    // 如果有主应用的Pinia，也使用它
    if (mainPinia) {
      app.use(mainPinia);
    }

    // 配置Pinia
    const appPinia = createPinia();
    app.use(appPinia);

    // 配置其他插件
    useList.forEach((item) => {
      app.use(item);
    });

    // 注册权限指令
    app.directive("permission", permission);

    // 挂载应用
    app.mount("#root");
  };

  // 微前端环境下的生命周期
  if (window.__POWERED_BY_WUJIE__) {
    window.__WUJIE_MOUNT = () => {
      render();
    };

    window.__WUJIE_UNMOUNT = () => {
      instance?.unmount();
      instance = null;
    };
  } else {
    // 非微前端环境且非独立运行
    document.body.innerHTML = `
      <div style="padding:10px;">
        PbstarAdmin 子应用依赖父应用，不能独立运行！
      </div>
    `;
  }

  return {
    instance,
    unmount: () => {
      instance?.unmount();
      instance = null;
    },
  };
}
