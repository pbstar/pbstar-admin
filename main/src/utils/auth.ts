import { ElMessage } from "element-plus";
import { bus } from "wujie";
import router from "@/router";
import useSharedStore, { BUS_EVENTS } from "@Passets/stores/shared";
import { useAppsStore } from "@/stores/apps";
import { loginByToken } from "@/api";

// 路由白名单（/404 由 catch-all 兜底，无需白名单）
export const whiteList = ["/login", "/403"];
// 开发环境免登录配置
export const isFreeLogin =
  import.meta.env.DEV && import.meta.env.PUBLIC_FREE_LOGIN === "T";

/** 免登录或白名单路径：直接放行 */
export const isPublicPath = (path: string) =>
  isFreeLogin || whiteList.includes(path);

/**
 * 通过 token 拉取并落库用户信息（进入 /admin 且本地无 userInfo 时调用）
 * @returns true 成功；false 失败（调用方应跳回登录页）
 */
export const getUserInfo = async (): Promise<boolean> => {
  try {
    const userRes = await loginByToken();
    if (userRes.code !== 200 || !userRes.data) {
      ElMessage.error(userRes.msg || "获取用户信息失败");
      return false;
    }
    localStorage.setItem("p_token", userRes.data.token);
    useSharedStore().setUserInfo(userRes.data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * 退出登录：清除本地登录态并跳转登录页（同步通知子应用清空用户信息）
 * 需在组件生命周期内调用（依赖当前激活的 pinia 实例）
 */
export function logout() {
  localStorage.removeItem("p_token");
  useSharedStore().setUserInfo(null);
  useAppsStore().setAppKey();
  bus.$emit(BUS_EVENTS.SHARED_STATE_SYNC, { userInfo: null });
  router.push({ path: "/login" });
}
