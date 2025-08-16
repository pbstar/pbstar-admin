import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import router from "./router";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@Passets/css/base.css";

import App from "./App.vue";
const app = createApp(App);
const mainPinia = window.parent.$mainPinia;

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(createPinia());
app.use(mainPinia);
app.mount("#root");
