<script setup>
import { ref, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import PItem from "@Pcomponents/base/p-item/index.vue";
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  spanList: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["change", "update:modelValue"]);
const data = ref(props.data);
const isMobile = computed(() => {
  return window.innerWidth <= 700;
});
const valueObj = ref({});
const handleChange = (val) => {
  emit("change", val);
  emit("update:modelValue", valueObj.value);
};
const toChangeData = (list) => {
  list.forEach((item) => {
    if (!item.key) {
      console.warn("[p-form]toChangeData方法的数组参数中必须包含key");
      return;
    }
    const index = data.value.findIndex((it) => it.key == item.key);
    if (index > -1) {
      data.value[index] = { ...data.value[index], ...item };
    }
  });
};
//必填校验
const toCheckRequired = () => {
  const errs = [];
  data.value.forEach((item) => {
    if (item.isRequired) {
      const value = valueObj.value[item.key];
      if (!value && value !== 0 && value !== false) {
        errs.push(item.label);
      }
    }
  });
  if (errs.length > 0) {
    ElMessage.error(`${errs.join(",")}为必填项`);
    return false;
  } else {
    return true;
  }
};
const getWidth = (index) => {
  let span = props.spanList[index] || 6;
  if (span > 12 || span < 1) {
    console.warn("[p-form]span的值必须在1-12之间");
    span = 6;
  }
  if (isMobile.value) {
    span = 12; //移动端全部占满宽度
    return `calc(${(span * 100) / 12}% - 10px)`;
  }
  return `calc(${(span * 100) / 12}% - 20px)`;
};
watch(
  () => props.modelValue,
  (newVal) => {
    valueObj.value = { ...valueObj.value, ...newVal };
  },
  {
    immediate: true,
    deep: true,
  },
);
defineExpose({
  toChangeData,
  toCheckRequired,
});
</script>
<template>
  <div class="form">
    <p-item
      class="item"
      v-for="(item, index) in data"
      :key="index"
      :style="{
        width: getWidth(index),
      }"
      :config="item"
      v-model="valueObj[item.key]"
      @change="handleChange"
    >
      <template v-if="item.type === 'slot'">
        <slot :name="item.key"></slot>
      </template>
    </p-item>
  </div>
</template>
<style scoped lang="scss">
.form {
  display: flex;
  flex-wrap: wrap;
  .item {
    flex-shrink: 0;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  @media screen and (max-width: 700px) {
    .item {
      margin-right: 10px;
    }
  }
}
</style>
