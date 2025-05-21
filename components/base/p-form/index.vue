<script setup>
import { ref } from "vue";
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
});
const emit = defineEmits(["change"]);
const data = ref(props.data);
const valueObj = ref({});
const handleChange = (val) => {
  emit("change", val);
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
const toChangeValue = (obj) => {
  valueObj.value = { ...valueObj.value, ...obj };
};
const getFormValue = () => {
  const errList = [];
  data.value.forEach((item) => {
    if (item.isRequired) {
      const value = valueObj.value[item.key];
      if (!value && value !== 0 && value !== false) {
        errList.push(item);
      }
    }
  });
  const errlabels = errList.map((item) => item.label).join("、");
  const errMsg = errlabels ? `${errlabels}不能为空` : "";
  return {
    errList,
    errMsg,
    value: valueObj.value,
  };
};
const getWidth = (index) => {
  let span = props.spanList[index] || 6;
  if (span > 12 || span < 1) {
    console.warn("[p-form]span的值必须在1-12之间");
    span = 6;
  }
  return `calc(${(span * 100) / 12}% - 20px)`;
};
defineExpose({
  toChangeData,
  toChangeValue,
  getFormValue,
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
}
</style>
