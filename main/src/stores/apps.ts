import { ref } from "vue";
import { defineStore } from "pinia";
import type { LocationQuery } from "vue-router";
import { filterMenuTree } from "@Passets/utils/permission";
import type { MenuItem } from "@Passets/utils/permission";
import useSharedStore from "@Passets/stores/shared";
import { loadAppMenus } from "@/utils/appMenus";

/** 导航项（菜单/历史记录共用结构，树形，id 为权限 key） */
export interface NavItem {
  id: string;
  name: string;
  url: string | null;
  icon: string;
  children?: NavItem[];
}

/** 应用信息 */
export interface AppItem {
  id: number;
  key: string;
  name: string;
  icon: string;
  group: string;
  navs: NavItem[]; // 扁平化的可见导航项（供按 url 查找的场景使用）
  navsTree: NavItem[]; // 权限过滤后的菜单树（供侧边栏渲染）
}

/** 递归展开菜单树为扁平数组（保留 children 引用无关字段） */
function flattenNavs(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenNavs(item.children) : [])]);
}

export const useAppsStore = defineStore("apps", () => {
  const myApps = ref<AppItem[]>([]); // 存储用户的应用
  const appId = ref(0); // 存储当前激活的应用

  const setApps = (apps: any[]) => {
    myApps.value = apps.map((item) => {
      return {
        id: item.id,
        key: item.key,
        name: item.name,
        icon: item.icon,
        group: item.group,
        navs: [],
        navsTree: [],
      };
    });
  };

  const setAppId = async ({ id, key }: { id?: number; key?: string } = {}) => {
    let aId = 0;
    let appKey = "";
    if (id) {
      // 校验 id 属于当前用户的应用，避免传入未知 id
      const app = myApps.value.find((item) => item.id === id);
      if (app) { aId = app.id; appKey = app.key; }
    } else if (key) {
      const app = myApps.value.find((item) => item.key === key);
      if (app) { aId = app.id; appKey = app.key; }
    }
    if (aId) {
      await setAppNavs(aId, appKey);
    }
    appId.value = aId;
    return true;
  };

  const getApp = () => {
    return myApps.value.find((item) => item.id === appId.value) || null;
  };

  // setApps 已剔除多余字段，直接返回即可（navs/navsTree 为内部字段）
  const getApps = () => {
    return myApps.value;
  };

  const setAppNavs = async (aId: number, appKey: string) => {
    const app = myApps.value.find((item) => item.id === aId);
    if (!app) return;
    const menuItems = await loadAppMenus(appKey);
    const sharedStore = useSharedStore();
    const visible = filterMenuTree(menuItems, sharedStore.userInfo?.permissions);
    const toNavItem = (item: MenuItem): NavItem => ({
      id: item.key ?? item.name,
      name: item.name,
      url: item.url
        ? `/admin/${app.key}?${app.key}=${encodeURIComponent(item.url)}`
        : null,
      icon: item.icon || "",
      children: item.children?.map(toNavItem),
    });
    app.navsTree = visible.map(toNavItem);
    app.navs = flattenNavs(app.navsTree);
  };

  // 检查应用是否有导航
  const hasAppNav = (query: LocationQuery) => {
    let bool = false;
    const app = myApps.value.find((item) => item.id === appId.value);
    if (app && query) {
      const url = `/admin/${app.key}?${app.key}=${encodeURIComponent(query[app.key] as any)}`;
      app.navs.forEach((e) => {
        if (e.url === url) {
          bool = true;
        }
      });
    }
    return bool;
  };

  return {
    appId,
    setApps,
    setAppId,
    getApp,
    getApps,
    hasAppNav,
  };
});
