<template>
  <div class="btns">
    <el-button
      v-for="(item, index) in btns"
      :key="index"
      type="primary"
      @click="handleClick(item.key)"
    >
      {{ item.label }}
    </el-button>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  btns: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["btnClick"]);
const btns = ref(props.btns);

const handleClick = (btn) => {
  emit("btnClick", { btn });
};
</script>
<style lang="scss" scoped>
.btns {
  display: flex;
  align-items: center;
}
</style>
