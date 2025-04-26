<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const apps = ref([{ name: "app-example", url: "http://localhost:8801/" }]);
const appName = ref("");
const appUrl = ref("");
if (route.query.name) {
  const app = apps.value.find((item) => item.name === route.query.name);
  if (app) {
    appName.value = app.name;
    appUrl.value = app.url;
  }
}
</script>
<template>
  <div>
    <WujieVue
      v-if="appName && appUrl"
      width="100%"
      height="100%"
      :name="appName"
      :url="appUrl"
      :sync="true"
      :props="{}"
    ></WujieVue>
  </div>
</template>
<style scoped lang="scss"></style>
