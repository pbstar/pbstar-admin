import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
import { useAppsStore } from "@/stores/apps";
import { whiteList, isFreeLogin } from "@/utils/auth";
import { logout } from "@/utils/logout";
import request from "@Passets/utils/request";

/**
 * 管理端初始化：登录态校验、用户信息与应用列表加载、子应用权限校验。
 * 各校验步骤只返回成功/失败，不在内部直接跳转；是否跳转、跳去哪，
 * 统一由 init() 末尾一处决定，避免判断逻辑分散在多处导致状态不一致
 * （此前 getUserInfo/getAppList 失败后 init 未检查返回值，仍会继续往下执行并将 isMounted 置为 true）。
 */
export function useAppInit() {
  const sharedStore = useSharedStore();
  const appsStore = useAppsStore();
  const router = useRouter();
  const route = useRoute();

  const isMounted = ref(false);

  // 获取用户信息
  const getUserInfo = async (): Promise<boolean> => {
    try {
      const userRes = await request.post({
        url: "/main/loginByToken",
      });
      if (userRes.code !== 200 || !userRes.data) {
        ElMessage.error(userRes.msg || "获取用户信息失败");
        return false;
      }
      localStorage.setItem("p_token", userRes.data.token);
      sharedStore.setUserInfo(userRes.data);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // 获取应用列表
  const getAppList = async (): Promise<boolean> => {
    const res = await request.get({
      url: "/main/getMyAppList",
    });
    if (res.code !== 200 || !res.data) {
      ElMessage.error(res.msg || "获取应用列表失败");
      return false;
    }
    appsStore.setApps(res.data);
    return true;
  };

  // 初始化
  const init = async () => {
    // 免登录或白名单直接放行（需提前置 isMounted，避免页面永久 loading）
    if (isFreeLogin || whiteList.includes(route.path)) {
      isMounted.value = true;
      return;
    }
    if (!sharedStore.userInfo && !(await getUserInfo())) {
      // 登录态失效，跳回登录页
      logout();
      return;
    }
    if (!(await getAppList())) {
      // 应用列表获取失败（网络/后端异常），错误提示已在 getAppList 内给出，
      // 保持在 loading 态而不强制登出，避免把非登录问题误判为登录失效
      return;
    }
    if (route.meta?.appKey) {
      const isOk = await appsStore.setAppId({ key: route.meta.appKey as string });
      if (!isOk || !appsStore.hasAppNav(route.query)) {
        ElMessage.error("无权限访问");
        router.push({ path: "/403" });
        return;
      }
    }
    isMounted.value = true;
  };

  return {
    isMounted,
    init,
  };
}
