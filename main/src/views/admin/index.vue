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
        <history />
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
import history from "@/components/layout/history.vue";
</script>
<style scoped lang="scss">
.page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: var(--c-bg-box);

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
      overflow: auto;
    }
    .mRight {
      height: 100%;
      padding-left: 10px;
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
