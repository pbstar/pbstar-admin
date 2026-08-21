<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { startApp, destroyApp, bus } from "wujie";
import useSharedStore from "@Passets/stores/shared";
import LayoutLoading from "@/components/layout/LayoutLoading.vue";
import AppLoadError from "@/components/layout/AppLoadError.vue";

const route = useRoute();
const sharedStore = useSharedStore();

// 当前应用容器
const subappContainer = ref<HTMLElement | null>(null);

// 当前子应用key
const currentAppKey = ref("");

// 子应用是否加载失败（组件化空态，替代直接操作 innerHTML）
const loadFailed = ref(false);

// 监听子应用共享状态变更
const handleSharedPiniaChange = (data: Record<string, any>) => {
  Object.keys(data).forEach((key) => {
    if (key === "isAppRouteLoading") {
      // 走兜底逻辑，防止总线写入与 afterMount 竞态导致蒙层卡死
      sharedStore.setRouteLoading(data[key]);
    } else if (key in sharedStore) {
      (sharedStore as Record<string, any>)[key] = data[key];
    }
  });
};

// 路由变化处理
const handleRouteChange = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl || !route.query) return;
  const subPath = (route.query[appKey as string] ?? "") as string;

  if (appKey === currentAppKey.value) {
    // 通知子应用路由变化
    bus.$emit("subappRouteChange", {
      key: appKey,
      path: subPath,
    });
  } else {
    // 销毁当前应用实例
    if (currentAppKey.value) {
      destroyApp(currentAppKey.value);
    }
    // 启动新的子应用
    currentAppKey.value = appKey as string;
    startSubApp(appKey as string, appUrl as string, subPath);
  }
};

// 启动子应用
const startSubApp = (appKey: string, appUrl: string, subPath: string) => {
  // 开启loading
  loadFailed.value = false;
  sharedStore.setRouteLoading(true);

  // 创建新的子应用实例
  nextTick(() => {
    startApp({
      name: appKey,
      url: appUrl,
      el: subappContainer.value!,
      sync: true,
      props: {
        path: subPath,
        sharedPinia: sharedStore,
      },
      beforeLoad: () => {
        // 子应用开始加载
        sharedStore.setRouteLoading(true);
      },
      afterMount: () => {
        // 延迟关闭loading,确保子应用渲染完成
        setTimeout(() => {
          sharedStore.setRouteLoading(false);
        }, 200);
      },
      loadError: (url, err) => {
        sharedStore.setRouteLoading(false);
        // 这个回调函数会在该子应用加载失败时触发，用状态驱动空态而非直接操作 DOM
        console.error(`子应用【${appKey}】的资源 ${url} 加载失败:`, err);
        loadFailed.value = true;
      },
    });
  });
};

// 重试加载失败的子应用
const handleRetry = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl) return;
  // wujie 加载失败时可能已污染容器 DOM，先清空再重新挂载
  if (currentAppKey.value) {
    destroyApp(currentAppKey.value);
  }
  subappContainer.value!.innerHTML = "";
  const subPath = (route.query[appKey as string] ?? "") as string;
  currentAppKey.value = appKey as string;
  startSubApp(appKey as string, appUrl as string, subPath);
};

// 绑定事件监听
bus.$on("changeSharedPinia", handleSharedPiniaChange);

// 监听路由变化
watch(() => route.fullPath, handleRouteChange, { immediate: true });

// 清理
onUnmounted(() => {
  if (currentAppKey.value) {
    destroyApp(currentAppKey.value);
  }
  currentAppKey.value = "";
  // 解绑事件监听
  bus.$off("changeSharedPinia", handleSharedPiniaChange);
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
