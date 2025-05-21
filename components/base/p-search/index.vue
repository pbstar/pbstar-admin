<script setup>
import { ref } from "vue";
import formItem from "@Pcomponents/base/p-item/index.vue";
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  showReset: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["change", "btnClick"]);
const data = ref(props.data);
const valueObj = ref({});
const handleChange = (val) => {
  emit("change", val);
};
const toSearch = () => {
  emit("btnClick", {
    type: "search",
    data: valueObj.value,
  });
};
const toReset = () => {
  valueObj.value = {};
  emit("btnClick", {
    type: "reset",
    data: valueObj.value,
  });
};
const toChangeData = (list) => {
  list.forEach((item) => {
    if (!item.key) {
      console.warn("toChangeData方法的数组参数中必须包含key");
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
defineExpose({
  toChangeData,
  toChangeValue,
});
</script>
<template>
  <div class="search">
    <formItem
      class="item"
      v-for="(item, index) in data"
      :key="index"
      :config="item"
      v-model="valueObj[item.key]"
      @change="handleChange"
    >
      <template v-if="item.type === 'slot'" #[item.key]>
        <slot :name="item.key"></slot>
      </template>
    </formItem>
    <div class="item" style="width: 160px; height: 30px"></div>
    <div class="searchBtn">
      <el-button type="primary" plain @click="toSearch">搜索</el-button>
      <el-button v-show="props.showReset" @click="toReset">重置</el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search {
  width: 100%;
  background: var(--c-bg-box);
  color: var(--c-text2);
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  position: relative;
  .item {
    width: 300px;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-right: 20px;
  }
  .searchBtn {
    width: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
</style>
