<script setup>
import { RouterView, useRouter } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
const sharedStore = useSharedStore();
const router = useRouter();
// 子应用中添加处理
if (window.__POWERED_BY_WUJIE__) {
  window.$wujie?.bus.$on("changeSharedPinia", (e) => {
    for (const key in e) {
      sharedStore[key] = e[key];
      if (key == "isDark") {
        if (e[key]) {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.removeAttribute("data-theme");
          document.documentElement.classList.remove("dark");
        }
      }
    }
  });
  window.$wujie?.props.path && router.push(window.$wujie.props.path);
  window.$wujie?.bus.$on("subappRouteChange", (obj) => {
    if (obj && obj.path && obj.name == window.$wujie?.bus.id) {
      router.push(obj.path);
    }
  });
}
</script>

<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
