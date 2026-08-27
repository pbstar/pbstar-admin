import { ref } from "vue";
import { defineStore } from "pinia";

/**
 * 微前端共享状态模块：一份文件同时定义跨应用同步契约
 * （BUS_EVENTS 事件名 + SharedStateSync 载荷类型）与本地落库的 store。
 * 主/子应用各自持有独立 Pinia 实例，共享状态初始值经 props.sharedPinia 水合，
 * 后续变更（bus 广播接收、主应用挂载流程的 loading 控制）统一由 patchSharedState 落库。
 */

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

/**
 * wujie 跨应用 bus 事件名。
 * 字符串值即线上协议，不要改动（外部子应用仓库可能按此值收发）
 */
export const BUS_EVENTS = {
  /** 同步共享状态片段，payload 为 SharedStateSync */
  SHARED_STATE_SYNC: "changeSharedPinia",
  /** 主应用通知子应用跳转其内部路由 */
  SUBAPP_ROUTE_CHANGE: "subappRouteChange",
  /** 子应用登录失效，广播主应用统一跳转登录页 */
  UNAUTHORIZED: "unauthorized",
} as const;

const useSharedStore = defineStore("shared", () => {
  const userInfo = ref<UserInfo | null>(null);
  const isAppRouteLoading = ref(false);

  /**
   * 写入/清除用户信息（传 null 即清除，对应登出场景）
   * 只挑需要的字段落库，避免整包透传后端数据
   */
  const setUserInfo = (user: UserInfo | null) => {
    userInfo.value = user && {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    };
  };

  /**
   * 共享状态的统一变更入口（bus 广播接收侧的唯一落库方法，
   * 主应用子应用挂载流程对 loading 的控制同样走这里）：
   * 字段可选表示增量——只更新传入的字段，未传的保持不变。
   * 保证变更逻辑全局只有这一份定义
   */
  const patchSharedState = (data: SharedStateSync) => {
    if (data.userInfo !== undefined) {
      userInfo.value = data.userInfo;
    }
    if (data.isAppRouteLoading !== undefined) {
      // 兜底：防止总线写入与子应用挂载的时序竞态导致 loading 蒙层卡死
      isAppRouteLoading.value = data.isAppRouteLoading;
    }
  };

  return {
    userInfo,
    isAppRouteLoading,
    setUserInfo,
    patchSharedState,
  };
});

export default useSharedStore;
