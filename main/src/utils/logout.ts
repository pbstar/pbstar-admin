import router from "@/router";
import useSharedStore from "@Passets/stores/shared";
import { useAppsStore } from "@/stores/apps";
import { bus } from "wujie";

/**
 * 退出登录：清除本地登录态并跳转登录页（同步通知子应用清空用户信息）
 * 需在组件生命周期内调用（依赖当前激活的 pinia 实例）
 */
export function logout() {
  localStorage.removeItem("p_token");
  const sharedStore = useSharedStore();
  sharedStore.userInfo = null;
  // 清空当前激活应用：切号后 appId 若残留旧值，侧边栏会沿用上一账号的菜单
  useAppsStore().setAppId();
  bus.$emit("changeSharedPinia", { userInfo: null });
  router.push({ path: "/login" });
}
