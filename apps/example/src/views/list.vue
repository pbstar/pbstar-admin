<template>
  <div class="page">
    <p-title :list="['用户列表']">
      <el-button
        type="primary"
        size="small"
        text
        style="margin-bottom: -8px"
        @click="showSearch = !showSearch"
      >
        {{ showSearch ? "收起" : "查询" }}
      </el-button>
    </p-title>
    <p-search
      v-show="showSearch"
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
      :export="toExport"
      @paginationChange="toPageChange"
      @topBtnClick="toTopBtnClick"
      @rightBtnClick="toRightBtnClick"
    >
      <template #age="scope">
        <span v-show="scope.row.age < 25">{{ scope.row.age }}</span>
        <span v-show="scope.row.age >= 25">{{ scope.row.age }}（老年人）</span>
      </template>
    </p-table>
    <p-dialog
      title="用户列表详情页"
      type="page"
      v-model="isDetail"
      :botBtn="[
        { label: '保存', key: 'save' },
        { label: '返回', key: 'back' },
      ]"
      @botBtnClick="toBotBtnClick"
    >
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
    </p-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import Detail from "./components/list/detail.vue";
const data = ref([]);
const column = ref([
  { key: "name", label: "姓名" },
  { key: "age", label: "年龄", slot: "age" },
  { key: "sex", label: "性别" },
  { key: "ethnic", label: "民族", enumKey: "p_ethnic" },
  { key: "isHealthy", label: "是否健康", enumKey: "p_boolean" },
]);
const topBtn = ref([{ key: "add", label: "新增" }]);
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
const showSearch = ref(true);
const searchData = ref([
  { key: "name", label: "姓名", type: "input" },
  { key: "age", label: "年龄", type: "inputNumber" },
  { key: "sex", label: "性别", type: "select", options: [] },
  {
    key: "isHealthy",
    label: "是否健康",
    type: "select",
    enumKey: "p_boolean",
  },
]);
const searchValue = ref({});
const isDetail = ref(false);
const detailType = ref("");
const detailId = ref("");
const detailRef = ref(null);

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
    detailType.value = "add";
    detailId.value = "";
    isDetail.value = true;
  }
};
const toRightBtnClick = ({ btn, row }) => {
  if (btn == "view" || btn == "edit") {
    detailType.value = btn;
    detailId.value = row.id;
    isDetail.value = true;
  } else if (btn == "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    }).then(() => {
      request
        .post({
          base: "base",
          url: "/example/test/delete",
          data: {
            idList: [row.id],
          },
        })
        .then((res) => {
          if (res && res.code == 200) {
            ElMessage.success("删除成功");
            initTable();
          } else {
            ElMessage.error(res.msg || "操作异常");
          }
        });
    });
  } else if (btn == "other") {
    ElMessage.success("其他");
  }
};
const toBotBtnClick = ({ btn }) => {
  if (btn == "save") {
    const detailInfo = detailRef.value.getFormValue();
    const url =
      detailType.value == "add"
        ? "/example/test/create"
        : "/example/test/update";
    request
      .post({
        base: "base",
        url,
        data: detailInfo,
      })
      .then((res) => {
        if (res && res.code == 200) {
          ElMessage.success("保存成功");
          isDetail.value = false;
          initTable();
        } else {
          ElMessage.error(res.msg || "操作异常");
        }
      });
  } else if (btn == "back") {
    isDetail.value = false;
  }
};
const toExport = (callBack) => {
  request
    .post({
      base: "base",
      url: "/example/test/getList",
      data: {
        pageNumber: 1,
        pageSize: 10000,
        ...searchValue.value,
      },
    })
    .then((res) => {
      if (res && res.code == 200) {
        callBack({
          fileName: "用户列表",
          data: res.data.list,
        });
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
</script>
<style lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
}
</style>
