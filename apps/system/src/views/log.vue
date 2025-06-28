<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import Detail from "./components/log/detail.vue";

const searchData = ref([
  { label: "用户名", key: "userName", type: "input" },
  {
    label: "操作时间",
    key: "createTime",
    type: "daterange",
  },
]);
const showSearch = ref(true);
const searchValue = ref({});
const tableColumn = ref([
  { label: "用户名", key: "userName" },
  { label: "请求方法", key: "method", width: 100 },
  { label: "请求路径", key: "path" },
  { label: "IP地址", key: "ip" },
  { label: "操作时间", key: "createTime" },
]);
const tableData = ref([]);
const tableTopBtn = ref([{ key: "add", label: "新增" }]);
const tableRightBtn = ref([
  { key: "view", label: "查看" },
  { key: "delete", label: "删除" },
]);
const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const detailType = ref("");
const detailId = ref("");
const isDetail = ref(false);
const detailRef = ref(null);
const detailBotBtn = ref([{ key: "back", label: "返回" }]);

onBeforeMount(() => {
  initTable();
});

const toSearch = ({ data }) => {
  searchValue.value = data;
  initTable();
};
const tablePaginationChange = ({ pageNumber, pageSize }) => {
  pagination.value.pageNumber = pageNumber;
  pagination.value.pageSize = pageSize;
  initTable();
};
const initTable = () => {
  const params = {
    pageNumber: pagination.value.pageNumber,
    pageSize: pagination.value.pageSize,
    ...searchValue.value,
  };
  tableData.value = [];
  request
    .post({
      base: "base",
      url: "/system/log/getList",
      data: params,
    })
    .then((res) => {
      if (res && res.code === 200) {
        tableData.value = res.data.list;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};
const tableRightBtnClick = ({ row, btn }) => {
  if (btn == "view" || btn == "edit") {
    detailType.value = btn;
    detailId.value = row.id;
    if (btn == "view") {
      detailBotBtn.value = [{ key: "back", label: "返回" }];
    } else {
      detailBotBtn.value = [
        { key: "back", label: "返回" },
        { key: "save", label: "保存" },
      ];
    }
    isDetail.value = true;
  } else if (btn === "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    })
      .then(() => {
        request
          .post({
            base: "base",
            url: "/system/log/delete",
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
    detailBotBtn.value = [
      { key: "back", label: "返回" },
      { key: "save", label: "保存" },
    ];
    isDetail.value = true;
  }
};
const diaBotBtnClick = ({ btn }) => {
  if (btn === "save") {
    const detailInfo = detailRef.value.getFormValue();
    const url =
      detailType.value == "add" ? "/system/log/create" : "/system/log/update";
    request
      .post({
        base: "base",
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
    <p-title :list="['操作日志']">
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
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :column="tableColumn"
      :topBtn="tableTopBtn"
      :rightBtn="tableRightBtn"
      tableKey="log_1"
      showSetting
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
      @topBtnClick="tableTopBtnClick"
      @rightBtnClick="tableRightBtnClick"
    ></p-table>

    <p-dialog
      title="操作日志详情页"
      type="drawer"
      v-model="isDetail"
      :botBtn="detailBotBtn"
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
