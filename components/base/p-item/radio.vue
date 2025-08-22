<template>
  <div :style="textStyles" v-if="config.isText">{{ getLabel }}</div>
  <el-radio-group
    v-else
    v-model="value"
    :disabled="config.isDisabled"
    v-bind="config.more"
    @change="handleChange"
  >
    <el-radio
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-radio-group>
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

const { value, options, handleChange, getLabel } = useFormItem(props, emits, {
  handleOptions: true,
});
</script>
