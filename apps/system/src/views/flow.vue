<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import Detail from "./components/flow/detail.vue";
import { structure } from "@Passets/utils/array";

const searchData = ref([
  { label: "流程名称", key: "name", type: "input" },
  { label: "流程Key", key: "key", type: "input" },
]);
const searchValue = ref({});
const tableColumn = ref([
  { label: "流程名称", key: "name" },
  { label: "流程Key", key: "key" },
  { label: "备注", key: "remark" },
]);
const tableData = ref([]);
const tableTopBtn = ref([{ key: "add", label: "新增" }]);
const tableRightBtn = ref([
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
]);
const detailType = ref("");
const detailId = ref("");
const isDetail = ref(false);
const detailRef = ref(null);

onBeforeMount(() => {
  initTable();
});

const toSearch = ({ data }) => {
  searchValue.value = data;
  initTable();
};
const initTable = () => {
  const params = {
    ...searchValue.value,
  };
  tableData.value = [];
  request
    .post({
      url: "/system/app/getList",
      data: params,
    })
    .then((res) => {
      if (res && res.code === 200) {
        tableData.value = structure(res.data);
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};
const tableRightBtnClick = ({ row, btn }) => {
  if (btn == "view" || btn == "edit") {
    detailType.value = btn;
    detailId.value = row.id;
    isDetail.value = true;
  } else if (btn === "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    })
      .then(() => {
        request
          .post({
            url: "/system/app/delete",
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
  if (btn == "add") {
    detailType.value = "add";
    detailId.value = "";
    isDetail.value = true;
  }
};
const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    const detailInfo = detailRef.value.getFormValue();
    const url =
      detailType.value == "add" ? "/system/app/create" : "/system/app/update";
    request
      .post({
        url,
        data: detailInfo,
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
</script>

<template>
  <div class="page">
    <p-title :list="['流程管理']"></p-title>

    <p-search
      style="margin-top: 10px"
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :column="tableColumn"
      :topBtn="tableTopBtn"
      :rightBtn="tableRightBtn"
      tableKey="flow_1"
      showSetting
      @topBtnClick="tableTopBtnClick"
      @rightBtnClick="tableRightBtnClick"
    >
    </p-table>

    <p-dialog
      title="流程管理详情页"
      type="page"
      v-model="isDetail"
      :botBtn="[
        { label: '流程图', key: 'flowChart' },
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="diaBotBtnClick"
    >
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
