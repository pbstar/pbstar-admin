<script setup>
import { RouterView } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
const sharedStore = useSharedStore();
window.$wujie?.bus.$on("changeSharedPinia", (e) => {
  for (const key in e) {
    sharedStore[key] = e[key];
  }
});
</script>

<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
