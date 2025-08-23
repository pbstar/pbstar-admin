<script setup>
import { computed } from "vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import { useFormData } from "../hooks/useFormData.js";
import { validateRequired, normalizeSpan } from "../utils/validation.js";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  spanList: {
    type: Array,
    default: () => [],
  },
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
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});

const getWidth = (index) => {
  const span = normalizeSpan(props.spanList[index]);
  const actualSpan = isMobile.value ? 12 : span;
  return `calc(${(actualSpan * 100) / 12}% - 20px)`;
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
