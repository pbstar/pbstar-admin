import { ref } from "vue";
import { defineStore } from "pinia";
import { structure } from "@Passets/utils/array";
import request from "@Passets/utils/request";
import { ElMessage } from "element-plus";

export const useAppsStore = defineStore("apps", () => {
  const myApps = ref([]); // 存储用户的应用
  const appId = ref(0); // 存储当前激活的应用
  const setApps = (apps) => {
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
  const setAppId = async ({ id, key }) => {
    let aId = 0;
    if (id) {
      aId = id;
    } else if (key) {
      const app = myApps.value.find((item) => item.key === key);
      if (app) aId = app.id;
    }
    if (aId) {
      const navRes = await request.get({
        url: "/main/getMyNavListByAppId",
        data: {
          appId: aId,
        },
      });
      if (navRes.code !== 200) {
        ElMessage.error("获取应用导航失败！请稍后重试");
        return false;
      }
      setAppNavs(aId, navRes.data);
    }
    appId.value = aId;
    return true;
  };
  const getApp = () => {
    return myApps.value.find((item) => item.id === appId.value) || null;
  };
  const getApps = () => {
    return myApps.value.map((item) => {
      return {
        id: item.id,
        key: item.key,
        name: item.name,
        icon: item.icon,
        group: item.group,
      };
    });
  };
  const setAppNavs = (aId, navs) => {
    const app = myApps.value.find((item) => item.id === aId);
    app.navs = navs.map((e) => {
      return {
        id: e.id,
        name: e.name,
        url: e.url
          ? `/admin/${app.key}?${app.key}=${encodeURIComponent(e.url)}`
          : null,
        icon: e.icon,
        parentId: e.parent_id,
      };
    });
    app.navsTree = structure(app.navs);
  };
  // 检查应用是否有导航
  const hasAppNav = (query) => {
    let bool = false;
    const app = myApps.value.find((item) => item.id === appId.value);
    if (app && query) {
      const url = `/admin/${app.key}?${app.key}=${encodeURIComponent(query[app.key])}`;
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
