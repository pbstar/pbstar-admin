<template>
  <div class="tabulation">
    <!-- 顶部操作区 -->
    <div class="topBtn" v-if="$slots.topLeft || $slots.topRight">
      <div class="tLeft">
        <slot name="topLeft"></slot>
      </div>
      <div class="tRight">
        <slot name="topRight"></slot>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      class="table"
      :data="data"
      :border="true"
      :stripe="true"
      :max-height="maxHeight"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列 -->
      <el-table-column v-if="showSelection" type="selection" width="55" />
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        label="序号"
        type="index"
        :index="getIndex"
        width="60"
      />
      <!-- 列 -->
      <slot name="column"></slot>
    </el-table>
    <!-- 底部操作区 -->
    <div class="bot" v-if="$slots.botLeft || hasPagination">
      <div class="bLeft">
        <slot name="botLeft"></slot>
      </div>
      <div class="bRight">
        <el-pagination
          v-if="hasPagination"
          class="pagination"
          v-model:current-page="pageNumber"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handlePaginationChange"
          @current-change="handlePaginationChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 分页配置
  pagination: {
    type: Object,
    default: () => ({}),
  },
  // 是否显示选择列
  showSelection: {
    type: Boolean,
    default: false,
  },
  // 是否显示序号列
  showIndex: {
    type: Boolean,
    default: true,
  },
  // 表格最大高度
  maxHeight: {
    type: [String, Number],
    default: "800",
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 每页条数可选项
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
});

const emit = defineEmits(["paginationChange", "selectionChange"]);

const pageNumber = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 是否显示分页
const hasPagination = computed(() => {
  return props.pagination && Object.keys(props.pagination).length > 0;
});

// 计算序号
const getIndex = (index: number) => {
  return (pageNumber.value - 1) * pageSize.value + index + 1;
};

// 分页变化：el-pagination 在“改变每页条数导致总页数缩小”时会连续触发
// size-change 和 current-change 两个事件，这里合并到同一个 tick 只 emit 一次，
// 避免父组件收到两次 paginationChange 而重复发起请求
let paginationEmitScheduled = false;
const handlePaginationChange = () => {
  if (paginationEmitScheduled) return;
  paginationEmitScheduled = true;
  nextTick(() => {
    paginationEmitScheduled = false;
    emit("paginationChange", {
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
    });
  });
};
// 选择项变化
const handleSelectionChange = (val: any[]) => {
  emit("selectionChange", val);
};

// 监听分页信息变化
watch(
  () => props.pagination,
  (val) => {
    if (!val || Object.keys(val).length === 0) {
      return;
    }
    pageNumber.value = val.pageNumber || 1;
    pageSize.value = val.pageSize || 10;
    total.value = val.total || 0;
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<style scoped lang="scss">
.tabulation {
  width: 100%;
  padding: var(--space-3);
  padding-bottom: var(--space-2);
  background: var(--c-bg);
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  .topBtn {
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--space-3);
    .tLeft {
      display: flex;
      align-items: center;
    }
    .tRight {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .table {
    width: 100%;
    --el-table-border-color: var(--c-border);
    --el-table-border: 1px solid var(--c-border);
    :deep(thead th) {
      background: var(--c-bg-box);
      color: var(--c-text2);
      font-weight: normal;
    }
    /* 修复tooltip错位问题 */
    :deep(.el-popper) {
      position: absolute !important;
    }

    :deep(.el-button + .el-button) {
      margin-left: 5px;
    }
  }
  .bot {
    display: flex;
    justify-content: space-between;
    .bRight {
      .pagination {
        padding-top: var(--space-3);
      }
    }
  }
}
</style>
