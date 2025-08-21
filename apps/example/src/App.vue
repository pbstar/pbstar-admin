<script setup>
import { RouterView, useRouter } from "vue-router";
import { onUnmounted } from "vue";
import useSharedStore from "@Passets/stores/shared";
import { changeTheme } from "@Passets/utils/theme";

const sharedStore = useSharedStore();
const router = useRouter();
// 子应用中添加处理
const handleSharedPinia = (e) => {
  for (const key in e) {
    sharedStore[key] = e[key];
    if (key == "isDark") {
      changeTheme(e[key]);
    }
  }
};
window.$wujie?.props.path && router.push(window.$wujie.props.path);
if (window.$wujie?.props.sharedPinia) {
  handleSharedPinia(window.$wujie.props.sharedPinia);
}
window.$wujie?.bus.$on("changeSharedPinia", (e) => {
  handleSharedPinia(e);
});
window.$wujie?.bus.$on("subappRouteChange", (obj) => {
  if (obj && obj.path && obj.key == window.$wujie?.bus.id) {
    router.push(obj.path);
  }
});
onUnmounted(() => {
  window.$wujie?.bus.$off("changeSharedPinia");
  window.$wujie?.bus.$off("subappRouteChange");
});
</script>

<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
