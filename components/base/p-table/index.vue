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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

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
});

const emit = defineEmits(["paginationChange", "selectionChange"]);

const pageNumber = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectionList = ref([]);

// 是否显示分页
const hasPagination = computed(() => {
  return props.pagination && Object.keys(props.pagination).length > 0;
});

const getIndex = (index) => {
  return (pageNumber.value - 1) * pageSize.value + index + 1;
};

// 分页变化处理
const handleSizeChange = (val) => {
  pageSize.value = val;
  emit("paginationChange", {
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
  });
};

const handleCurrentChange = (val) => {
  pageNumber.value = val;
  emit("paginationChange", {
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
  });
};
const handleSelectionChange = (val) => {
  selectionList.value = val;
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
  padding-bottom: 10px;
  .topBtn {
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
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
        padding-top: 10px;
      }
    }
  }
}
</style>
