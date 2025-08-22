<template>
  <div :style="textStyles" v-if="config.isText">{{ getLabel }}</div>
  <el-checkbox-group
    v-else
    v-model="value"
    :disabled="config.isDisabled"
    v-bind="config.more"
    @change="handleChange"
  >
    <el-checkbox
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-checkbox-group>
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

const { value, options, handleChange, getLabel } = useFormItem(props, emits, {
  handleOptions: true,
  handleArray: true,
});
</script>
