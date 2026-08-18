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
  const isDark = ref(false); // 暗黑模式
  const isAppRouteLoading = ref(false); // 应用路由loading状态

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
    isDark,
    isAppRouteLoading,
    setUserInfo,
  };
});
