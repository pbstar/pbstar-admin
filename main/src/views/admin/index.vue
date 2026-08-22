<template>
  <div class="pa_page">
    <LayoutLoading v-if="!isMounted" :visible="true" isFixed />
    <template v-else>
      <div class="top">
        <AppHeader />
      </div>
      <div class="main">
        <div class="mLeft" :class="{ collapsed }">
          <SideNav />
        </div>
        <div class="mRight">
          <HistoryTabs class="history" />
          <div class="mApp">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute, RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import SideNav from "@/components/layout/SideNav.vue";
import HistoryTabs from "@/components/layout/HistoryTabs.vue";
import LayoutLoading from "@/components/layout/LayoutLoading.vue";
import { useSiderCollapse } from "@/components/layout/useLayoutState";
import { isPublicPath, getUserInfo, logout } from "@/utils/auth";
import { useAppsStore } from "@/stores/apps";
import useSharedStore from "@Passets/stores/shared";
import { ElMessage } from "element-plus";

const { collapsed } = useSiderCollapse();
const appsStore = useAppsStore();
const router = useRouter();
const route = useRoute();
const sharedStore = useSharedStore();
const isMounted = ref(false);

const init = async () => {
  // 免登录或白名单直接放行（需提前置 isMounted，避免页面永久 loading）
  if (isPublicPath(route.path)) {
    isMounted.value = true;
    return;
  }
  if (!sharedStore.userInfo && !(await getUserInfo())) {
    // 登录态失效，跳回登录页
    logout();
    return;
  }
  // 前端硬编码应用清单 + 按 permissions 过滤，无需请求后端、也不会失败
  await appsStore.setMyApps();
  if (route.meta?.appKey) {
    const isOk = await appsStore.setAppKey(route.meta.appKey as string);
    if (!isOk || !appsStore.hasAppNav(route.query)) {
      ElMessage.error("无权限访问");
      router.push({ path: "/403" });
      return;
    }
  }
  isMounted.value = true;
};
onBeforeMount(init);
</script>
<style scoped lang="scss">
.pa_page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg-box);
  overflow: hidden;

  .top {
    height: var(--header-height);
    width: 100%;
    flex-shrink: 0;
  }

  .main {
    flex: 1;
    min-height: 0;
    display: flex;

    .mLeft {
      width: var(--sider-width);
      height: 100%;
      flex-shrink: 0;
      border-right: 1px solid var(--c-border);
    }

    .mLeft.collapsed {
      width: var(--sider-width-collapsed);
    }

    .mRight {
      height: 100%;
      flex: 1;
      padding: var(--space-2) var(--space-3) var(--space-3);
      overflow: auto;
      display: flex;
      flex-direction: column;

      .history {
        width: 100%;
        height: 40px;
        flex-shrink: 0;
      }

      .mApp {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: var(--radius-md);
      }
    }
  }
}
</style>
