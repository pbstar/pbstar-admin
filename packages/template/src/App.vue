<template>
  <div class="wrapper">
    <RouterLink to="/page1">page1</RouterLink>
    <RouterLink to="/page2">page2</RouterLink>
  </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
const data = window.microApp.getData();
if (!data || !data.isNormal) {
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  margin-bottom: 20px;
}
</style>
