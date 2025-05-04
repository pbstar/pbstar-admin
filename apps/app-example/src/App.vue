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
