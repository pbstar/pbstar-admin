<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { startApp, destroyApp, bus } from "wujie";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";

const route = useRoute();
const sharedStore = useSharedStore();

// 当前应用信息
const subappContainer = ref(null);
const currentApp = ref(null);

// 子应用props
const appProps = computed(() => ({
  path: currentApp.value?.path || "",
  sharedPinia: sharedStore,
}));

// 插件配置
const plugins = [InstanceofPlugin()];

// 路由变化处理
const handleRouteChange = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl) return;
  const path = route.query?.[appKey] || "";

  if (appKey === currentApp.value?.key) {
    // 通知子应用路由变化
    bus.$emit("subappRouteChange", {
      key: appKey,
      path,
    });
  } else {
    // 启动新的子应用
    startSubApp(appKey, appUrl, path);
  }
};

// 启动子应用
const startSubApp = (key, url, path) => {
  const oldAppKey = currentApp.value?.key;

  // 销毁之前的实例
  if (oldAppKey) {
    destroyApp(oldAppKey);
  }

  currentApp.value = {
    key,
    url,
    path,
  };

  // 创建新的子应用实例
  nextTick(() => {
    startApp({
      name: key,
      url,
      el: subappContainer.value,
      sync: true,
      props: appProps.value,
      plugins,
    });
  });
};

// 监听路由变化
watch(() => route.fullPath, handleRouteChange, { immediate: true });

// 清理
onUnmounted(() => {
  if (currentApp.value) {
    destroyApp(currentApp.value.key);
  }
  currentApp.value = null;
});
</script>

<template>
  <div class="subapp-container">
    <div ref="subappContainer" class="subapp"></div>
  </div>
</template>

<style scoped lang="scss">
.subapp-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.subapp {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
}
</style>
