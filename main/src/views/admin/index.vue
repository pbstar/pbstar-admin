<template>
  <div class="page">
    <div class="top">
      <AdminTop />
    </div>
    <div class="main">
      <div class="mLeft">
        <AdminNav />
      </div>
      <div class="mRight">
        <div class="mApp">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { RouterView } from "vue-router";
import AdminTop from "@/components/layout/top.vue";
import AdminNav from "@/components/layout/nav.vue";
</script>
<style scoped lang="scss">
.page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #F1F2F6;

  .top {
    height: 52px;
    width: 100%;
    background-color: #fff;
  }

  .main {
    height: calc(100vh - 52px);
    width: 100%;
    display: flex;
    .mLeft {
      height: 100%;
      flex-shrink: 1;
      overflow: auto;
    }
    .mRight {
      height: 100%;
      padding: 10px 0 0 10px;
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      //滚动条样式
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: rgba(34, 122, 247, 0.6);
      }
      &::-webkit-scrollbar-track {
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.1);
      }
      .mApp {
        width: 100%;
        background-color: #fff;
      }
    }
  }
}
</style>
