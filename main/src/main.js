import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@Passets/css/base.css";

import App from "./App.vue";
import router from "./router";
const app = createApp(App);
const mainPinia = createPinia();
window.$mainPinia = mainPinia;
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(mainPinia);
app.use(router);
app.mount("#root");
