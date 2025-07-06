<template>
  <div class="text" v-if="props.config.isText">
    {{ value }}
  </div>
  <el-input
    v-model="value"
    type="textarea"
    :disabled="props.config.isDisabled"
    :placeholder="props.config.placeholder || '请输入'"
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
.textBig {
  height: auto;
  padding: 5px 6px;
  line-height: 20px;
  color: var(--c-text);
  border-bottom: 1px solid var(--c-border);
  //单词换行
  word-break: break-word;
}
</style>
