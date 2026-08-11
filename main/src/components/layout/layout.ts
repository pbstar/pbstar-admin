import { ref, watch, effectScope } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppsStore } from "@/stores/apps";
import type { NavItem } from "@/stores/apps";
import type { TreeNode } from "@Passets/utils/array";
import { HOME_PATH } from "@/utils/constants";

// 菜单数据与选中项为模块级单例（桌面侧栏与移动端菜单共用同一份状态）
const activeIndex = ref("1");
const list = ref<NavItem[]>([]);
const listTree = ref<TreeNode<NavItem>[]>([]);

// 监听在独立 effect scope 中注册，仅首次实例化时执行一次：
// 既不随组件卸载销毁（避免再次进入时菜单陈旧），也不随多个调用方重复累积
let scopeCreated = false;

export function useNavMenu() {
  const router = useRouter();
  const route = useRoute();
  const appsStore = useAppsStore();

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
          url: HOME_PATH,
          icon: "el-icon-house",
        },
      ];
      listTree.value = list.value;
    }
  };

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

  if (!scopeCreated) {
    scopeCreated = true;
    effectScope().run(() => {
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
    });
  }

  return {
    listTree,
    activeIndex,
    selectNav,
  };
}
