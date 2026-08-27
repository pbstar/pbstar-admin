import { useRouter } from "vue-router";
import { onUnmounted } from "vue";
import useSharedStore, { BUS_EVENTS } from "@Passets/stores/shared";
import type { SharedStateSync } from "@Passets/stores/shared";

/**
 * 微前端子应用公共逻辑
 * 处理路由、状态管理、主题切换等
 */
export function useMicroApp() {
  const sharedStore = useSharedStore();
  const router = useRouter();

  // 接收主应用广播的共享状态补丁，统一走 store 的 patchSharedState 落库
  const handleSharedSync = (state: SharedStateSync) => {
    sharedStore.patchSharedState(state);
  };

  // 处理主应用下发的子应用内部路由跳转
  const handleSubappRouteChange = (obj: { appKey?: string; path?: string }) => {
    if (obj?.path && obj.appKey === window.$wujie?.bus.id) {
      router.push(obj.path);
    }
  };

  const handleSharedState = () => {
    if (window.$wujie?.props.sharedPinia) {
      sharedStore.patchSharedState(window.$wujie.props.sharedPinia);
    }
  };

  const handleRouteChange = () => {
    const path = window.$wujie?.props?.path;
    if (path) {
      router.push(path);
    }
  };

  const bindEventListeners = () => {
    window.$wujie?.bus.$on(BUS_EVENTS.SHARED_STATE_SYNC, handleSharedSync);
    window.$wujie?.bus.$on(BUS_EVENTS.SUBAPP_ROUTE_CHANGE, handleSubappRouteChange);
  };

  const unbindEventListeners = () => {
    // 必须传同名处理函数精确解绑：$off(event) 不带 handler 会清掉该事件上所有应用的监听
    window.$wujie?.bus.$off(BUS_EVENTS.SHARED_STATE_SYNC, handleSharedSync);
    window.$wujie?.bus.$off(BUS_EVENTS.SUBAPP_ROUTE_CHANGE, handleSubappRouteChange);
  };

  // 路由守卫 - 控制loading状态（保存解绑函数，防止 setup 重复执行时守卫叠加）
  const removeBeforeEach = router.beforeEach(() => {
    // 通过bus向主应用同步loading状态
    window.$wujie?.bus.$emit(BUS_EVENTS.SHARED_STATE_SYNC, {
      isAppRouteLoading: true,
    });
    return true;
  });

  const removeAfterEach = router.afterEach(() => {
    // 延迟关闭loading，确保页面渲染完成
    setTimeout(() => {
      window.$wujie?.bus.$emit(BUS_EVENTS.SHARED_STATE_SYNC, {
        isAppRouteLoading: false,
      });
    }, 200);
  });

  handleRouteChange();
  handleSharedState();
  bindEventListeners();

  onUnmounted(() => {
    removeBeforeEach();
    removeAfterEach();
    unbindEventListeners();
  });

  return {};
}
