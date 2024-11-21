<template>
  <div>
    <div class="wrapper">
      <RouterLink to="/page1">page1</RouterLink>
      <RouterLink to="/page2">page2</RouterLink>
    </div>
    <h1>page2</h1>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
