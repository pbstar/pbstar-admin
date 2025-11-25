<script setup>
import { computed } from "vue";
import { PItem } from "@Pcomponents";
import { useFormData } from "../hooks/useFormData.js";
import { validateRequired } from "./validation.js";

const props = defineProps({
  // 表单配置数据
  data: {
    type: Array,
    default: () => [],
  },
  // 每列的宽度配置（12 栅格系统）
  spanList: {
    type: Array,
    default: () => [],
  },
  // 表单值
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["change", "update:modelValue"]);

const { formData, valueObj, updateData, handleChange } = useFormData(
  props,
  emits,
);

// 判断是否为移动端
const isMobile = computed(() => window.innerWidth <= 700);

// 计算每列的宽度
const getWidth = (index) => {
  const span = props.spanList[index] || 6;
  let width = span < 1 || span > 12 ? 6 : span;
  width = isMobile.value ? 12 : width;
  return `calc(${(width * 100) / 12}% - 20px)`;
};

defineExpose({
  toChangeData: updateData,
  toCheckRequired: () => validateRequired(formData.value, valueObj.value),
});
</script>

<template>
  <div class="form">
    <p-item
      v-for="(item, index) in formData"
      :key="index"
      class="item"
      :style="{ width: getWidth(index) }"
      :config="item"
      v-model="valueObj[item.key]"
      @change="handleChange"
    >
      <template v-if="item.type === 'slot'">
        <slot :name="item.key"></slot>
      </template>
    </p-item>
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-wrap: wrap;

  .item {
    flex-shrink: 0;
    margin-right: 20px;
    margin-bottom: 10px;
  }

  @media screen and (max-width: 700px) {
    .item {
      margin-right: 10px;
      margin-left: 10px;
    }
  }
}
</style>
