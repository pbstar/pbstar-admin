<template>
  <micro-app
    style="width: 100%; height: 100%"
    :name="name"
    :url="url"
    iframe
    :data="data"
  ></micro-app>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import apps from "@config/apps";
const route = useRoute();
const name = ref("template");
const url = ref("");
const data = ref({
  isNormal: true,
});
const app = apps.find((item) => item.name === name.value);
url.value = app.url;
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
