<script setup>
import { ref, onBeforeMount, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";

import PForm from "@Pcomponents/base/p-form/index.vue";

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
  if (props.type == "add") {
    tableTopBtn.value = [];
    tableRightBtn.value = [
      { label: "编辑", key: "edit" },
      { label: "删除", key: "delete" },
    ];
  } else if (props.type == "view") {
    tableTopBtn.value = [];
    tableRightBtn.value = [];
    initTable();
  } else {
    tableTopBtn.value = [{ label: "新增", key: "add" }];
    tableRightBtn.value = [
      { label: "编辑", key: "edit" },
      { label: "删除", key: "delete" },
    ];
    initTable();
  }
});

const tableColumn = ref([
  { label: "枚举label", key: "label" },
  { label: "枚举value", key: "value" },
]);
const tableData = ref([]);
const tableRightBtn = ref([]);
const tableTopBtn = ref([]);
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
      base: "base",
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
        base: "base",
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
            base: "base",
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
const tableTopBtnClick = ({ btn }) => {
  if (btn === "add") {
    detailType.value = "add";
    detailInfo.value = {
      enumId: props.id,
    };
    isDetail.value = true;
  }
};
const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    const url =
      detailType.value == "add"
        ? "/system/enum/createEnum"
        : "/system/enum/updateEnum";
    request
      .post({
        base: "base",
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
    <p-table
      :column="tableColumn"
      :data="tableData"
      :rightBtn="tableRightBtn"
      :topBtn="tableTopBtn"
      @rightBtnClick="tableRightBtnClick"
      @topBtnClick="tableTopBtnClick"
    />

    <p-dialog
      type="box"
      title="枚举值详情页"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
      <div style="padding: 10px 0">
        <p-form
          :data="formData"
          :spanList="[12, 12]"
          v-model="detailInfo"
        ></p-form>
      </div>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.childBox {
  width: 100%;
  padding-top: 10px;
}
</style>
