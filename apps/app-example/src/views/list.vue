<template>
  <div class="page">
    <p-title :list="['测试表格']"></p-title>
    <p-search
      style="margin-top: 10px"
      ref="searchRef"
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>
    <p-table
      style="margin-top: 10px"
      ref="tableRef"
      :data="data"
      :column="column"
      :topBtn="topBtn"
      :rightBtn="rightBtn"
      tableKey="table1"
      showSetting
      :pagination="pagination"
      @paginationChange="toPageChange"
      @topBtnClick="toTopBtnClick"
      @rightBtnClick="toRightBtnClick"
    ></p-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import pTitle from "@Pcomponents/base/p-title/index.vue";
const data = ref([]);
const column = ref([
  { key: "name", label: "姓名" },
  { key: "age", label: "年龄" },
  { key: "sex", label: "性别" },
  { key: "ethnic", label: "民族", enumType: "p_ethnic" },
  { key: "isHealthy", label: "是否健康", enumType: "p_boolean" },
]);
const topBtn = ref([
  { key: "add", label: "新增" },
  { key: "export", label: "导出" },
]);
const rightBtn = ref([
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除" },
  { key: "other", label: "其他" },
]);
const tableRef = ref(null);
const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const searchRef = ref(null);
const searchData = ref([
  { key: "name", label: "姓名", type: "input" },
  { key: "age", label: "年龄", type: "inputNumber" },
  { key: "sex", label: "性别", type: "select", options: [] },
]);
const searchValue = ref({});

onMounted(() => {
  tableRef.value.toChangeColumnOptions({
    key: "sex",
    options: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  });
  searchRef.value.toChangeDataOptions({
    key: "sex",
    options: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  });
  initTable();
});
const toSearch = ({ data }) => {
  searchValue.value = data;
  initTable();
};
const toPageChange = ({ pageNumber, pageSize }) => {
  pagination.value.pageNumber = pageNumber;
  pagination.value.pageSize = pageSize;
  initTable();
};
const initTable = () => {
  request
    .post({
      base: "base",
      url: "/example/test/getList",
      data: { ...searchValue.value, ...pagination.value },
    })
    .then((res) => {
      if (res && res.code == 200) {
        data.value = res.data.list;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const toTopBtnClick = ({ btn }) => {
  if (btn == "add") {
    ElMessage.success("新增");
  } else if (btn == "export") {
    ElMessage.success("导出");
  }
};
const toRightBtnClick = ({ btn, row }) => {
  if (btn == "view") {
    ElMessage.success("查看");
  } else if (btn == "edit") {
    ElMessage.success("编辑");
  } else if (btn == "delete") {
    ElMessage.success("删除");
  } else if (btn == "other") {
    ElMessage.success("其他");
  }
};
</script>
<style lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
