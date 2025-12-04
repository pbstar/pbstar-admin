<script setup>
import { ref, watch } from "vue";
import { cloneDeep } from "es-toolkit/object";
import { ElMessageBox } from "element-plus";
import { PTable, PDialog, PButton, PItem } from "@Pcomponents";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

const tableData = ref([]);
const detailType = ref("");
const detailInfo = ref({});
const isDetail = ref(false);

const getWebId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return "webId_" + timestamp + "_" + randomNum;
};
const handleChange = (val) => {
  let arr = cloneDeep(val);
  arr.forEach((item) => {
    if (item["webId"]) {
      delete item["webId"];
    }
  });
  emit("update:modelValue", arr);
  emit("change", arr);
};

const handleEdit = (row) => {
  detailType.value = "edit";
  const index = tableData.value.findIndex((item) => {
    return item.webId === row.webId;
  });
  isDetail.value = true;
  if (index > -1) {
    detailInfo.value = cloneDeep(tableData.value[index]);
  }
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      const index = tableData.value.findIndex((item) => {
        return item.webId === row.webId;
      });
      if (index > -1) {
        tableData.value.splice(index, 1);
        handleChange(tableData.value);
      }
    })
    .catch(() => {});
};

const handleAdd = () => {
  detailType.value = "add";
  detailInfo.value = {};
  detailInfo.value.webId = getWebId();
  isDetail.value = true;
};

const handleSave = () => {
  if (detailType.value === "add") {
    tableData.value.push(detailInfo.value);
  } else if (detailType.value === "edit") {
    const index = tableData.value.findIndex((item) => {
      return item.webId === detailInfo.value.webId;
    });
    if (index > -1) {
      tableData.value[index] = detailInfo.value;
    }
  }
  handleChange(tableData.value);
  isDetail.value = false;
};

const handleBack = () => {
  isDetail.value = false;
};

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal && newVal.length > 0) {
      tableData.value = cloneDeep(newVal);
      tableData.value.forEach((item) => {
        if (!item.webId) {
          item.webId = getWebId();
        }
      });
    } else {
      tableData.value = [];
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <div class="childBox">
    <p-table :data="tableData">
      <template #topLeft>
        <p-button type="primary" @click="handleAdd()"> 新增 </p-button>
      </template>
      <template #column>
        <el-table-column prop="name" label="按钮名称" />
        <el-table-column prop="key" label="按钮Key" />
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="160"
        >
          <template #default="{ row }">
            <p-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </p-button>
            <p-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              删除
            </p-button>
          </template>
        </el-table-column>
      </template>
    </p-table>

    <p-dialog type="box" title="按钮详情页" v-model="isDetail">
      <div class="dialog-form">
        <p-item
          class="item"
          :config="{ label: '按钮名称', type: 'input' }"
          v-model="detailInfo.name"
        />
        <p-item
          class="item"
          :config="{ label: '按钮Key', type: 'input' }"
          v-model="detailInfo.key"
        />
      </div>
      <template #footer>
        <p-button type="primary" @click="handleSave()"> 保存 </p-button>
        <p-button @click="handleBack()"> 返回 </p-button>
      </template>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.childBox {
  width: 100%;
}

.dialog-form {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 10px;
}

.dialog-form .item {
  width: 100%;
}
</style>
