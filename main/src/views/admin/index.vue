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
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import SideNav from "@/components/layout/SideNav.vue";
import HistoryTabs from "@/components/layout/HistoryTabs.vue";
import LayoutLoading from "@/components/layout/LayoutLoading.vue";
import { useAppInit } from "@/composables/useAppInit";
import { useSiderCollapse } from "@/components/layout/useLayoutState";

const { isMounted, init } = useAppInit();
const { collapsed } = useSiderCollapse();

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
