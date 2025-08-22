<template>
  <div :style="textStyles" v-if="config.isText">{{ value }}</div>
  <el-date-picker
    v-else
    v-model="value"
    type="date"
    value-format="YYYY-MM-DD"
    :placeholder="config.placeholder || '请选择日期'"
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

const props = defineProps(commonProps);
const emits = defineEmits(commonEmits);

const { value, handleChange } = useFormItem(props, emits);
</script>
