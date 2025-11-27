<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PTable, PDialog, PForm, PButton } from "@Pcomponents";

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
const formData = ref([
  { label: "枚举label", type: "input", key: "label" },
  { label: "枚举value", type: "input", key: "value" },
]);

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
      <template #topLeft v-if="props.type !== 'add' && props.type !== 'view'">
        <p-button type="primary" @click="handleAdd"> 新增 </p-button>
      </template>
    </p-table>
    <p-dialog type="box" title="枚举值详情页" v-model="isDetail">
      <div style="padding: 10px 0">
        <p-form
          :data="formData"
          :spanList="[12, 12]"
          v-model="detailInfo"
        ></p-form>
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
  padding-top: 10px;
}
</style>
