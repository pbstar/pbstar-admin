<template>
  <div class="page">
    <Left :collapsed="collapsed" />
    <div class="right">
      <RightTop :collapsed="collapsed" @collapsedChange="collapsedChange" />
      <div class="r_bottom">
        <div class="r_b_box">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import Left from "./left.vue";
import RightTop from "./right_top.vue";
const collapsed = ref(false);
const collapsedChange = (val) => {
  collapsed.value = val;
};
</script>
<style scoped lang="scss">
.page {
  height: 100vh;
  display: flex;

  .right {
    flex: 1;
    background-color: #f6f6f6;

    .r_bottom {
      height: calc(100vh - 56px);
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;

      .r_b_box {
        width: calc(100% - 20px);
        min-height: calc(100vh - 56px - 10px);
        margin: 10px 10px 0;
        background-color: #fff;
        overflow: hidden;
      }
    }
  }
}
</style>
