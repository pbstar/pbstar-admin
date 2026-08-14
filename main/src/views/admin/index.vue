<template>
  <div class="pa_page">
    <LayoutLoading v-if="!isMounted" :visible="true" isFixed />
    <template v-else>
      <div class="top">
        <AppHeader
          :isMobile="isMobile"
          :isCollapse="isCollapse"
          @toggle-nav="handleToggleNav"
        />
      </div>
      <div class="main">
        <div
          class="mLeft"
          :class="{ 'is-collapse': isCollapse, 'is-mobile-open': isMobile && mobileNavOpen }"
        >
          <AdminNav />
        </div>
        <div
          class="mMask"
          v-show="isMobile && mobileNavOpen"
          @click="mobileNavOpen = false"
        ></div>
        <div class="mRight">
          <history class="history" />
          <div class="mApp">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeMount, watch } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import LayoutLoading from "@/components/layout/loading.vue";
import { useNavMenu } from "@/components/layout/layout";
import { useAppInit } from "@/composables/useAppInit";

const MOBILE_BREAKPOINT = 700;

const { isMounted, init } = useAppInit();
const { isCollapse, toggleCollapse } = useNavMenu();

// 窄屏下侧边栏以 Drawer 形式临时展开，与桌面端的折叠状态互相独立
const mobileNavOpen = ref(false);

// isMobile 需要响应窗口 resize，不能只在首次渲染时算一次
const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT);
let resizeTimer: number | undefined;
const handleResize = () => {
  // 防抖，避免拖拽窗口时高频触发
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
  }, 100);
};

// 顶部导航按钮点击：宽屏时折叠/展开侧边栏，窄屏时打开/关闭 Drawer
const handleToggleNav = () => {
  if (isMobile.value) {
    mobileNavOpen.value = !mobileNavOpen.value;
  } else {
    toggleCollapse();
  }
};

// 切回宽屏时关闭可能残留打开状态的 Drawer
watch(isMobile, (val) => {
  if (!val) mobileNavOpen.value = false;
});

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  clearTimeout(resizeTimer);
});

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
    height: 50px;
    width: 100%;
    flex-shrink: 0;
  }

  .main {
    flex: 1;
    min-height: 0;
    display: flex;
    position: relative;

    .mLeft {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
      transition: width 0.2s;

      &.is-collapse {
        width: 64px;
      }
    }

    .mMask {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 6099;
    }

    .mRight {
      height: 100%;
      flex: 1;
      padding: 0 10px;
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
      }
    }
  }
  @media screen and (max-width: 700px) {
    .top {
      height: 46px;
    }
    .main .mLeft {
      position: fixed;
      top: 46px;
      left: 0;
      bottom: 0;
      width: 240px;
      z-index: 6100;
      transform: translateX(-100%);
      transition: transform 0.2s;
      box-shadow: 2px 0 8px var(--c-shadow);

      &.is-mobile-open {
        transform: translateX(0);
      }
    }
  }
}
</style>
