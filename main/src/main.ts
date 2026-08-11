import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@Passets/css/base.css";

import App from "./App.vue";
import router from "./router";
import { permission } from "@Passets/directives/permission";

// 屏蔽无界嵌套引起的vue路由警告（仅执行一次的幂等补丁，防止重复包装叠加）
if (!window.__warnPatched) {
  const originalWarn = console.warn;
  console.warn = (msg, ...args) => {
    if (
      String(msg).includes("history.state") &&
      String(msg).includes("manually replaced")
    ) {
      return;
    }
    originalWarn.apply(console, [msg, ...args]);
  };
  window.__warnPatched = true;
}

// 创建Vue应用实例
const app = createApp(App);

// 创建Pinia状态管理实例
const mainPinia = createPinia();
window.$mainPinia = mainPinia;

// 注册ElementPlus组件库
app.use(ElementPlus, {
  locale: zhCn,
});

// 注册Pinia和路由
app.use(mainPinia);
app.use(router);

// 注册权限指令
app.directive("permission", permission);

// 挂载应用
app.mount("#root");
