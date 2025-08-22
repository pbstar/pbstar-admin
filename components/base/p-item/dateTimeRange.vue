<template>
  <div :style="textStyles" v-if="config.isText">{{ getRangeLabel }}</div>
  <el-date-picker
    v-else
    v-model="value"
    type="datetimerange"
    range-separator="至"
    value-format="YYYY-MM-DD hh:mm:ss"
    start-placeholder="开始日期时间"
    end-placeholder="结束日期时间"
    :disabled="config.isDisabled"
    v-bind="config.more"
    @change="handleChange"
  />
</template>

<script setup>
import {
  useFormItem,
  commonProps,
  commonEmits,
  textStyles,
} from "./hooks/useFormItem.js";

const props = defineProps({
  ...commonProps,
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
});
const emits = defineEmits(commonEmits);

const { value, handleChange, getRangeLabel } = useFormItem(props, emits, {
  handleArray: true,
});
</script>
