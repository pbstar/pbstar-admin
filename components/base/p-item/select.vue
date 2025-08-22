<template>
  <div :style="textStyles" v-if="config.isText">{{ getLabel }}</div>
  <el-select
    v-else
    v-model="value"
    :placeholder="config.placeholder || '请选择'"
    :disabled="config.isDisabled"
    v-bind="config.more"
    @change="handleChange"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup>
import {
  useFormItem,
  commonProps,
  commonEmits,
  textStyles,
} from "../hooks/useFormItem.js";

const props = defineProps(commonProps);
const emits = defineEmits(commonEmits);

const { value, options, handleChange, getLabel } = useFormItem(props, emits, {
  handleOptions: true,
});
</script>
