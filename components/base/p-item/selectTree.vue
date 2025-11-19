<template>
  <div :style="textStyles" v-if="config.isText">{{ getLabel }}</div>
  <el-tree-select
    v-else
    v-model="value"
    :placeholder="config.placeholder || '请选择'"
    :disabled="config.isDisabled"
    v-bind="config.more"
    :data="options"
    collapse-tags
    collapse-tags-tooltip
    @change="handleChange"
  />
</template>

<script setup>
import { structure } from "@Passets/utils/array";
import { useFormItem, commonProps, commonEmits } from "../hooks/useFormItem.js";

const props = defineProps(commonProps);
const emits = defineEmits(commonEmits);

const { value, options, handleChange, getLabel } = useFormItem(props, emits, {
  handleTree: true,
  structureFn: structure,
});
</script>
