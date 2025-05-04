<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";

const { bus } = WujieVue;
const route = useRoute();
const router = useRouter();
const appName = ref("");
const appUrl = ref("");
const props = ref({});

const toChangeApp = (to) => {
  appName.value = to.meta.appName;
  appUrl.value = to.meta.appUrl;
  if (to.query && to.query[appName.value]) {
    props.value = {
      path: to.query[appName.value],
    };
  }
};

if (route.meta && route.meta.appName) {
  toChangeApp(route);
}
router.afterEach((to) => {
  if (to.meta.appName && to.meta.appName != appName.value) {
    toChangeApp(to);
  } else {
    if (to.query && to.query[appName.value]) {
      bus.$emit("subappRouteChange", {
        name: appName.value,
        path: to.query[appName.value],
      });
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
    :props="props"
  ></WujieVue>
</template>
<style scoped lang="scss">
.app {
  min-height: 500px;
}
</style>
