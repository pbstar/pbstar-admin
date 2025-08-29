import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppsStore } from "@/stores/apps";

export function useNavMenu() {
  const router = useRouter();
  const route = useRoute();
  const appsStore = useAppsStore();

  const activeIndex = ref("1");
  const list = ref([]);
  const listTree = ref([]);

  // 屏蔽无界嵌套引起的vue路由警告
  const originalWarn = console.warn;
  console.warn = (msg, ...args) => {
    if (msg.includes("history.state") && msg.includes("manually replaced")) {
      return;
    }
    originalWarn.apply(console, [msg, ...args]);
  };

  const updateNavData = () => {
    if (appsStore.appId) {
      const app = appsStore.getApp();
      if (!app) return;
      list.value = app.navs;
      listTree.value = app.navsTree;
    } else {
      list.value = [
        {
          id: 1,
          name: "首页",
          url: "/admin/pHome",
          icon: "el-icon-house",
        },
      ];
      listTree.value = list.value;
    }
  };

  const selectNav = (val) => {
    activeIndex.value = val;
    const url = list.value.find((item) => item.id.toString() === val)?.url;
    if (url) {
      router.push(url);
    }
  };

  const updateActiveIndex = (path) => {
    if (path) {
      const nav = list.value.find((item) => item.url === path);
      activeIndex.value = nav?.id.toString() || "1";
    }
  };

  watch(
    () => appsStore.appId,
    () => {
      updateNavData();
      updateActiveIndex(route.fullPath);
    },
    { immediate: true },
  );

  watch(
    () => route.fullPath,
    (newPath) => {
      updateActiveIndex(newPath);
    },
  );

  return {
    listTree,
    activeIndex,
    selectNav,
    updateNavData,
    updateActiveIndex,
  };
}
