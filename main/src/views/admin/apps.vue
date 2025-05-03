<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
import apps from "../../../../apps/apps.json";

const { bus } = WujieVue;
const route = useRoute();
const router = useRouter();
const appList = ref([]);
const appName = ref("");
const appUrl = ref("");
const toChangeApp = (name) => {
  const app = appList.value.find((item) => item.name === name);
  if (app) {
    appName.value = app.name;
    appUrl.value = app.url;
  }
};
const isDev = import.meta.env.DEV;
appList.value = apps.map((item) => {
  return {
    name: item.name,
    url: isDev ? `http://localhost:${item.devPort}/` : item.proUrl,
  };
});
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
    class="app"
    :name="appName"
    :url="appUrl"
    :sync="true"
    :props="{}"
  ></WujieVue>
</template>
<style scoped lang="scss">
.app {
  min-height: 500px;
}
</style>
