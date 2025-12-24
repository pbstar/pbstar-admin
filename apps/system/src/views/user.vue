<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { pTable, pSearch, pTitle, pDialog, pButton, pItem } from "@Pcomponents";
import Detail from "./components/user/detail.vue";

const searchValue = ref({});
const tableData = ref([]);
const roleOptions = ref([]);
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
onMounted(() => {
  getRoleList();
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
      url: "/system/user/getList",
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
const getRoleList = () => {
  request
    .get({
      url: "/system/role/getAllList",
    })
    .then((res) => {
      if (res.code === 200 && res.data) {
        roleOptions.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.role_key,
          };
        });
      } else {
        ElMessage.error(res.msg || "获取角色列表失败");
      }
    });
};

// 根据 role_key 获取角色名称
const getRoleLabel = (roleKey) => {
  const role = roleOptions.value.find((item) => item.value === roleKey);
  return role ? role.label : roleKey;
};
const handleView = (row) => {
  detailType.value = "view";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleEdit = (row) => {
  detailType.value = "edit";
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
          url: "/system/user/delete",
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
    detailType.value == "add" ? "/system/user/create" : "/system/user/update";
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
    <p-title :list="['用户管理']"></p-title>

    <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
      <p-item class="item" label="姓名">
        <el-input v-model="searchValue.name" placeholder="请输入姓名" />
      </p-item>
      <p-item class="item" label="账号">
        <el-input v-model="searchValue.username" placeholder="请输入账号" />
      </p-item>
      <p-item class="item" label="角色">
        <el-select v-model="searchValue.role" placeholder="请选择角色">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </p-item>
    </p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
    >
      <template #column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="avatar" label="头像">
          <template #default="{ row }">
            <div style="display: flex">
              <img
                style="width: 26px; height: 26px; border-radius: 50%"
                v-if="row.avatar"
                :src="row.avatar"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            {{ getRoleLabel(row.role) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="{ row }">
            <p-button type="primary" size="small" link @click="handleView(row)">
              查看
            </p-button>
            <p-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </p-button>
            <p-button
              v-if="row.id != 1"
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
        <p-button btnkey="user_add" type="primary" @click="handleAdd()">
          新增
        </p-button>
      </template>
    </p-table>

    <p-dialog title="用户管理详情页" type="drawer" v-model="isDetail">
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <p-button type="primary" @click="handleSave()"> 保存 </p-button>
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
