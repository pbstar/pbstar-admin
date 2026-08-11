import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
import { useAppsStore } from "@/stores/apps";
import { whiteList, isFreeLogin } from "@/utils/auth";
import { logout } from "@/utils/logout";
import request from "@Passets/utils/request";

/**
 * 管理端初始化：登录态校验、用户信息与应用列表加载、子应用权限校验
 */
export function useAppInit() {
  const sharedStore = useSharedStore();
  const appsStore = useAppsStore();
  const router = useRouter();
  const route = useRoute();

  const isMounted = ref(false);

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const userRes = await request.post({
        url: "/main/loginByToken",
      });
      if (userRes.code !== 200 || !userRes.data) {
        ElMessage.error(userRes.msg || "获取用户信息失败");
        logout();
        return false;
      }
      localStorage.setItem("p_token", userRes.data.token);
      sharedStore.setUserInfo(userRes.data);
    } catch (error) {
      console.error(error);
      router.push({ path: "/login" });
      return false;
    }
  };

  // 获取应用列表
  const getAppList = async () => {
    const res = await request.get({
      url: "/main/getMyAppList",
    });
    if (res.code !== 200 || !res.data) {
      ElMessage.error(res.msg || "获取应用列表失败");
      return false;
    }
    appsStore.setApps(res.data);
  };

  // 初始化
  const init = async () => {
    // 免登录或白名单直接放行（需提前置 isMounted，避免页面永久 loading）
    if (isFreeLogin || whiteList.includes(route.path)) {
      isMounted.value = true;
      return;
    }
    if (!sharedStore.userInfo) {
      await getUserInfo();
    }
    await getAppList();
    if (route.meta?.appKey) {
      const isOk = await appsStore.setAppId({ key: route.meta.appKey as string });
      if (!isOk || !appsStore.hasAppNav(route.query)) {
        ElMessage.error("无权限访问");
        return router.push({ path: "/403" });
      }
    }
    isMounted.value = true;
  };

  return {
    isMounted,
    init,
  };
}
