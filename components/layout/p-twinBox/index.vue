<template>
  <el-splitter class="p-twinBox" :layout="isMobile ? 'vertical' : 'horizontal'">
    <el-splitter-panel class="panel1" :size="size" :min="min" :max="max">
      <slot name="plan1" />
    </el-splitter-panel>

    <el-splitter-panel class="panel2">
      <slot name="plan2" />
    </el-splitter-panel>
  </el-splitter>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: [String, Number],
    default: 220,
  },
  min: {
    type: [String, Number],
    default: 100,
  },
  max: {
    type: [String, Number],
    default: 380,
  },
});
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});
</script>

<style scoped lang="scss">
.p-twinBox {
  width: 100%;
  @media (min-width: 701px) {
    :deep(.panel1) {
      padding-right: 10px;
    }
    :deep(.panel2) {
      padding-left: 10px;
    }
  }
  @media (max-width: 700px) {
    :deep(.panel1) {
      padding-bottom: 10px;
    }
  }
}
</style>
