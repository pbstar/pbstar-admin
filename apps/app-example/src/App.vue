<script setup>
import useSharedStore from "@Passets/stores/shared";
const sharedStore = useSharedStore();
window.$wujie?.bus.$on("changeSharedPinia", (e) => {
  for (const key in e) {
    sharedStore[key] = e[key];
  }
});
</script>

<template>
  <div style="width: 100%; height: 800px">{{ sharedStore.isLogin }}</div>
</template>

<style scoped lang="scss"></style>
