<script setup lang="ts">
import { pIcon } from "@Pcomponents";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppsStore } from "@/stores/apps";
import type { AppItem } from "@/stores/apps";

const appsStore = useAppsStore();
const router = useRouter();
const appsRef = ref<HTMLElement | null>(null);
const popoverRef = ref<{ hide: () => void } | null>(null);
const appsList = ref<AppItem[]>([]);
const appsTree = ref<{ name: string; children: AppItem[] }[]>([]);
const appActive = ref<AppItem | null>(null);
const isLoading = ref(false);

const getAppsGroup = (myApps: AppItem[]) => {
  const groupMap: Record<string, { name: string; children: AppItem[] }> = {};
  myApps.forEach((item) => {
    if (!groupMap[item.group]) {
      groupMap[item.group] = {
        name: item.group,
        children: [],
      };
    }
    groupMap[item.group].children.push(item);
  });
  return Object.values(groupMap);
};

onBeforeMount(() => {
  appsList.value = appsStore.getApps();
  const appId = appsStore.appId;
  appsTree.value = getAppsGroup(appsList.value);
  if (appId) {
    appActive.value = appsList.value.find((item) => item.id === appId) || null;
  }
});

// 切换应用
const toApp = async (app: AppItem) => {
  if (app.id === appActive.value?.id) return;
  isLoading.value = true;
  const isOk = await appsStore.setAppId({
    id: app.id,
  });
  isLoading.value = false;
  if (!isOk) return;
  appActive.value = app;
  const newApp = appsStore.getApp();
  if (newApp && newApp.navs) {
    const firstNav = newApp.navs.find((e) => e.url);
    if (firstNav?.url) {
      router.push(firstNav.url);
    }
  }
  popoverRef.value?.hide();
};

watch(
  () => appsStore.appId,
  (newVal) => {
    if (newVal && newVal !== appActive.value?.id) {
      const newApp = appsList.value.find((item) => item.id === newVal);
      appActive.value = newApp || null;
    } else {
      appActive.value = null;
    }
  },
);
</script>
<template>
  <div>
    <div class="apps" ref="appsRef">
      <div class="nameBox">
        <p-icon :name="appActive?.icon" size="16" />
        <span class="name">{{ appActive?.name || "选择应用" }}</span>
      </div>
      <p-icon name="el-icon-ArrowDown" size="16" />
    </div>
    <el-popover
      virtual-triggering
      :virtual-ref="appsRef"
      trigger="click"
      width="340"
      popper-style="z-index: 6100;"
      ref="popoverRef"
    >
      <div class="list" v-loading="isLoading">
        <div class="fItem" v-for="(item, index) in appsTree" :key="index">
          <div class="fItemTitle">{{ item.name }}</div>
          <div class="children" v-if="item.children">
            <div
              class="child"
              :class="{ active: child.id === appActive?.id }"
              v-for="(child, indexs) in item.children"
              :key="indexs + 's'"
              @click="toApp(child)"
            >
              <p-icon class="cIcon" :name="child.icon" />
              <span>{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<style scoped lang="scss">
.apps {
  background-color: transparent;
  color: var(--c-text-theme);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 154px;
  line-height: 30px;
  padding: 0 var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  cursor: pointer;
  .nameBox {
    display: flex;
    align-items: center;
    .name {
      margin-left: var(--space-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.apps:hover {
  border-color: rgba(255, 255, 255, 0.24);
}
.list {
  width: 320px;
  height: 200px;
  overflow-y: auto;
  padding: var(--space-3);
  .fItem {
    width: 100%;
    .fItemTitle {
      border-bottom: 1px solid var(--c-border);
      height: 30px;
      line-height: 30px;
      color: var(--c-text2);
      font-size: var(--font-size-sm);
    }
    .children {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-top: var(--space-2);
      .child {
        width: 140px;
        height: 30px;
        line-height: 30px;
        margin-right: var(--space-3);
        margin-bottom: var(--space-2);
        border: 1px solid var(--c-border);
        color: var(--c-text);
        display: flex;
        align-items: center;
        padding: 0 var(--space-2);
        border-radius: var(--radius-sm);
        cursor: pointer;
        .cIcon {
          margin-right: var(--space-1);
        }
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .child:nth-child(2n) {
        margin-right: 0;
      }
      .child:hover {
        border-color: var(--c-text3);
      }
      .child.active {
        background-color: var(--c-bg-theme);
        border-color: var(--c-bg-theme);
        color: var(--c-text-theme);
      }
    }
  }
}
</style>
