<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PTable, PSearch, PTitle, PDialog, PIcon, PButton } from "@Pcomponents";
import Detail from "./components/app/detail.vue";
import { structure } from "@Passets/utils/array";

const searchData = ref([
  { label: "应用名称", key: "name", type: "input" },
  { label: "应用分组", key: "group", type: "input" },
  {
    label: "应用Key",
    key: "key",
    type: "input",
  },
]);
const searchValue = ref({});
const tableColumn = ref([
  { label: "应用名称", key: "name" },
  { label: "应用分组", key: "group" },
  { label: "应用Key", key: "key" },
  { label: "应用图标", key: "icon", slot: "icon" },
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
const diaBotBtnClick = (btn) => {
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
    <p-title :list="['应用管理']"></p-title>

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
      tableKey="app_1"
      showSetting
      @topBtnClick="tableTopBtnClick"
      @rightBtnClick="tableRightBtnClick"
    >
      <template #icon="scope">
        <div v-if="scope.row.icon" style="display: flex; align-items: center">
          <p-icon
            style="margin-right: 5px; font-size: 16px"
            :name="scope.row.icon"
          />
          <span>{{ scope.row.icon }}</span>
        </div>
      </template>
    </p-table>

    <p-dialog title="应用管理详情页" type="drawer" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <p-button type="primary" @click="diaBotBtnClick('save')">
          保存
        </p-button>
        <p-button @click="diaBotBtnClick('back')">返回</p-button>
      </template>
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
