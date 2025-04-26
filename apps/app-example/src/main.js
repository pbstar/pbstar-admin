import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@Passets/css/base.css";

import App from "./App.vue";
const app = createApp(App);
const mainPinia = window.parent.$mainPinia;

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(createPinia());
app.use(mainPinia);
app.mount("#root");
