<template>
  <div class="text" v-if="props.config.isText">
    {{ getLabel }}
  </div>
  <el-radio-group
    v-model="value"
    :disabled="props.config.isDisabled"
    v-bind="props.config.more"
    v-else
    @change="change"
  >
    <el-radio
      v-for="(it, index) in options"
      :key="index"
      :label="it.label"
      :value="it.value"
    />
  </el-radio-group>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useEnumStore } from "@Passets/stores/enum";
const enumStore = useEnumStore();
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
const options = ref(props.config.options);

const change = (val) => {
  emits("update:modelValue", value.value);
  emits("change", val);
};
const getLabel = computed(() => {
  const row = options.value.find((it) => it.value == value.value);
  if (row) {
    return row.label;
  }
  return value.value;
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
    options.value = newVal;
  },
  {
    deep: true,
  },
);
watch(
  () => props.config.enumKey,
  (newVal) => {
    if (newVal) {
      enumStore.getEnum(props.config.enumKey).then((res) => {
        if (res) {
          let list = res[props.config.enumKey];
          options.value = list;
        }
      });
    }
  },
  {
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
