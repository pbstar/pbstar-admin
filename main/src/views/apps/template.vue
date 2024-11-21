<template>
  <WujieVue
    width="100%"
    height="100%"
    :name="name"
    :url="url"
    :sync="true"
    :props="{
      isNormal: true,
    }"
  ></WujieVue>
</template>
<script setup>
import { ref } from "vue";
import apps from "@PConfig/apps";
const name = ref("template");
const url = ref(apps.find((item) => item.name === name.value).url);
</script>
