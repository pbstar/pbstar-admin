<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: "查询条件",
  },
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
      <span class="searchTitleText">{{ props.title }}</span>
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
    <div v-show="!showSearch" class="searchContentNo"></div>
  </div>
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  background: var(--c-bg);
  color: var(--c-text2);
  padding: var(--space-3) var(--space-3) 0;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);

  .searchTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 18px;
    margin: 0 0 var(--space-2);

    .searchTitleText {
      font-size: var(--font-size-sm);
      font-weight: 600;
      border-left: 3px solid var(--c-bg-theme);
      padding-left: var(--space-2);
      line-height: 18px;
      color: var(--c-text);
    }
  }

  .searchContent {
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .searchPlaceholder {
      width: 160px;
      height: 30px;
      margin-bottom: var(--space-3);
    }

    .searchBtn {
      position: absolute;
      right: var(--space-2);
      bottom: var(--space-3);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
    }
  }

  .searchContentNo {
    height: var(--space-1);
  }
}
</style>
