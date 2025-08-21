<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import WujieVue from "wujie-vue3";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";

const { bus } = WujieVue;
const route = useRoute();
const sharedStore = useSharedStore();

// 当前应用信息
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
  if (appKey == currentApp.value?.key) {
    // 通知子应用路由变化
    bus.$emit("subappRouteChange", {
      key: appKey,
      path,
    });
  }
  currentApp.value = {
    key: appKey,
    url: appUrl,
    path,
  };
};
// 防止子应用未加载时，路由变化导致的错误
bus.$on("subappRouteChange", () => {});

// 监听路由变化
watch(() => route.fullPath, handleRouteChange, { immediate: true });
onUnmounted(() => {
  bus.$off("subappRouteChange");
});
</script>
<template>
  <div class="subapp-container">
    <WujieVue
      v-if="currentApp"
      width="100%"
      height="100%"
      class="subapp"
      :name="currentApp.key"
      :url="currentApp.url"
      :sync="true"
      :props="appProps"
      :plugins="plugins"
    ></WujieVue>
    <div v-else class="subapp-placeholder">
      <p>请选择一个应用</p>
    </div>
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

.subapp-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  background-color: #f5f5f5;
}
</style>
