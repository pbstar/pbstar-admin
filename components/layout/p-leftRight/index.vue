<template>
  <el-splitter class="p-leftRight">
    <el-splitter-panel
      class="left"
      :size="props.leftWidth"
      :min="props.leftMinWidth"
      :max="props.leftMaxWidth"
    >
      <slot name="left"></slot>
    </el-splitter-panel>
    <el-splitter-panel class="right">
      <slot name="right"></slot>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
const props = defineProps({
  leftWidth: {
    type: [String, Number],
    default: 220,
  },
  leftMinWidth: {
    type: [String, Number],
    default: 100,
  },
  leftMaxWidth: {
    type: [String, Number],
    default: 380,
  },
});
</script>
<style scoped lang="scss">
.p-leftRight {
  width: 100%;
  :deep(.left) {
    padding-right: 10px;
  }
  :deep(.right) {
    padding-left: 10px;
  }
}
</style>
