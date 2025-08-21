<template>
  <div class="text" v-if="props.config.isText">
    {{ getLabel }}
  </div>
  <el-date-picker
    v-model="value"
    type="datetimerange"
    range-separator="至"
    value-format="YYYY-MM-DD hh:mm:ss"
    start-placeholder="开始日期时间"
    end-placeholder="结束日期时间"
    :disabled="props.config.isDisabled"
    v-bind="props.config.more"
    v-else
    @change="change"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: [],
  },
  config: {
    type: Object,
    default: () => {},
  },
});
const emits = defineEmits(["update:modelValue", "change"]);

const value = ref(props.modelValue || []);

const change = (val) => {
  emits("update:modelValue", value.value);
  emits("change", val);
};
const getLabel = computed(() => {
  if (value.value && value.value.length > 0) {
    return value.value.join("-");
  }
});

watch(
  () => props.modelValue,
  (newVal) => {
    value.value = newVal || [];
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
