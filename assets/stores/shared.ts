import { ref } from "vue";
import { defineStore } from "pinia";

/** 用户信息（仅保留前端需要的字段） */
export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
  username: string;
  role: string;
  permissions: string;
}

/** 主/子应用经 wujie 同步的共享状态片段（字段可选，表示增量同步） */
export interface SharedStateSync {
  userInfo?: UserInfo | null;
  isAppRouteLoading?: boolean;
}

export default defineStore("shared", () => {
  const userInfo = ref<UserInfo | null>(null);
  const isAppRouteLoading = ref(false);

  const setRouteLoading = (value: boolean) => {
    isAppRouteLoading.value = value;
  };

  // 写入用户信息
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
