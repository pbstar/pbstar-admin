<template>
  <el-button size="small" circle @click="handleClickSetting()">
    <p-icon name="el-icon-operation" />
  </el-button>
  <p-dialog
    type="drawer"
    title="定制表头"
    v-model="isDialog"
    :botBtn="[
      {
        label: '保存',
        key: 'save',
      },
      {
        label: '返回',
        key: 'back',
      },
      {
        label: '重置',
        key: 'reset',
      },
    ]"
    @botBtnClick="dialogBotBtnClick"
  >
    <div class="row">
      <VueDraggable
        ghostClass="ghost"
        handle=".handle"
        :animation="150"
        v-model="allColumn"
      >
        <div class="item" v-for="item in allColumn" :key="item.key">
          <el-checkbox v-model="item.isChecked" :label="item.label" />
          <p-icon class="handle" name="el-icon-sort" />
        </div>
      </VueDraggable>
    </div>
  </p-dialog>
</template>
<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { VueDraggable } from "vue-draggable-plus";
import pDialog from "@Pcomponents/base/p-dialog/index.vue";
import { useTableStore } from "@Passets/stores/base";
const tableStore = useTableStore();
const props = defineProps({
  column: {
    type: Array,
    default: () => [],
  },
  tableKey: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["change"]);
const isDialog = ref(false);
const allColumn = ref([]);

const handleColumnList = (type) => {
  const columnList = [];
  allColumn.value.forEach((item) => {
    if (item.isChecked) {
      const obj = props.column.find((i) => i.key == item.key);
      columnList.push(obj);
    }
  });
  if (type == "save") {
    const list = columnList.map((item) => item.key);
    tableStore.changeSetting(props.tableKey, list);
  } else if (type == "reset") {
    tableStore.removeSetting(props.tableKey);
  }
  emit("change", { columnList });
};

const initAllColumn = () => {
  allColumn.value = [];
  const list = tableStore.getSetting(props.tableKey);
  if (list == null) {
    props.column.forEach((item) => {
      allColumn.value.push({ ...item, isChecked: true });
    });
    return;
  }
  list.forEach((item) => {
    const it = props.column.find((i) => i.key == item);
    if (it) {
      allColumn.value.push({ ...it, isChecked: true });
    }
  });
  props.column.forEach((item) => {
    if (!list.includes(item.key)) {
      allColumn.value.push({ ...item, isChecked: false });
    }
  });
  handleColumnList("init");
};

const dialogBotBtnClick = ({ btn }) => {
  if (btn == "save") {
    handleColumnList("save");
    ElMessage.success("操作成功");
    isDialog.value = false;
  } else if (btn == "reset") {
    allColumn.value = [];
    props.column.forEach((item) => {
      allColumn.value.push({ ...item, isChecked: true });
    });
    handleColumnList("reset");
    ElMessage.success("操作成功");
    isDialog.value = false;
  } else {
    isDialog.value = false;
  }
};
const handleClickSetting = () => {
  isDialog.value = true;
};
if (props.tableKey) {
  initAllColumn();
}
</script>
<style lang="scss" scoped>
.row {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    height: 26px;
    padding: 0 10px;
    background-color: var(--c-bg-box);
    .handle {
      cursor: move;
    }
  }
  .ghost {
    background-color: var(--c-bg-theme-light);
    opacity: 0.5;
  }
}
</style>
