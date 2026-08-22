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
  const appKey = appsStore.appKey;
  appsTree.value = getAppsGroup(appsList.value);
  if (appKey) {
    appActive.value =
      appsList.value.find((item) => item.appKey === appKey) || null;
  }
});

// 切换应用
const toApp = async (app: AppItem) => {
  if (app.appKey === appActive.value?.appKey) return;
  isLoading.value = true;
  const isOk = await appsStore.setAppKey(app.appKey);
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
  () => appsStore.appKey,
  (newVal) => {
    if (newVal && newVal !== appActive.value?.appKey) {
      const newApp = appsList.value.find((item) => item.appKey === newVal);
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
      <p-icon name="el-icon-ArrowDown" size="16" class="arrow" />
    </div>
    <el-popover
      virtual-triggering
      :virtual-ref="appsRef"
      trigger="click"
      width="380"
      popper-style="z-index: 6100;"
      ref="popoverRef"
    >
      <!-- 应用中心面板 -->
      <div class="list" v-loading="isLoading">
        <div class="fItem" v-for="(item, index) in appsTree" :key="index">
          <div class="fItemTitle">{{ item.name }}</div>
          <div class="children" v-if="item.children">
            <div
              class="child"
              :class="{ active: child.appKey === appActive?.appKey }"
              v-for="(child, indexs) in item.children"
              :key="indexs + 's'"
              @click="toApp(child)"
            >
              <div class="cIcon">
                <p-icon :name="child.icon" :size="18" />
              </div>
              <span class="cName">{{ child.name }}</span>
              <p-icon
                v-if="child.appKey === appActive?.appKey"
                class="cCheck"
                name="el-icon-CircleCheckFilled"
                :size="16"
              />
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
  height: 32px;
  width: 160px;
  line-height: 32px;
  padding: 0 var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.2s;
  .nameBox {
    display: flex;
    align-items: center;
    .name {
      margin-left: var(--space-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
  }
  .arrow {
    transition: transform 0.2s;
  }
}
.apps:hover {
  background-color: rgba(255, 255, 255, 0.08);
}
/* 应用中心面板 */
.list {
  max-height: 320px;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-3);
  .fItem {
    width: 100%;
    .fItemTitle {
      padding: var(--space-2) 0 var(--space-1);
      color: var(--c-text2);
      font-size: var(--font-size-xs);
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .children {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-2);
      padding-bottom: var(--space-1);
      .child {
        display: flex;
        align-items: center;
        padding: var(--space-2) var(--space-3);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-md);
        background: var(--c-bg);
        color: var(--c-text);
        cursor: pointer;
        transition:
          border-color 0.2s,
          transform 0.1s;
        &:hover {
          border-color: var(--c-bg-theme-light);
        }
        .cIcon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: var(--c-bg-theme-tint);
          color: var(--c-text3);
          flex-shrink: 0;
        }
        .cName {
          flex: 1;
          margin-left: var(--space-2);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: var(--font-size-sm);
          font-weight: 500;
        }
        .cCheck {
          color: var(--c-bg-theme);
          flex-shrink: 0;
        }
        &.active {
          border-color: var(--c-bg-theme);
          background: var(--c-bg-theme-tint);
        }
      }
    }
  }
}
</style>
