<template>
  <div class="historyBox" ref="historyBox">
    <div
      class="tab home"
      :class="{ active: path === HOME_PATH }"
      @click="toPath({ appId: 0, path: '/' })"
    >
      <p-icon name="el-icon-house" />
    </div>
    <div class="list" ref="listRef">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="tab"
        :class="{ active: item.path === path }"
        @click="toPath(item)"
      >
        <span class="name">{{ item.name }}</span>
        <p-icon
          class="close"
          name="el-icon-Close"
          size="12"
          @click.stop="delItem(item.path)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { pIcon } from "@Pcomponents";
import { ref, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppsStore } from "@/stores/apps";
import { HOME_PATH } from "@/utils/constants";
const router = useRouter();
const route = useRoute();
const appsStore = useAppsStore();
const path = ref("");
const list = ref<{ name: string; appId: number; path: string }[]>([]);
const historyBox = ref<HTMLDivElement | null>(null);
const listRef = ref<HTMLDivElement | null>(null);

// 添加历史记录
const addItem = (fullPath: string) => {
  if (fullPath === path.value) return;
  path.value = fullPath;
  const hasPath = list.value.find((item) => item.path === fullPath);
  if (hasPath) return;
  const app = appsStore.getApp();
  if (!app || !app.navs) return;
  const nav = app.navs.find((item) => item.url === fullPath);
  if (!nav) return;
  list.value.push({
    name: nav.name,
    appId: appsStore.appId,
    path: fullPath,
  });
  // 如果宽度超出，删除最前面的一条记录
  nextTick(() => {
    const width = (historyBox.value?.clientWidth ?? 0) - 100;
    if ((listRef.value?.scrollWidth ?? 0) > width) {
      list.value.shift();
    }
  });
};
// 删除历史记录
const delItem = (url: string) => {
  list.value = list.value.filter((item) => item.path !== url);
  if (url === path.value) {
    // 清空后回退默认首页
    let toPath = "";
    if (list.value.length === 0) {
      toPath = "/";
    } else {
      toPath = list.value[list.value.length - 1].path;
    }
    router.push(toPath);
  }
};
// 跳转路径
const toPath = async (item: { appId: number; path: string }) => {
  if (item.path === path.value) return;
  if (item.appId !== appsStore.appId) {
    await appsStore.setAppId({
      id: item.appId,
    });
  }
  router.push(item.path);
};
// 监听路由变化维护历史记录（watch 随组件销毁自动注销，避免全局钩子累积）
watch(
  () => route.fullPath,
  (to) => addItem(to),
  { immediate: true },
);
</script>
<style scoped lang="scss">
.historyBox {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}.historyBox .home {
  flex-shrink: 0;
}
.historyBox .list {
  display: flex;
  align-items: center;
  height: 100%;
  gap: var(--space-2);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.tab {
  flex-shrink: 0;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  color: var(--c-text2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  background: var(--c-bg);
  transition: color 0.15s, border-color 0.15s;
}
.tab.active {
  color: var(--c-text3);
  border-color: var(--c-bg-theme);
  background: var(--c-bg-theme-tint);
  font-weight: 500;
}
.tab:hover {
  color: var(--c-text3);
}
.tab .name {
  max-width: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tab .close {
  margin-left: var(--space-2);
  visibility: hidden;
  border-radius: 50%;
  transition: color 0.15s;
}
.tab:hover .close,
.tab.active .close {
  visibility: visible;
}
.tab .close:hover {
  color: var(--c-text);
}
</style>
