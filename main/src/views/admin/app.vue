<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { startApp, destroyApp, bus } from "wujie";
import { InstanceofPlugin } from "wujie-polyfill";
import useSharedStore from "@Passets/stores/shared";
import layoutLoading from "@/components/layout/loading.vue";

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

  // 开启loading
  sharedStore.isRouteLoading = true;

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
      props: appProps.value || {},
      plugins,
      beforeLoad: () => {
        // 子应用开始加载
        sharedStore.isRouteLoading = true;
      },
      afterMount: () => {
        // 延迟关闭loading,确保子应用渲染完成
        setTimeout(() => {
          sharedStore.isRouteLoading = false;
        }, 200);
      },
      loadError: (url, err) => {
        sharedStore.isRouteLoading = false;
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
  if (currentApp.value) {
    destroyApp(currentApp.value.key);
  }
  currentApp.value = null;
  // 解绑事件监听
  bus.$off("changeSharedPinia");
});
</script>

<template>
  <div class="subapp-container">
    <div ref="subappContainer" class="subapp"></div>
    <layoutLoading />
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
