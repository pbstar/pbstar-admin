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
    }
  });
  window.$wujie?.bus.$on("subappRouteChange", (path) => {
    router.push(path);
  });
}
</script>

<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
