<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { pTable, pSearch, pTitle, pDialog, pButton, pItem } from "@Pcomponents";
import Detail from "./components/log/detail.vue";

const searchValue = ref({});
const tableData = ref([]);

const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const detailType = ref("");
const detailId = ref("");
const isDetail = ref(false);
const detailRef = ref(null);

onBeforeMount(() => {
  initTable();
});

const toSearch = () => {
  pagination.value.pageNumber = 1;
  initTable();
};
const toReset = () => {
  searchValue.value = {};
  toSearch();
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
const handleView = (row) => {
  detailType.value = "view";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleDelete = (row) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      request
        .post({
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
};
const handleAdd = () => {
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const handleSave = () => {
  const detailInfo = detailRef.value.getFormValue();
  const url =
    detailType.value == "add" ? "/system/log/create" : "/system/log/update";
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
};
const handleBack = () => {
  isDetail.value = false;
};
</script>

<template>
  <div class="page">
    <p-title :list="['操作日志']"></p-title>

    <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
      <p-item
        class="item"
        :config="{ label: '用户名', type: 'input' }"
        v-model="searchValue.userName"
      />
      <p-item
        class="item"
        :config="{
          label: '操作时间',
          type: 'dateRange',
        }"
        v-model="searchValue.createTime"
      />
    </p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
    >
      <template #column>
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="method" label="请求方法" width="100" />
        <el-table-column prop="path" label="请求路径" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="createTime" label="操作时间" />
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="160"
        >
          <template #default="{ row }">
            <p-button type="primary" size="small" link @click="handleView(row)">
              查看
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
      <template #topLeft>
        <p-button type="primary" @click="handleAdd()"> 新增 </p-button>
      </template>
    </p-table>

    <p-dialog title="操作日志详情页" type="drawer" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <p-button
          type="primary"
          v-if="detailType !== 'view'"
          @click="handleSave()"
        >
          保存
        </p-button>
        <p-button @click="handleBack()"> 返回 </p-button>
      </template>
    </p-dialog>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);

  .item {
    width: 250px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
