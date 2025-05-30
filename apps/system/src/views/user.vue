<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import Detail from "./components/user/detail.vue";

const searchData = ref([
  { label: "姓名", key: "name", type: "input" },
  { label: "账号", key: "username", type: "input" },
  { label: "角色", key: "role", type: "select" },
]);
const showSearch = ref(true);
const searchValue = ref({});
const tableColumn = ref([
  { label: "姓名", key: "name" },
  { label: "头像", key: "avatar", slot: "avatar" },
  { label: "账号", key: "username" },
  //   { label: "密码", key: "password" },
  { label: "角色", key: "role" },
]);
const tableRef = ref(null);
const tableData = ref([]);
const tableTopBtn = ref([{ key: "add", label: "新增" }]);
const tableRightBtn = ref([
  { key: "view", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "delete", label: "删除", show: (row) => row.id != 1 },
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

onBeforeMount(() => {
  initTable();
});
onMounted(() => {
  getRoleList();
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
    .post({
      base: "base",
      url: "/system/role/getList",
      data: {
        pageNumber: 1,
        pageSize: 1000,
      },
    })
    .then((res) => {
      if (res.code === 200 && res.data) {
        tableRef.value.toChangeColumn([
          {
            key: "role",
            options: res.data.list.map((item) => {
              return {
                label: item.name,
                value: item.key,
              };
            }),
          },
        ]);
      } else {
        ElMessage.error(res.msg || "获取角色列表失败");
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
            base: "base",
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
      detailType.value == "add" ? "/system/user/create" : "/system/user/update";
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
    <p-title :list="['用户管理']">
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
      tableKey="user_1"
      showSetting
      ref="tableRef"
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
      @topBtnClick="tableTopBtnClick"
      @rightBtnClick="tableRightBtnClick"
    >
      <template #avatar="{ row }">
        <div style="display: flex">
          <img
            style="width: 26px; height: 26px; border-radius: 50%"
            v-if="row.avatar"
            :src="row.avatar"
            alt=""
          />
        </div>
      </template>
    </p-table>

    <p-dialog
      title="用户管理详情页"
      type="drawer"
      v-model="isDetail"
      :botBtn="[
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
