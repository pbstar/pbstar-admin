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
        <!-- <div class="foldBtn" @click="toFold">
          <el-icon v-show="isFold"><DArrowRight /></el-icon>
          <el-icon v-show="!isFold"><DArrowLeft /></el-icon>
        </div> -->
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
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { RouterView } from "vue-router";
import AdminTop from "@/components/layout/top.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import useSharedStore from "@Passets/stores/shared";
import WujieVue from "wujie-vue3";
const { bus } = WujieVue;
const sharedStore = useSharedStore();
const isFold = ref(sharedStore.isFold);
const toFold = () => {
  isFold.value = !isFold.value;
  sharedStore.isFold = isFold.value;
  bus.$emit("changeSharedPinia", { isFold: isFold.value });
};
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
      flex-shrink: 0;
      position: relative;
      transition: all 0.3s ease-in-out;
      .foldBtn {
        width: 16px;
        height: 30px;
        border-radius: 0 16px 16px 0;
        border-right: 1px solid var(--c-border);
        background-color: var(--c-bg);
        position: absolute;
        right: -16px;
        bottom: 80px;
        z-index: 2000;
        display: flex;
        align-items: center;
        cursor: pointer;
        .el-icon {
          color: var(--c-text);
          font-size: 16px;
        }
      }
      &.fold {
        width: 0;
        .foldBtn {
          .el-icon {
            margin-left: -5px;
          }
        }
      }
      &.unfold {
        width: 200px;
        .foldBtn {
          .el-icon {
            margin-left: -7px;
          }
        }
      }
    }
    .mRight {
      height: 100%;
      padding-left: 10px;
      padding-right: 10px;
      flex: 1;
      overflow: auto;

      .mApp {
        width: 100%;
        height: calc(100% - 40px);
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
}
</style>
