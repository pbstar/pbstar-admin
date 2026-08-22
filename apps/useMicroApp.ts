import { useRouter } from "vue-router";
import { onUnmounted } from "vue";
import useSharedStore from "@Passets/stores/shared";

/**
 * 微前端子应用公共逻辑
 * 处理路由、状态管理、主题切换等
 */
export function useMicroApp() {
  const sharedStore = useSharedStore();
  const router = useRouter();

  const handleSharedPinia = (state: Record<string, any>) => {
    Object.keys(state).forEach((key) => {
      // 只设置 store 中已存在的属性
      if (key in sharedStore) {
        (sharedStore as Record<string, any>)[key] = state[key];
      }
    });
  };

  const handleRouteChange = () => {
    window.$wujie?.props.path && router.push(window.$wujie.props.path);
  };

  const handleSharedState = () => {
    if (window.$wujie?.props.sharedPinia) {
      handleSharedPinia(window.$wujie.props.sharedPinia);
    }
  };

  const bindEventListeners = () => {
    window.$wujie?.bus.$on("changeSharedPinia", (state: Record<string, any>) => {
      handleSharedPinia(state);
    });

    window.$wujie?.bus.$on(
      "subappRouteChange",
      (obj: { appKey?: string; path?: string }) => {
        if (obj && obj.path && obj.appKey === window.$wujie?.bus.id) {
          router.push(obj.path);
        }
      },
    );
  };

  const unbindEventListeners = () => {
    window.$wujie?.bus.$off("changeSharedPinia");
    window.$wujie?.bus.$off("subappRouteChange");
  };

  // 路由守卫 - 控制loading状态
  router.beforeEach(() => {
    // 通过bus向主应用同步loading状态
    window.$wujie?.bus.$emit("changeSharedPinia", { isAppRouteLoading: true });
    return true;
  });

  router.afterEach(() => {
    // 延迟关闭loading，确保页面渲染完成
    setTimeout(() => {
      window.$wujie?.bus.$emit("changeSharedPinia", {
        isAppRouteLoading: false,
      });
    }, 200);
  });

  handleRouteChange();
  handleSharedState();
  bindEventListeners();

  onUnmounted(() => {
    unbindEventListeners();
  });

  return {};
}
