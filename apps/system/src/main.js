import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import router from "./router";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@Passets/css/base.css";
import App from "./App.vue";

let instance = null;
const render = () => {
  const mainPinia = window.parent.$mainPinia;
  instance = createApp(App);
  instance.use(ElementPlus, {
    locale: zhCn,
  });
  instance.use(router);
  instance.use(createPinia());
  instance.use(mainPinia);
  instance.mount("#root");
};
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    render(App);
  };
  window.__WUJIE_UNMOUNT = () => {
    instance?.unmount();
    instance = null;
  };
} else {
  document.body.innerHTML = `
    <div style="padding:10px;">
      PbstarAdmin 子应用依赖父应用，不能独立运行！
    </div>
  `;
}
