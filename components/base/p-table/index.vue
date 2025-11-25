<template>
  <div class="tabulation">
    <!-- 顶部操作区 -->
    <div
      class="topBtn"
      v-if="$slots.topLeft || $slots.topRight || props.export"
    >
      <div class="tLeft">
        <slot name="topLeft"></slot>
      </div>
      <div class="tRight">
        <el-button
          style="margin-top: 6px"
          v-if="props.export"
          size="small"
          :loading="exportLoading"
          circle
          @click="toExport"
        >
          <p-icon name="el-icon-download" />
        </el-button>
        <slot name="topRight"></slot>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      class="table"
      :style="{
        marginTop:
          $slots.topLeft || $slots.topRight || props.export ? '10px' : '0px',
      }"
      :data="data"
      border
      :row-key="rowKey"
      stripe
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
      <template v-for="(item, i) in columnList" :key="i">
        <el-table-column
          v-if="item.slot"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
        >
          <template #default="scope">
            <slot :name="item.slot" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.options"
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
        >
          <template #default="scope">
            {{
              item.options.find((it) => it.value == scope.row[item.key])
                ?.label ||
              scope.row[item.key] ||
              ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.key"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
        />
      </template>
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
        :show-overflow-tooltip="false"
        v-if="$slots.operation"
      >
        <template #default="scope">
          <slot name="operation" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部操作区 -->
    <div
      class="bot"
      v-if="
        $slots.botLeft || (pagination && Object.keys(pagination).length > 0)
      "
    >
      <div class="bLeft">
        <slot name="botLeft"></slot>
      </div>
      <div class="bRight">
        <el-pagination
          v-if="pagination && Object.keys(pagination).length > 0"
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
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import pExportExcel from "p-export-excel";
import { PIcon } from "@Pcomponents";
import { useEnumStore } from "@Passets/stores/enum";
const enumStore = useEnumStore();

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 列配置
  column: {
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
  // 行 key 字段
  rowKey: {
    type: [String, Function],
    default: "id",
  },
  // 导出函数
  export: {
    type: [Function, null],
    default: null,
  },
});

const emit = defineEmits(["paginationChange", "selectionChange"]);

const columnList = ref(props.column);
const pageNumber = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectionList = ref([]);
const columnItemDefault = {
  key: "", //字段名
  label: "", //标题
  width: null, //宽度
  minWidth: 86, //最小宽度
  enumKey: null, //枚举类型
  options: [], //枚举值（优先级高于枚举类型）
  slot: null, //插槽名（非必填）
};
const exportLoading = ref(false);

const enumKeyList = [];
columnList.value.forEach((item) => {
  item = Object.assign(columnItemDefault, item);
  if (
    item.enumKey &&
    !enumKeyList.includes(item.enumKey) &&
    (!item.options || item.options.length == 0)
  ) {
    enumKeyList.push(item.enumKey);
  }
});
if (enumKeyList.length > 0) {
  let str = enumKeyList.join(",");
  enumStore.getEnum(str).then((res) => {
    if (res) {
      for (const enumKey in res) {
        columnList.value.forEach((item) => {
          if (item.enumKey == enumKey) {
            item.options = res[enumKey];
          }
        });
      }
    }
  });
}

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
const toChangeColumn = (list) => {
  list.forEach((item) => {
    if (!item.key) {
      console.warn("toChangeColumn方法的数组参数中必须包含key");
      return;
    }
    const index = columnList.value.findIndex((it) => it.key == item.key);
    if (index > -1) {
      columnList.value[index] = Object.assign(columnList.value[index], item);
    }
  });
};

// 导出功能
const toExport = () => {
  if (!props.export) return;

  exportLoading.value = true;
  props.export((e) => {
    if (!e || !e.data) {
      ElMessage.error("导出失败");
      exportLoading.value = false;
      return;
    }

    const rows = [];
    const thCells = columnList.value.map((item) => item.label);
    rows.push({ cells: thCells });

    e.data.forEach((item) => {
      const row = [];
      columnList.value.forEach((col) => {
        if (col.options) {
          const obj = col.options.find((it) => it.value == item[col.key]);
          row.push(obj ? obj.label : item[col.key] || "");
        } else {
          row.push(item[col.key] || "");
        }
      });
      rows.push({ cells: row });
    });

    pExportExcel({
      fileName: e.fileName || "导出数据表",
      sheets: [
        {
          sheetName: "sheet1",
          rows,
        },
      ],
    })
      .then(() => {
        exportLoading.value = false;
        ElMessage.success("导出成功");
      })
      .catch((err) => {
        exportLoading.value = false;
        console.error(err);
        ElMessage.error("导出失败");
      });
  });
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
defineExpose({
  toChangeColumn,
});
</script>
<style scoped>
.tabulation {
  width: 100%;
  padding-bottom: 10px;
  .topBtn {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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
