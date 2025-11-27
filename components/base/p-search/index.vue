<script setup>
import { ref } from "vue";

const props = defineProps({
  // 是否显示重置按钮
  showReset: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["search", "reset"]);

// 是否展开搜索区域
const showSearch = ref(true);
</script>

<template>
  <div class="search">
    <div class="searchTitle">
      <span class="searchTitleText">查询条件</span>
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
      <slot></slot>
      <div class="searchPlaceholder"></div>
      <div class="searchBtn">
        <el-button type="primary" plain @click="emits('search')"
          >搜索</el-button
        >
        <el-button v-show="showReset" @click="emits('reset')">重置</el-button>
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

    .searchTitleText {
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

    .searchPlaceholder {
      width: 160px;
      height: 30px;
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
