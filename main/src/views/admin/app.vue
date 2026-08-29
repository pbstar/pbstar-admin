<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { startApp, destroyApp, bus } from "wujie";
import useSharedStore, { BUS_EVENTS } from "@Passets/stores/shared";
import type { SharedStateSync } from "@Passets/stores/shared";
import LayoutLoading from "@/components/layout/LayoutLoading.vue";
import AppLoadError from "@/components/layout/AppLoadError.vue";
import { wujieErrorPatchPlugin } from "@/utils/wujiePatches";

const route = useRoute();
const sharedStore = useSharedStore();

const subappContainer = ref<HTMLElement | null>(null);
const currentAppKey = ref("");

// 子应用加载失败空态（状态驱动，替代直接操作 innerHTML）
const loadFailed = ref(false);

// 共享状态经 bus 广播到达后，统一走 store 的 patchSharedState 落库
const handleSharedPiniaChange = (data: SharedStateSync) => {
  sharedStore.patchSharedState(data);
};

const handleRouteChange = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl || !route.query) return;
  const subPath = (route.query[appKey as string] ?? "") as string;

  if (appKey === currentAppKey.value) {
    bus.$emit(BUS_EVENTS.SUBAPP_ROUTE_CHANGE, { appKey, path: subPath });
  } else {
    if (currentAppKey.value) {
      destroyApp(currentAppKey.value);
    }
    currentAppKey.value = appKey as string;
    startSubApp(appKey as string, appUrl as string, subPath);
  }
};

const startSubApp = (appKey: string, appUrl: string, subPath: string) => {
  loadFailed.value = false;
  sharedStore.patchSharedState({ isAppRouteLoading: true });

  nextTick(() => {
    startApp({
      name: appKey,
      url: appUrl,
      el: subappContainer.value!,
      sync: true,
      plugins: [wujieErrorPatchPlugin],
      props: {
        path: subPath,
        sharedPinia: sharedStore,
      },
      beforeLoad: () => {
        sharedStore.patchSharedState({ isAppRouteLoading: true });
      },
      afterMount: () => {
        // 延迟关闭 loading，确保子应用渲染完成
        setTimeout(() => {
          sharedStore.patchSharedState({ isAppRouteLoading: false });
        }, 200);
      },
      loadError: (url, err) => {
        sharedStore.patchSharedState({ isAppRouteLoading: false });
        console.error(`子应用【${appKey}】的资源 ${url} 加载失败:`, err);
        loadFailed.value = true;
      },
    });
  });
};

const handleRetry = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl) return;
  // 加载失败时容器 DOM 可能已被污染，先清空再重新挂载
  if (currentAppKey.value) {
    destroyApp(currentAppKey.value);
  }
  subappContainer.value!.innerHTML = "";
  const subPath = (route.query[appKey as string] ?? "") as string;
  currentAppKey.value = appKey as string;
  startSubApp(appKey as string, appUrl as string, subPath);
};

bus.$on(BUS_EVENTS.SHARED_STATE_SYNC, handleSharedPiniaChange);
watch(() => route.fullPath, handleRouteChange, { immediate: true });

onUnmounted(() => {
  if (currentAppKey.value) {
    destroyApp(currentAppKey.value);
  }
  currentAppKey.value = "";
  bus.$off(BUS_EVENTS.SHARED_STATE_SYNC, handleSharedPiniaChange);
});
</script>

<template>
  <div class="subapp-container">
    <div v-show="!loadFailed" ref="subappContainer" class="subapp"></div>
    <AppLoadError v-if="loadFailed" @retry="handleRetry" />
    <LayoutLoading />
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
