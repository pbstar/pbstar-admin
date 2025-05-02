<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
const { bus } = WujieVue;
const route = useRoute();
const router = useRouter();
const apps = ref([
  { name: "app-example", url: "http://localhost:8801/" },
  { name: "app-system", url: "http://localhost:8802/" },
]);
const appName = ref("");
const appUrl = ref("");
const toChangeApp = (name) => {
  const app = apps.value.find((item) => item.name === name);
  if (app) {
    appName.value = app.name;
    appUrl.value = app.url;
  }
};
if (route.query.name) {
  toChangeApp(route.query.name);
}
router.afterEach((to) => {
  if (to.query.name && to.query.name != appName.value) {
    toChangeApp(to.query.name);
  } else {
    if (to.query && to.query[appName.value]) {
      bus.$emit("subappRouteChange", to.query[appName.value]);
    }
  }
});
</script>
<template>
  <WujieVue
    v-if="appName && appUrl"
    width="100%"
    height="100%"
    :name="appName"
    :url="appUrl"
    :sync="true"
    :props="{}"
  ></WujieVue>
</template>
<style scoped lang="scss"></style>
