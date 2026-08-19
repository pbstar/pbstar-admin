<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { pTable, pSearch, pTitle, pDialog, pItem } from "@Pcomponents";
import Detail from "./components/detail.vue";

const searchValue = ref<Record<string, any>>({});
const tableData = ref<any[]>([]);
const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const detailType = ref("");
const detailId = ref<string | number>("");
const isDetail = ref(false);
const detailRef = ref<InstanceType<typeof Detail> | null>(null);

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
const tablePaginationChange = ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
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
      url: "/system/role/getList",
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
const handleView = (row: any) => {
  detailType.value = "view";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleEdit = (row: any) => {
  detailType.value = "edit";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  })
    .then(() => {
      request
        .post({
          url: "/system/role/delete",
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
  const detailInfo = detailRef.value?.getFormValue();
  const url =
    detailType.value == "add" ? "/system/role/create" : "/system/role/update";
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
    <p-title :list="['角色管理']"></p-title>

    <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
      <p-item class="item" label="角色名称">
        <el-input v-model="searchValue.name" placeholder="请输入角色名称" />
      </p-item>
      <p-item class="item" label="角色Key">
        <el-input v-model="searchValue.key" placeholder="请输入角色Key" />
      </p-item>
    </p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
    >
      <template #column>
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="key" label="角色Key" />
        <el-table-column prop="permissions" label="权限" show-overflow-tooltip />
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.id != 1"
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
      <template #topLeft>
        <el-button type="primary" @click="handleAdd()"> 新增 </el-button>
      </template>
    </p-table>

    <p-dialog title="角色管理详情页" type="drawer" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <el-button type="primary" @click="handleSave()"> 保存 </el-button>
        <el-button @click="handleBack()"> 返回 </el-button>
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
