<script setup>
import { ref } from "vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import { useFormData } from "../hooks/useFormData.js";

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

const { data: formData, valueObj, updateData, resetValue } = useFormData(props);
const showSearch = ref(true);

const handleChange = (val) => emit("change", val);

const toSearch = () =>
  emit("btnClick", { type: "search", data: valueObj.value });

const toReset = () => {
  resetValue();
  emit("btnClick", { type: "reset", data: valueObj.value });
};

defineExpose({
  toChangeData: updateData,
  toChangeValue: updateData,
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
        v-for="(item, index) in formData"
        :key="index"
        class="item"
        :config="item"
        v-model="valueObj[item.key]"
        @change="handleChange"
      >
        <template v-if="item.type === 'slot'" #[item.key]>
          <slot :name="item.key"></slot>
        </template>
      </p-item>

      <div class="item placeholder"></div>

      <div class="searchBtn">
        <el-button type="primary" plain @click="toSearch">搜索</el-button>
        <el-button v-show="showReset" @click="toReset">重置</el-button>
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 18px;
    margin: 5px;

    span {
      font-size: 14px;
      font-weight: bold;
      border-left: 3px solid var(--c-bg-theme);
      padding-left: 5px;
      line-height: 18px;
    }
  }

  .searchContent {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-top: -5px;

    .item {
      width: 300px;
      margin: 5px 20px 5px 0;

      &.placeholder {
        width: 160px;
        height: 30px;
      }
    }

    .searchBtn {
      position: absolute;
      right: 10px;
      bottom: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
    }
  }
}
</style>
