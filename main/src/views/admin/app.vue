<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";

const { bus } = WujieVue;
const route = useRoute();
const router = useRouter();
const appName = ref("");
const appUrl = ref("");
const props = ref({});
const sharedStore = useSharedStore();

const toChangeApp = (to) => {
  appName.value = to.meta.appName;
  appUrl.value = to.meta.appUrl;
  if (to.query && to.query[appName.value]) {
    props.value = {
      path: to.query[appName.value],
      sharedPinia: sharedStore,
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
    class="subapp"
    :name="appName"
    :url="appUrl"
    :sync="true"
    :props="props"
    :plugins="[InstanceofPlugin()]"
  ></WujieVue>
</template>
<style scoped lang="scss">
.subapp {
  width: 100%;
  min-height: 100%;
}
</style>
