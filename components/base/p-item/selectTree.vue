<template>
  <div class="text" v-if="props.config.isText">
    {{ getLabel }}
  </div>
  <el-tree-select
    v-model="value"
    :placeholder="props.config.placeholder || '请选择'"
    :disabled="props.config.isDisabled"
    v-bind="props.config.more"
    v-else
    @change="change"
    :data="options"
    collapse-tags
    collapse-tags-tooltip
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { structure } from "@Passets/utils/array";
const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: "",
  },
  config: {
    type: Object,
    default: () => {},
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const value = ref(props.modelValue);
const options = ref([]);

const change = (val) => {
  emits("update:modelValue", value.value);
  emits("change", val);
};
const getLabel = computed(() => {
  if (Array.isArray(value.value)) {
    let str = "";
    if (value.value && value.value.length > 0) {
      value.value.forEach((it) => {
        const row = options.value.find((item) => item.value == it);
        if (row) {
          str += row.label + ",";
        } else {
          str += it + ",";
        }
      });
    }
    return str ? str.substring(0, str.length - 1) : str;
  } else {
    const row = options.value.find((it) => it.value == value.value);
    if (row) {
      return row.label;
    }
    return value.value;
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal;
  },
);
watch(
  () => props.config.options,
  (newVal) => {
    options.value = structure(newVal, "parentId", "value");
  },
  {
    deep: true,
    immediate: true,
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
