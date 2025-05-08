<script setup>
import { ref, watch } from "vue";
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
const data = ref([]);
const handleChange = (val) => {
  emit("change", val);
};
watch(
  () => props.data,
  (newVal) => {
    data.value = newVal.map((item) => {
      if (item.isRequired !== true) {
        item.isRequired = false;
      }
      return { ...item };
    });
  },
  {
    immediate: true,
  }
);

const toSearch = () => {
  const obj = {};
  data.value.forEach((item) => {
    if (item.value || item.value == 0 || item.value == false) {
      obj[item.key] = item.value;
    }
  });
  emit("btnClick", {
    type: "search",
    data: obj,
  });
};
const toReset = () => {
  const obj = {};
  data.value.forEach((item) => {
    delete item.value;
  });
  emit("btnClick", {
    type: "reset",
    data: obj,
  });
};
const toChangeDataOptions = ({ key, options }) => {
  if (!key || !options) {
    return;
  }
  const index = data.value.findIndex((item) => item.key == key);
  if (index > -1) {
    data.value[index].options = options;
  }
};
defineExpose({
  toChangeDataOptions,
});
</script>
<template>
  <div class="search">
    <formItem
      class="item"
      v-for="(item, index) in data"
      :key="index"
      :item="item"
      v-model="item.value"
      @change="handleChange"
    ></formItem>
    <div class="item" style="width: 160px; height: 32px"></div>
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
