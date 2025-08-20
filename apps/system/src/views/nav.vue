<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PTable from "@Pcomponents/base/p-table/index.vue";
import PSearch from "@Pcomponents/base/p-search/index.vue";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PDialog from "@Pcomponents/base/p-dialog/index.vue";
import PLeftRight from "@Pcomponents/layout/p-leftRight/index.vue";
import Detail from "./components/nav/detail.vue";
import PIcon from "@Pcomponents/base/p-icon/index.vue";
import { structure } from "@Passets/utils/array";

const searchData = ref([
  { label: "菜单名称", key: "name", type: "input" },
  { label: "菜单链接", key: "url", type: "input" },
]);
const searchValue = ref({});
const tableColumn = ref([
  { label: "菜单名称", key: "name" },
  { label: "菜单链接", key: "url" },
  { label: "菜单图标", key: "icon", slot: "icon" },
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
const currentNode = ref("");
const data = ref([]);

onBeforeMount(() => {
  initTree();
  initTable();
});
const initTree = () => {
  data.value = [
    {
      value: 1,
      label: "应用中心",
      type: "group",
      children: [
        {
          value: 2,
          label: "系统应用",
          type: "app",
        },
        {
          value: 3,
          label: "示例应用",
          type: "app",
        },
      ],
    },
  ];
  currentNode.value = 2;
};
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
      url: "/system/nav/getList",
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
            url: "/system/nav/delete",
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
      detailType.value == "add" ? "/system/nav/create" : "/system/nav/update";
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
const handleNodeClick = (data) => {
  currentNode.value = data.value;
  if (data.type == "app") {
    initTable();
  } else {
    tableData.value = [];
  }
};
</script>

<template>
  <div class="page">
    <p-title :list="['菜单管理']"></p-title>

    <p-left-right class="content">
      <template #left>
        <el-tree
          style="margin-top: 10px"
          :data="data"
          node-key="value"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
          :current-node-key="currentNode"
        />
      </template>
      <template #right>
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
          tableKey="nav_1"
          showSetting
          @topBtnClick="tableTopBtnClick"
          @rightBtnClick="tableRightBtnClick"
        >
          <template #icon="scope">
            <div
              v-if="scope.row.icon"
              style="display: flex; align-items: center"
            >
              <p-icon
                style="margin-right: 5px; font-size: 16px"
                :name="scope.row.icon"
              />
              <span>{{ scope.row.icon }}</span>
            </div>
          </template>
        </p-table>
      </template>
    </p-left-right>

    <p-dialog
      title="菜单管理详情页"
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
  height: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
  }
}
</style>
