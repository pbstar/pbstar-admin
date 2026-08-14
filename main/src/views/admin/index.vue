<template>
  <div class="pa_page">
    <LayoutLoading v-if="!isMounted" :visible="true" isFixed />
    <template v-else>
      <div class="top" v-show="!sharedStore.isFull">
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
          v-show="!sharedStore.isFull"
        >
          <AdminNav />
        </div>
        <div
          class="mMask"
          v-show="isMobile && mobileNavOpen"
          @click="mobileNavOpen = false"
        ></div>
        <div
          class="mRight"
          :style="{
            paddingLeft: sharedStore.isFull ? '0' : '10px',
            paddingRight: sharedStore.isFull ? '0' : '10px',
          }"
        >
          <history class="history" v-show="!sharedStore.isFull" />
          <div style="height: 0; width: 100%" v-show="sharedStore.isFull">
            <div class="unfull" @click="toUnFull">
              <p-icon name="el-icon-close" />
            </div>
          </div>
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
import { pIcon } from "@Pcomponents";
import AppHeader from "@/components/layout/AppHeader.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import LayoutLoading from "@/components/layout/loading.vue";
import { useNavMenu } from "@/components/layout/layout";
import useSharedStore from "@Passets/stores/shared";
import { bus } from "wujie";
import { useAppInit } from "@/composables/useAppInit";

const MOBILE_BREAKPOINT = 700;

const sharedStore = useSharedStore();
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

// 退出全屏
const toUnFull = () => {
  sharedStore.isFull = false;
  bus.$emit("changeSharedPinia", { isFull: false });
};
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
      .unfull {
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 2100;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--c-bg-theme);
        color: var(--c-text-theme);
        cursor: pointer;
        opacity: 0.8;
        //上下跳动动画
        animation: upDown 1s infinite;
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
@keyframes upDown {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
