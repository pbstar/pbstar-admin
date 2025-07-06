<template>
  <div class="text" v-if="props.config.isText">
    {{ value }}
  </div>
  <el-input
    v-model="value"
    :placeholder="props.config.placeholder || '请输入'"
    :disabled="props.config.isDisabled"
    v-bind="props.config.more"
    v-else
    @change="change"
  />
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  config: {
    type: Object,
    default: () => {},
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const value = ref(props.modelValue);

const change = (val) => {
  emits("update:modelValue", value.value);
  emits("change", val);
};

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
  },
);
</script>
<style scoped lang="scss">
.text {
  height: 30px;
  padding: 0 6px;
  line-height: 30px;
  color: var(--c-text);
  border-bottom: 1px solid var(--c-border);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }
}
</style>
