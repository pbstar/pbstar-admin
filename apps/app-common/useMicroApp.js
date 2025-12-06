import { useRouter } from "vue-router";
import { onUnmounted } from "vue";
import useSharedStore from "@Passets/stores/shared";
import { changeTheme } from "@Passets/utils/theme";

/**
 * 微前端子应用公共逻辑
 * 处理路由、状态管理、主题切换等
 */
export function useMicroApp() {
  const sharedStore = useSharedStore();
  const router = useRouter();

  // 处理共享状态变更
  const handleSharedPinia = (e) => {
    Object.keys(e).forEach((key) => {
      // 只设置 store 中已存在的属性
      if (key in sharedStore) {
        sharedStore[key] = e[key];
        if (key === "isDark") {
          changeTheme(e[key]);
        }
      }
    });
  };

  // 处理路由跳转
  const handleRouteChange = () => {
    window.$wujie?.props.path && router.push(window.$wujie.props.path);
  };

  // 处理共享状态
  const handleSharedState = () => {
    if (window.$wujie?.props.sharedPinia) {
      handleSharedPinia(window.$wujie.props.sharedPinia);
    }
  };

  // 绑定事件监听器
  const bindEventListeners = () => {
    // 监听共享状态变更
    window.$wujie?.bus.$on("changeSharedPinia", (e) => {
      handleSharedPinia(e);
    });

    // 监听路由变更
    window.$wujie?.bus.$on("subappRouteChange", (obj) => {
      if (obj && obj.path && obj.key === window.$wujie?.bus.id) {
        router.push(obj.path);
      }
    });
  };

  // 解绑事件监听器
  const unbindEventListeners = () => {
    window.$wujie?.bus.$off("changeSharedPinia");
    window.$wujie?.bus.$off("subappRouteChange");
  };

  // 路由守卫 - 控制loading状态
  router.beforeEach((to, from, next) => {
    // 通过bus向主应用同步loading状态
    window.$wujie?.bus.$emit("changeSharedPinia", { isAppRouteLoading: true });
    next();
  });

  router.afterEach(() => {
    // 延迟关闭loading,确保页面渲染完成
    setTimeout(() => {
      window.$wujie?.bus.$emit("changeSharedPinia", {
        isAppRouteLoading: false,
      });
    }, 200);
  });

  // 初始化微应用
  handleRouteChange();
  handleSharedState();
  bindEventListeners();

  // 组件销毁时清理事件监听
  onUnmounted(() => {
    unbindEventListeners();
  });

  return {};
}
