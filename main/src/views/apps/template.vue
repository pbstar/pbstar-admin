<template>
  <micro-app
    style="width: 100%; height: 100%"
    :name="name"
    :url="url"
    iframe
    :data="{
      isNormal: true,
    }"
  ></micro-app>
</template>
<script setup>
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import microApp from "@micro-zoe/micro-app";
import apps from "@PConfig/apps";
const name = ref("template");
const url = ref(apps.find((item) => item.name === name.value).url);
onBeforeRouteUpdate((to, from) => {
  microApp.router.push({
    name: name.value,
    path: to.query[name.value],
  });
});
</script>
