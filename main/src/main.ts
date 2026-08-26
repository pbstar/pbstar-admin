import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import "@Passets/css/base.css";

import { bus } from "wujie";
import App from "./App.vue";
import router from "./router";
import { permission } from "@Passets/directives/permission";
import { setUnauthorizedHandler } from "@Passets/request";
import { applyWujiePatches } from "@/utils/wujiePatches";
import { logout } from "@/utils/auth";

// 应用 wujie 运行时补丁（history.state 警告 + 子应用切换竞态未捕获异常降噪，幂等）
applyWujiePatches();

// 登录失效统一处理：主应用自身请求 401 直接走 logout；子应用经 bus 上报时同样兜底跳登录页
setUnauthorizedHandler(logout);
bus.$on("unauthorized", logout);

const app = createApp(App);
const mainPinia = createPinia();
window.$mainPinia = mainPinia;
app.use(ElementPlus, { locale: zhCn });
app.use(mainPinia);
app.use(router);
app.directive("permission", permission);
app.mount("#root");
