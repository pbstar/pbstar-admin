<template>
  <div class="pa_page">
    <LayoutLoading v-if="!isMounted" :visible="true" isFixed />
    <template v-else>
      <div class="top" v-show="!sharedStore.isFull">
        <AdminTop v-show="!isMobile" />
        <AdminTopMobile v-show="isMobile" />
      </div>
      <div class="main">
        <div
          class="mLeft"
          v-show="!sharedStore.isFull && !isMobile"
        >
          <AdminNav />
        </div>
        <div
          class="mRight"
          :style="{
            paddingLeft: sharedStore.isFull ? '0' : '10px',
            paddingRight: sharedStore.isFull ? '0' : '10px',
          }"
        >
          <history class="history" v-show="!sharedStore.isFull && !isMobile" />
          <div style="height: 0; width: 100%" v-show="sharedStore.isFull">
            <div class="unfull" @click="toUnFull">
              <p-icon name="el-icon-close" />
            </div>
          </div>
          <div style="width: 100%; height: 10px" v-show="isMobile"></div>
          <div class="mApp">
            <RouterView />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { pIcon } from "@Pcomponents";
import AdminTop from "@/components/layout/top.vue";
import AdminTopMobile from "@/components/layout/topMobile.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import LayoutLoading from "@/components/layout/loading.vue";
import useSharedStore from "@Passets/stores/shared";
import { bus } from "wujie";
import { useAppInit } from "@/composables/useAppInit";

const sharedStore = useSharedStore();
const { isMounted, init } = useAppInit();

const isMobile = computed(() => {
  return window.innerWidth <= 700;
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
    .mLeft {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
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
