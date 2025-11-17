import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@Passets/css/base.css";

/**
 * 创建微应用实例的通用方法
 * @param {Component} App - 根组件
 * @param {Array} useList - 配置选项
 */
export function createMicroApp(App, useList = []) {
  let instance = null;
  const mainPinia = window.parent?.$mainPinia;

  const render = () => {
    instance = createApp(App);

    // 配置Element Plus
    instance.use(ElementPlus, {
      locale: zhCn,
    });

    // 如果有主应用的Pinia，也使用它
    if (mainPinia) {
      instance.use(mainPinia);
    }

    // 配置Pinia
    const appPinia = createPinia();
    instance.use(appPinia);

    // 配置其他插件
    useList.forEach((item) => {
      instance.use(item);
    });

    // 挂载应用
    instance.mount("#root");
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
