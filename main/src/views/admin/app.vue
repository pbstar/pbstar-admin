<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";

const { bus } = WujieVue;
const route = useRoute();
const router = useRouter();
const appKey = ref("");
const appUrl = ref("");
const props = ref({});
const sharedStore = useSharedStore();

const toChangeApp = (to) => {
  appKey.value = to.meta.appKey;
  appUrl.value = to.meta.appUrl;
  if (to.query && to.query[appKey.value]) {
    props.value = {
      path: to.query[appKey.value],
      sharedPinia: sharedStore,
    };
  }
};

if (route.meta && route.meta.appKey) {
  toChangeApp(route);
}
router.afterEach((to) => {
  if (to.meta.appKey && to.meta.appKey != appKey.value) {
    toChangeApp(to);
  } else {
    if (to.query && to.query[appKey.value]) {
      bus.$emit("subappRouteChange", {
        name: appKey.value,
        path: to.query[appKey.value],
      });
    }
  }
});
</script>
<template>
  <WujieVue
    v-if="appKey && appUrl"
    width="100%"
    height="100%"
    class="subapp"
    :name="appKey"
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
