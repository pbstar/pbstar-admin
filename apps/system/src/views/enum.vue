<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PTable, PSearch, PTitle, PDialog, PButton } from "@Pcomponents";
import Detail from "./components/enum/detail.vue";

const searchData = ref([
  { label: "枚举名称", key: "name", type: "input" },
  { label: "枚举key", key: "key", type: "input" },
]);
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
      url: "/system/enum/getList",
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
    isDetail.value = true;
  } else if (btn === "delete") {
    ElMessageBox.confirm("确认删除吗?", "提示", {
      type: "warning",
    })
      .then(() => {
        request
          .post({
            url: "/system/enum/delete",
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
const tableTopBtnClick = () => {
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const diaBotBtnClick = (btn) => {
  if (btn === "save") {
    const detailInfo = detailRef.value.getFormValue();
    const url =
      detailType.value == "add" ? "/system/enum/create" : "/system/enum/update";
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
    <p-title :list="['枚举管理']"></p-title>

    <p-search
      style="margin-top: 10px"
      :data="searchData"
      @btnClick="toSearch"
    ></p-search>

    <p-table
      style="margin-top: 10px"
      :data="tableData"
      :pagination="pagination"
      @paginationChange="tablePaginationChange"
    >
      <template #column>
        <el-table-column prop="name" label="枚举名称" />
        <el-table-column prop="key" label="枚举key" />
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="{ row }">
            <p-button
              type="primary"
              size="small"
              link
              @click="tableRightBtnClick({ row, btn: 'view' })"
            >
              查看
            </p-button>
            <p-button
              type="primary"
              size="small"
              link
              @click="tableRightBtnClick({ row, btn: 'edit' })"
            >
              编辑
            </p-button>
            <p-button
              type="danger"
              size="small"
              link
              @click="tableRightBtnClick({ row, btn: 'delete' })"
            >
              删除
            </p-button>
          </template>
        </el-table-column>
      </template>
      <template #topLeft>
        <p-button type="primary" @click="tableTopBtnClick"> 新增 </p-button>
      </template>
    </p-table>

    <p-dialog
      title="枚举管理详情页"
      type="drawer"
      width="600"
      v-model="isDetail"
    >
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <p-button
          type="primary"
          v-if="detailType !== 'view'"
          @click="diaBotBtnClick('save')"
        >
          保存
        </p-button>
        <p-button @click="diaBotBtnClick('back')"> 返回 </p-button>
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
