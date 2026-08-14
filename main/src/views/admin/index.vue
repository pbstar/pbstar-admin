<template>
  <div class="pa_page">
    <LayoutLoading v-if="!isMounted" :visible="true" isFixed />
    <template v-else>
      <div class="top">
        <AppHeader />
      </div>
      <div class="main">
        <div class="mLeft">
          <AdminNav />
        </div>
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
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import AppHeader from "@/components/layout/AppHeader.vue";
import AdminNav from "@/components/layout/nav.vue";
import history from "@/components/layout/history.vue";
import LayoutLoading from "@/components/layout/loading.vue";
import { useAppInit } from "@/composables/useAppInit";

const { isMounted, init } = useAppInit();

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

    .mLeft {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
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
}
</style>
