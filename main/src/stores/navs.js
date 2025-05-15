import { ref } from "vue";
import { defineStore } from "pinia";

export const useNavsStore = defineStore("navs", () => {
  const myNavs = ref([]); // 存储用户的导航菜单
  const navsTree = ref([]);
  const setNavs = (navs) => {
    myNavs.value = [];
    navsTree.value = [...navs];
    const toPushList = (children) => {
      children.forEach((e) => {
        if (!e) return;
        if (e.url) {
          myNavs.value.push(e.url);
        }
        if (e.children) {
          toPushList(e.children);
        }
      });
    };
    toPushList(navs);
  };
  const hasNav = (url) => {
    let bool = false;
    myNavs.value.forEach((e) => {
      if (url.indexOf(e) > -1) {
        bool = true;
      }
    });
    return bool;
  };

  return {
    navsTree,
    setNavs,
    hasNav,
  };
});
