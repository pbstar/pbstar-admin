import { ref } from "vue";
import { defineStore } from "pinia";

/** 用户信息（仅保留前端需要的字段） */
export interface UserInfo {
  id: any;
  name: string;
  avatar: string;
  username: string;
  role: any;
  permissions: any;
}

/**
 * 共享状态store
 */
export default defineStore("shared", () => {
  const userInfo = ref<UserInfo | null>(null); // 用户信息
  const isAppRouteLoading = ref(false); // 应用路由loading状态

  // 兜底看门狗：子应用切换竞态可能让 afterMount/afterEach 都被跳过，
  // 导致 isAppRouteLoading 永远停在 true（蒙层卡死）。用定时器保证最多
  // watchdogMs 后强制关闭。
  let loadingWatchdog: ReturnType<typeof setTimeout> | null = null;

  /**
   * 唯一写入入口：置 true 启动看门狗，置 false 清除看门狗。
   * 无论 afterMount/afterEach 是否被竞态跳过，蒙层都不会永久卡住。
   * @param value 目标状态
   * @param watchdogMs 兜底时长（毫秒），仅置 true 时生效
   */
  const setRouteLoading = (value: boolean, watchdogMs = 15000) => {
    // 每次写入都重置看门狗，保证「最后写的值」与兜底一致
    if (loadingWatchdog) {
      clearTimeout(loadingWatchdog);
      loadingWatchdog = null;
    }
    isAppRouteLoading.value = value;
    if (value) {
      loadingWatchdog = setTimeout(() => {
        isAppRouteLoading.value = false;
        loadingWatchdog = null;
      }, watchdogMs);
    }
  };

  /**
   * 写入用户信息（登录/免登初始化复用，仅保留前端需要的字段）
   * @param user 接口返回的用户对象
   */
  const setUserInfo = (user: UserInfo) => {
    userInfo.value = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    };
  };

  return {
    userInfo,
    isAppRouteLoading,
    setRouteLoading,
    setUserInfo,
  };
});
