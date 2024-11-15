<template>
  <div class="wrapper">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
const data = window.microApp.getData();
if (!data||!data.isNormal) {
  
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  margin-bottom: 20px;
}
</style>
