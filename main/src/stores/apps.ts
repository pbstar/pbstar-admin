import { ref } from "vue";
import { defineStore } from "pinia";
import type { LocationQuery } from "vue-router";
import { filterMenuTree } from "@Passets/utils/permission";
import type { MenuItem } from "@Passets/utils/permission";
import useSharedStore from "@Passets/stores/shared";
import { loadAppMenus } from "@/utils/appMenus";
import { apps as appList } from "@Passets/constants/apps";

/** 导航项（菜单/历史记录共用结构，树形，id 为权限 key） */
export interface NavItem extends MenuItem {
  id: string; // item.key ?? item.name（el-menu index 用）
  url: string | null; // 覆盖为完整地址 /admin/{key}?{key}=...
  children?: NavItem[]; // 覆盖为 NavItem[]
}

/** 应用信息 */
export interface AppItem {
  appKey: string;
  name: string;
  icon: string;
  group: string;
  navs: NavItem[]; // 扁平化的可见导航项（供按 url 查找的场景使用）
  navsTree: NavItem[]; // 权限过滤后的菜单树（供侧边栏渲染）
}

/** 递归展开菜单树为扁平数组（保留 children 引用无关字段） */
function flattenNavs(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenNavs(item.children) : []),
  ]);
}

export const useAppsStore = defineStore("apps", () => {
  const myApps = ref<AppItem[]>([]);
  const appKey = ref("");

  // 应用列表不再请求后端，改为前端硬编码清单 + 按 permissions 过滤：
  // 应用可见 ⇔ 该应用下至少存在一个当前用户可见的菜单（复用 filterMenuTree）
  const setMyApps = async () => {
    const sharedStore = useSharedStore();
    const permissions = sharedStore.userInfo?.permissions;
    const visible: AppItem[] = [];
    for (const item of appList) {
      const menus = await loadAppMenus(item.appKey);
      if (!filterMenuTree(menus, permissions).length) continue;
      visible.push({
        appKey: item.appKey,
        name: item.name,
        icon: item.icon,
        group: item.group,
        navs: [],
        navsTree: [],
      });
    }
    myApps.value = visible;
  };

  const setAppKey = async (key?: string) => {
    appKey.value = "";
    if (key) {
      // 校验 appKey 属于当前用户的应用，避免传入未知 appKey
      const app = myApps.value.find((item) => item.appKey === key);
      if (app) {
        appKey.value = key;
      }
    }
    await setAppNavs();
    return true;
  };

  const getApp = () => {
    return myApps.value.find((item) => item.appKey === appKey.value) || null;
  };

  // setMyApps 已剔除多余字段，直接返回即可（navs/navsTree 为内部字段）
  const getApps = () => {
    return myApps.value;
  };

  const setAppNavs = async () => {
    const app = getApp();
    if (!app) return;
    const menuItems = await loadAppMenus(appKey.value);
    const sharedStore = useSharedStore();
    const visible = filterMenuTree(
      menuItems,
      sharedStore.userInfo?.permissions,
    );
    const toNavItem = (item: MenuItem): NavItem => ({
      id: item.key ?? item.name,
      name: item.name,
      url: item.url
        ? `/admin/${app.appKey}?${app.appKey}=${encodeURIComponent(item.url)}`
        : null,
      icon: item.icon || "",
      children: item.children?.map(toNavItem),
    });
    app.navsTree = visible.map(toNavItem);
    app.navs = flattenNavs(app.navsTree);
  };

  const hasAppNav = (query: LocationQuery) => {
    const app = getApp();
    if (!app || !query) return false;
    const url = `/admin/${app.appKey}?${app.appKey}=${encodeURIComponent(query[app.appKey] as any)}`;
    return app.navs.some((nav) => nav.url === url);
  };

  return {
    appKey,
    setMyApps,
    setAppKey,
    getApp,
    getApps,
    hasAppNav,
  };
});
