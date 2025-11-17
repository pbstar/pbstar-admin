<template>
  <div class="tabulation">
    <div class="topBtn">
      <div class="tLeft">
        <topBtn :btns="topBtnList" @btnClick="handleClickTop" />
      </div>
      <div class="tRight">
        <el-button
          v-if="props.export"
          size="small"
          :loading="exportLoading"
          circle
          @click="toExport"
        >
          <p-icon name="el-icon-download" />
        </el-button>
        <setting
          v-if="props.showSetting && props.tableKey"
          :tableKey="props.tableKey"
          :column="allColumn"
          @change="settingChange"
        />
        <slot name="topRight"></slot>
      </div>
    </div>
    <el-table
      class="table"
      :style="{
        marginTop:
          topBtnList.length > 0 || (props.showSetting && props.tableKey)
            ? '10px'
            : '0px',
      }"
      :data="dataList"
      border
      row-key="id"
      stripe
      :max-height="props.maxHeight"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="props.showSelection" />
      <el-table-column
        label="序号"
        type="index"
        :index="getIndex"
        width="60"
        v-if="props.showIndex"
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
        v-if="rightBtnList.length > 0"
      >
        <template #default="scope">
          <rightBtn
            :data="scope.row"
            :btns="rightBtnList"
            @btnClick="handleClick"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="bot">
      <div class="bLeft">
        <slot name="botLeft"></slot>
      </div>
      <div class="bRight">
        <el-pagination
          class="pagination"
          v-if="props.pagination && props.pagination != {}"
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
import topBtn from "./topBtn.vue";
import rightBtn from "./rightBtn.vue";
import setting from "./setting.vue";
import { useEnumStore } from "@Passets/stores/enum";
import useSharedStore from "@Passets/stores/shared";
const enumStore = useEnumStore();
const sharedStore = useSharedStore();

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  column: {
    type: Array,
    default: () => [],
  },
  rightBtn: {
    type: Array,
    default: () => [],
  },
  topBtn: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: () => {},
  },
  showSetting: {
    type: Boolean,
    default: false,
  },
  tableKey: {
    type: String,
    default: "",
  },
  showSelection: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: [String, Number],
    default: "800",
  },
  export: {
    type: [Function, null],
    default: null,
  },
});
const emit = defineEmits(["rightBtnClick", "topBtnClick", "paginationChange"]);

const columnList = ref([]);
const allColumn = ref(props.column);
const dataList = ref([]);
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
const topBtnList = ref([]);
const rightBtnList = ref([]);
const mybtns = ref(sharedStore.userInfo?.btns);

if (props.showSetting && !props.tableKey) {
  console.error("showSetting为true时必须传入tableKey");
}
const enumKeyList = [];
allColumn.value.forEach((item) => {
  item = Object.assign(columnItemDefault, item);
  if (
    item.enumKey &&
    !enumKeyList.includes(item.enumKey) &&
    (!item.options || item.options.length == 0)
  ) {
    enumKeyList.push(item.enumKey);
  }
});
columnList.value = allColumn.value;
if (enumKeyList.length > 0) {
  let str = enumKeyList.join(",");
  enumStore.getEnum(str).then((res) => {
    if (res) {
      for (const enumKey in res) {
        allColumn.value.forEach((item) => {
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
const handleClick = ({ row, btn }) => {
  emit("rightBtnClick", { row, btn });
};
const handleClickTop = ({ btn }) => {
  const obj = {
    btn,
  };
  if (props.showSelection) {
    obj.selectionList = selectionList.value;
  }
  emit("topBtnClick", obj);
};
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
const settingChange = (val) => {
  columnList.value = val.columnList || [];
};
const handleSelectionChange = (val) => {
  selectionList.value = val;
};
const toChangeColumn = (list) => {
  list.forEach((item) => {
    if (!item.key) {
      console.warn("toChangeColumn方法的数组参数中必须包含key");
      return;
    }
    const index = allColumn.value.findIndex((it) => it.key == item.key);
    if (index > -1) {
      allColumn.value[index] = Object.assign(allColumn.value[index], item);
    }
  });
};
const toExport = () => {
  exportLoading.value = true;
  props.export((data) => {
    if (!data || !data.data) {
      ElMessage.error("导出失败");
      exportLoading.value = false;
      return;
    }
    const rows = [];
    const thCells = allColumn.value.map((item) => {
      return item.label;
    });
    rows.push({
      cells: thCells,
    });
    data.data.forEach((item) => {
      const row = [];
      allColumn.value.forEach((col) => {
        if (col.options) {
          const obj = col.options.find((it) => it.value == item[col.key]);
          if (obj) {
            row.push(obj.label);
            return;
          }
          row.push(item[col.key] || "");
          return;
        }
        row.push(item[col.key] || "");
      });
      rows.push({
        cells: row,
      });
    });

    pExportExcel({
      fileName: data.fileName || "导出数据表",
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
// 处理btn权限
const handleBtn = () => {
  topBtnList.value = [];
  rightBtnList.value = [];
  props.topBtn.forEach((item) => {
    if (
      !item.auth ||
      mybtns.value == "all" ||
      mybtns.value.includes(item.auth)
    ) {
      topBtnList.value.push(item);
    }
  });
  props.rightBtn.forEach((item) => {
    if (
      !item.auth ||
      mybtns.value == "all" ||
      mybtns.value.includes(item.auth)
    ) {
      rightBtnList.value.push(item);
    }
  });
};
handleBtn();
// 动态处理data
watch(
  () => props.data,
  (val) => {
    dataList.value = val || [];
  },
  {
    deep: true,
    immediate: true,
  },
);
// 动态更新分页信息
watch(
  () => props.pagination,
  (val) => {
    if (!val || val == {}) {
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
watch(
  () => sharedStore.userInfo,
  (newVal, oldVal) => {
    if (newVal) {
      mybtns.value = newVal.btns;
      handleBtn();
    }
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
      padding-top: 6px;
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
