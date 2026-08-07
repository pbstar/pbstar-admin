<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { pTable, pDialog, pItem } from "@Pcomponents";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
});

onBeforeMount(() => {
  if (props.type !== "add") {
    initTable();
  }
});

const tableData = ref([]);
const detailType = ref("");
const detailInfo = ref({});
const isDetail = ref(false);

const initTable = () => {
  tableData.value = [];
  request
    .post({
      url: "/system/enum/getEnumList",
      data: {
        enumId: props.id,
      },
    })
    .then((res) => {
      if (res && res.code === 200) {
        tableData.value = res.data;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};
const handleEdit = (row) => {
  request
    .get({
      url: "/system/enum/getEnumDetail",
      data: { id: row.id },
    })
    .then((res) => {
      if (res && res.code === 200 && res.data) {
        detailType.value = "edit";
        detailInfo.value = res.data;
        isDetail.value = true;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};

const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      request
        .post({
          url: "/system/enum/deleteEnum",
          data: { idList: [row.id] },
        })
        .then((res) => {
          if (res && res.code === 200) {
            initTable();
            ElMessage.success("操作成功");
          } else {
            ElMessage.error(res?.msg || "操作异常");
          }
        });
    })
    .catch(() => {});
};

const handleAdd = () => {
  detailType.value = "add";
  detailInfo.value = {
    enumId: props.id,
  };
  isDetail.value = true;
};

const handleSave = () => {
  const url =
    detailType.value == "add"
      ? "/system/enum/createEnum"
      : "/system/enum/updateEnum";
  request
    .post({
      url,
      data: detailInfo.value,
    })
    .then((res) => {
      if (res && res.code === 200) {
        initTable();
        ElMessage.success("操作成功");
        isDetail.value = false;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};

const handleBack = () => {
  isDetail.value = false;
};

watch(
  () => props.id,
  (newVal, oldVal) => {
    if (newVal) {
      initTable();
    }
  },
);
</script>

<template>
  <div class="childBox">
    <p-table :data="tableData">
      <template #column>
        <el-table-column prop="label" label="枚举label" />
        <el-table-column prop="value" label="枚举value" />
        <el-table-column
          v-if="props.type !== 'view'"
          prop="operation"
          label="操作"
          fixed="right"
          width="160"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </template>
      <template #topLeft v-if="props.type !== 'add' && props.type !== 'view'">
        <el-button type="primary" @click="handleAdd"> 新增 </el-button>
      </template>
    </p-table>
    <p-dialog type="box" title="枚举值详情页" v-model="isDetail">
      <div class="dialog-form">
        <p-item class="item" label="枚举label">
          <el-input v-model="detailInfo.label" placeholder="请输入枚举label" />
        </p-item>
        <p-item class="item" label="枚举value">
          <el-input v-model="detailInfo.value" placeholder="请输入枚举value" />
        </p-item>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleSave()"> 保存 </el-button>
        <el-button @click="handleBack()"> 返回 </el-button>
      </template>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.childBox {
  width: 100%;
  padding-top: 10px;
}

.dialog-form {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  gap: 10px;
}

.dialog-form .item {
  width: 100%;
}
</style>
