<template>
  <div class="topBtn">
    <div class="item" v-for="(item, index) in props.topBtnList" :key="index">
      <Dom :item="item" />
    </div>
  </div>
</template>
<script setup>
import Dom from "./dom.vue";
const props = defineProps({
  topBtnList: {
    type: Array,
    default: () => [],
  },
});
</script>
<style scoped lang="scss">
.topBtn {
  padding: 15px 0 12px 12px;
  display: flex;
  align-items: center;
  .item {
    margin-right: 10px;
  }
}
</style>
