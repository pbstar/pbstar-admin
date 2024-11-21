<template>
  <RouterView />
</template>

<script setup>
import { RouterView, useRouter } from "vue-router";
const router = useRouter();
const microApp = window.microApp;
if (!microApp || !microApp.getData() || !microApp.getData().isNormal) {
  router.push("/error");
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  margin-bottom: 20px;
}
</style>
