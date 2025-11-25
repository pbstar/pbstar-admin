<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import {
  PTable,
  PSearch,
  PTitle,
  PDialog,
  PTwinBox,
  PIcon,
  PButton,
} from "@Pcomponents";
import Detail from "./components/nav/detail.vue";
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
  { label: "显示在导航", key: "isNav", slot: "isNav" },
  { label: "排序", key: "index" },
  { label: "备注", key: "remark" },
]);
const tableData = ref([]);
const detailType = ref("");
const detailId = ref("");
const isDetail = ref(false);
const detailRef = ref(null);
const currentNode = ref("");
const data = ref([]);

onBeforeMount(() => {
  initTree();
});
const initTree = () => {
  data.value = [];
  request
    .post({
      url: "/system/app/getList",
    })
    .then((res) => {
      if (res && res.code === 200) {
        // 按group分组，转换为树形数组
        const groupMap = {};
        res.data.forEach((item) => {
          if (!groupMap[item.group]) {
            groupMap[item.group] = {
              label: item.group,
              value: `group_${item.group}`,
              type: "group",
              children: [],
            };
          }
          if (!currentNode.value) {
            currentNode.value = item.id.toString();
            initTable();
          }
          groupMap[item.group].children.push({
            label: item.name,
            value: item.id.toString(),
            type: "app",
            ...item,
          });
        });
        data.value = Object.values(groupMap);
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};
const toSearch = ({ data }) => {
  searchValue.value = data;
  initTable();
};
const initTable = () => {
  const params = {
    ...searchValue.value,
  };
  if (currentNode.value && !currentNode.value.startsWith("group")) {
    params.appId = currentNode.value;
  }
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
const tableTopBtnClick = () => {
  if (!currentNode.value || currentNode.value?.startsWith("group")) {
    ElMessage.error("请先选择应用");
    return;
  }
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const diaBotBtnClick = (btn) => {
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

    <p-twinBox class="content">
      <template #plan1>
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
      <template #plan2>
        <p-search
          style="margin-top: 10px"
          :data="searchData"
          @btnClick="toSearch"
        ></p-search>

        <p-table
          style="margin-top: 10px"
          :data="tableData"
          :column="tableColumn"
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
          <template #isNav="scope">
            <span>{{ scope.row.isNav == 1 ? "是" : "否" }}</span>
          </template>
          <template #topLeft>
            <p-button type="primary" @click="tableTopBtnClick()">
              新增
            </p-button>
          </template>
          <template #operation="{ row }">
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
        </p-table>
      </template>
    </p-twinBox>

    <p-dialog
      title="菜单管理详情页"
      type="drawer"
      width="600px"
      v-model="isDetail"
    >
      <Detail
        ref="detailRef"
        :type="detailType"
        :id="detailId"
        :appId="currentNode"
      ></Detail>
      <template #footer>
        <p-button type="primary" @click="diaBotBtnClick('save')">
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
  min-height: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
  }
}
</style>
