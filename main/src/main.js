import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import WujieVue from "wujie-vue3";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@/assets/style.css";
import "@Passets/css/base.css";

import App from "./App.vue";
import router from "./router";
const app = createApp(App);
const mainPinia = createPinia();
window.$mainPinia = mainPinia;
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(WujieVue);
app.use(mainPinia);
app.use(router);
app.mount("#root");
