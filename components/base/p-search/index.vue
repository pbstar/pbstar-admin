<script setup>
import { ref } from "vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
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
const showSearch = ref(true);

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
    <div class="searchTitle">
      <span>查询条件</span>
      <el-button
        type="primary"
        size="small"
        text
        @click="showSearch = !showSearch"
      >
        {{ showSearch ? "收起" : "展开" }}
      </el-button>
    </div>
    <div class="searchContent" v-show="showSearch">
      <p-item
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
      </p-item>
      <div class="item" style="width: 160px; height: 30px"></div>
      <div class="searchBtn">
        <el-button type="primary" plain @click="toSearch">搜索</el-button>
        <el-button v-show="props.showReset" @click="toReset">重置</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search {
  width: 100%;
  background: var(--c-bg-box);
  color: var(--c-text2);
  padding: 5px;
  .searchTitle {
    width: 100%;
    height: 18px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      line-height: 18px;
      font-size: 14px;
      font-weight: bold;
      border-left: 3px solid var(--c-bg-theme);
      padding-left: 5px;
    }
  }
  .searchContent {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-top: -5px;
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
      bottom: 5px;
    }
  }
}
</style>
