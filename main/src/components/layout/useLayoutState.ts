import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppsStore } from "@/stores/apps";
import type { NavItem } from "@/stores/apps";
import { HOME_PATH } from "@/utils/appMenus";

// 选中项与折叠态为模块级单例（桌面侧栏与移动端菜单共用同一份状态）
const activeIndex = ref("1");
const collapsed = ref(false);

// 默认首页导航项（未进入任何子应用时展示）
const HOME_NAV: NavItem[] = [
  { id: "home", name: "首页", url: HOME_PATH, icon: "el-icon-house" },
];

export function useNavMenu() {
  const router = useRouter();
  const route = useRoute();
  const appsStore = useAppsStore();

  // 菜单数据直接派生于应用的 navsTree：账号/权限切换触发 setMyApps/setAppNavs 重算时这里会同步刷新，
  // 不再依赖 appKey 变化触发快照更新（此前 appKey 不变时侧边栏会滞留上一账号的菜单）
  const list = computed<NavItem[]>(() => {
    if (!appsStore.appKey) return HOME_NAV;
    const app = appsStore.getApp();
    return app ? app.navs : HOME_NAV;
  });
  const listTree = computed<NavItem[]>(() => {
    if (!appsStore.appKey) return HOME_NAV;
    const app = appsStore.getApp();
    return app ? app.navsTree : HOME_NAV;
  });

  const selectNav = (val: string) => {
    activeIndex.value = val;
    const url = list.value.find((item) => item.id.toString() === val)?.url;
    if (url) {
      router.push(url);
    }
  };

  const updateActiveIndex = (path: string) => {
    if (path) {
      const nav = list.value.find((item) => item.url === path);
      activeIndex.value = nav?.id.toString() || "1";
    }
  };

  watch(
    () => route.fullPath,
    (newPath) => {
      updateActiveIndex(newPath);
    },
    { immediate: true },
  );

  return {
    listTree,
    activeIndex,
    selectNav,
  };
}

/**
 * 侧边栏折叠状态（顶部栏折叠按钮、侧边栏容器、菜单树共用）
 */
export function useSiderCollapse() {
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value;
  };

  return {
    collapsed,
    toggleCollapsed,
  };
}
