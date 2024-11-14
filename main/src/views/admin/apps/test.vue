<template>
  <micro-app
    style="width: 100%; height: 100%"
    :name="name"
    :url="url"
    iframe
  ></micro-app>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import microApp from '@micro-zoe/micro-app'
import apps from "@config/apps";
const route = useRoute();
const name = ref("test");
const url = ref(apps[name.value] || "");
watch(
  route,
  (newRoute) => {
    microApp.router.push({
      name: name.value,
      path: newRoute.query[name.value],
    });
  },
  {
    deep: true,
  }
);
</script>
