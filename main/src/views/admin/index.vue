<template>
  <div class="page">
    <div class="top">
      <AdminTop />
    </div>
    <div class="main">
      <div
        :class="{
          mLeft: true,
          fold: isFold,
          unfold: !isFold,
        }"
      >
        <AdminNav />
        <div class="foldBtn" @click="toFold">
          <el-icon v-show="isFold"><Expand /></el-icon>
          <el-icon v-show="!isFold"><Fold /></el-icon>
        </div>
      </div>
      <div class="mRight">
        <history />
        <div class="mApp">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { Expand, Fold } from "@element-plus/icons-vue";
import { RouterView, useRoute } from "vue-router";
import { throttle } from "es-toolkit/function";
import AdminTop from "@/components/layout/top.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import { useBaseStore } from "@/stores/base";
const baseStore = useBaseStore();
const route = useRoute();

const isFold = ref(baseStore.getIsFold());
const reloadForApp = () => {
  if (route.meta.appName) {
    window.location.reload();
  }
};
const toFold = () => {
  isFold.value = !isFold.value;
  baseStore.setIsFold(isFold.value);
  reloadForApp();
};
const resize = throttle(() => {
  reloadForApp();
}, 3000);
// 监听屏幕宽度变化
window.addEventListener("resize", () => {
  resize();
});
</script>
<style scoped lang="scss">
.page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg-box);
  overflow: hidden;

  .top {
    height: 50px;
    width: 100%;
  }

  .main {
    height: calc(100vh - 50px);
    width: 100%;
    display: flex;
    .mLeft {
      height: 100%;
      flex-shrink: 1;
      position: relative;
      transition: all 0.3s ease-in-out;
      &.fold {
        width: 0;
      }
      &.unfold {
        width: 200px;
      }
      .foldBtn {
        width: 14px;
        height: 30px;
        border-radius: 0 14px 14px 0;
        border-right: 1px solid var(--c-border);
        background-color: var(--c-bg);
        position: absolute;
        right: -14px;
        bottom: 80px;
        z-index: 99;
        display: flex;
        align-items: center;
        cursor: pointer;
        .el-icon {
          color: var(--c-text);
          font-size: 16px;
          margin-left: -7px;
        }
      }
    }
    .mRight {
      height: 100%;
      padding-left: 10px;
      padding-right: 10px;
      flex: 1;

      .mApp {
        width: 100%;
        height: calc(100% - 40px);
        background-color: var(--c-bg);
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
}
</style>
