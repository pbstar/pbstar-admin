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

const tableColumn = ref([
  { label: "枚举label", key: "label" },
  { label: "枚举value", key: "value" },
]);
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
const tableRightBtnClick = ({ row, btn }) => {
  if (btn === "edit") {
    request
      .get({
        url: "/system/enum/getEnumDetail",
        data: { id: row.id },
      })
      .then((res) => {
        if (res && res.code === 200 && res.data) {
          detailType.value = btn;
          detailInfo.value = res.data;
          isDetail.value = true;
        } else {
          ElMessage.error(res?.msg || "操作异常");
        }
      });
  } else if (btn === "delete") {
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
  }
};
const tableTopBtnClick = () => {
  detailType.value = "add";
  detailInfo.value = {
    enumId: props.id,
  };
  isDetail.value = true;
};
const diaBotBtnClick = (btn) => {
  if (btn === "save") {
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
  } else if (btn === "back") {
    isDetail.value = false;
  }
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
    <p-table :column="tableColumn" :data="tableData">
      <template #topLeft v-if="props.type !== 'add' && props.type !== 'view'">
        <p-button type="primary" @click="tableTopBtnClick"> 新增 </p-button>
      </template>
      <template v-if="props.type !== 'view'" #operation="{ row }">
        <p-button
          type="primary"
          size="small"
          link
          @click="tableRightBtnClick({ row, btn: 'edit' })"
        >
          编辑
        </p-button>
        <p-button
          type="danger"
          size="small"
          link
          @click="tableRightBtnClick({ row, btn: 'delete' })"
        >
          删除
        </p-button>
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
        <p-button type="primary" @click="diaBotBtnClick('save')">
          保存
        </p-button>
        <p-button @click="diaBotBtnClick('back')"> 返回 </p-button>
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
