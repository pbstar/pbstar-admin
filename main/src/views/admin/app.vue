<script setup>
import { ref, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { startApp, destroyApp, bus } from "wujie";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";
import LayoutLoading from "@/components/layout/loading.vue";

const route = useRoute();
const sharedStore = useSharedStore();

// 当前应用信息
const subappContainer = ref(null);

// 当前子应用key
const currentAppKey = ref("");

// 插件配置
const plugins = [InstanceofPlugin()];

// 监听子应用共享状态变更
const handleSharedPiniaChange = (data) => {
  Object.keys(data).forEach((key) => {
    if (key in sharedStore) {
      sharedStore[key] = data[key];
    }
  });
};

// 路由变化处理
const handleRouteChange = () => {
  const { appKey, appUrl } = route.meta;
  if (!appKey || !appUrl || !route.query) return;
  const subPath = route.query[appKey] || "";

  if (appKey === currentAppKey.value) {
    // 通知子应用路由变化
    bus.$emit("subappRouteChange", {
      key: appKey,
      path: subPath,
    });
  } else {
    // 销毁当前应用实例
    if (currentAppKey) {
      destroyApp(currentAppKey);
    }
    // 启动新的子应用
    currentAppKey.value = appKey;
    startSubApp(appKey, appUrl, subPath);
  }
};

// 启动子应用
const startSubApp = (appKey, appUrl, subPath) => {
  // 开启loading
  sharedStore.isAppRouteLoading = true;

  // 创建新的子应用实例
  nextTick(() => {
    startApp({
      name: appKey,
      url: appUrl,
      el: subappContainer.value,
      sync: true,
      props: {
        path: subPath,
        sharedPinia: sharedStore,
      },
      plugins,
      beforeLoad: () => {
        // 子应用开始加载
        sharedStore.isAppRouteLoading = true;
      },
      afterMount: () => {
        // 延迟关闭loading,确保子应用渲染完成
        setTimeout(() => {
          sharedStore.isAppRouteLoading = false;
        }, 200);
      },
      loadError: (url, err) => {
        sharedStore.isAppRouteLoading = false;
        // 这个回调函数会在该子应用加载失败时触发
        console.error(`子应用【${key}】的资源 ${url} 加载失败:`, err);
        subappContainer.value.innerHTML = `
          <div style="text-align: center; padding: 50px;">子应用【${key}】加载失败</div>
        `;
      },
    });
  });
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
  bus.$off("changeSharedPinia");
});
</script>

<template>
  <div class="subapp-container">
    <div ref="subappContainer" class="subapp"></div>
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
