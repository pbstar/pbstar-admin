<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import {
  pTable,
  pSearch,
  pTitle,
  pDialog,
  pIcon,
  pItem,
} from "@Pcomponents";
import Detail from "./components/detail.vue";
import { structure } from "@Passets/utils/array";

const searchValue = ref<Record<string, any>>({});
const tableData = ref<any[]>([]);

const detailType = ref("");
const detailId = ref<string | number>("");
const isDetail = ref(false);
const detailRef = ref<InstanceType<typeof Detail> | null>(null);

onBeforeMount(() => {
  initTable();
});

const toSearch = () => {
  initTable();
};
const toReset = () => {
  searchValue.value = {};
  toSearch();
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
};
const handleAdd = () => {
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const handleSave = () => {
  const detailInfo = detailRef.value?.getFormValue();
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
};
const handleBack = () => {
  isDetail.value = false;
};
</script>

<template>
  <div class="page">
    <p-title :list="['应用管理']"></p-title>

    <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
      <p-item class="item" label="应用名称">
        <el-input v-model="searchValue.name" placeholder="请输入应用名称" />
      </p-item>
      <p-item class="item" label="应用分组">
        <el-input v-model="searchValue.group" placeholder="请输入应用分组" />
      </p-item>
      <p-item class="item" label="应用Key">
        <el-input v-model="searchValue.key" placeholder="请输入应用Key" />
      </p-item>
    </p-search>

    <p-table style="margin-top: 10px" :data="tableData">
      <template #column>
        <el-table-column prop="name" label="应用名称" />
        <el-table-column prop="group" label="应用分组" />
        <el-table-column prop="key" label="应用Key" />
        <el-table-column prop="icon" label="应用图标">
          <template #default="{ row }">
            <div v-if="row.icon" style="display: flex; align-items: center">
              <p-icon
                style="margin-right: 5px; font-size: 16px"
                :name="row.icon"
              />
              <span>{{ row.icon }}</span>
            </div>
          </template>
        </el-table-column>
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

    <p-dialog title="应用管理详情页" type="drawer" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <el-button type="primary" @click="handleSave()"> 保存 </el-button>
        <el-button @click="handleBack()">返回</el-button>
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
