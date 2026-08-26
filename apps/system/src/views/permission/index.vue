<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPermissionList, deletePermissions, createPermission, updatePermission } from "@/api/permission";
import {
  pTable,
  pSearch,
  pTitle,
  pDialog,
  pItem,
} from "@Pcomponents";
import Detail from "./components/detail.vue";
import { structure } from "@Passets/utils/array";
import appGroups from "@Passets/constants/apps";

const typeOptions = [
  { label: "分组", value: "group" },
  { label: "菜单", value: "menu" },
  { label: "按钮", value: "button" },
];
const typeLabelMap: Record<string, string> = { group: "分组", menu: "菜单", button: "按钮" };
const typeTagMap: Record<string, string> = { group: "info", menu: "primary", button: "warning" };

const searchValue = ref<Record<string, any>>({});
const tableData = ref<any[]>([]);
const detailType = ref("");
const detailId = ref<number>(0);
const isDetail = ref(false);
const detailRef = ref<InstanceType<typeof Detail> | null>(null);
const currentNode = ref("");
const data = ref<any[]>([]);

onBeforeMount(() => {
  initTree();
});
const initTree = () => {
  // 应用列表已改为前端常量维护，按分组转换为树形数组
  data.value = appGroups.map((group) => ({
    label: group.group,
    value: `group_${group.group}`,
    type: "group",
    children: group.apps.map((app) => {
      if (!currentNode.value) {
        currentNode.value = app.appKey;
        initTable();
      }
      return {
        label: app.name,
        value: app.appKey,
        type: "app",
        ...app,
      };
    }),
  }));
};
const toSearch = () => {
  initTable();
};
const toReset = () => {
  searchValue.value = {};
  toSearch();
};
const initTable = () => {
  const params: Record<string, any> = {
    ...searchValue.value,
  };
  if (currentNode.value && !currentNode.value.startsWith("group")) {
    params.appKey = currentNode.value;
  }
  tableData.value = [];
  getPermissionList(params)
    .then((res) => {
      if (res && res.code === 200) {
        tableData.value = structure(res.data as any, "groupId");
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
      deletePermissions([row.id])
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
  if (!currentNode.value || currentNode.value?.startsWith("group")) {
    ElMessage.error("请先选择应用");
    return;
  }
  detailType.value = "add";
  detailId.value = 0;
  isDetail.value = true;
};
const handleSave = () => {
  const detailInfo = detailRef.value?.getFormValue();
  if (!detailInfo) return;
  const save = detailType.value == "add" ? createPermission : updatePermission;
  save(detailInfo).then((res) => {
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
const handleNodeClick = (data: any) => {
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
    <p-title :list="['权限管理']"></p-title>

    <div class="content">
      <div class="plan1">
        <el-tree
          style="margin-top: 10px"
          :data="data"
          node-key="value"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
          :current-node-key="currentNode"
        />
      </div>
      <div class="plan2">
        <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
          <p-item class="item" label="名称">
            <el-input v-model="searchValue.name" placeholder="请输入名称" />
          </p-item>
          <p-item class="item" label="类型">
            <el-select v-model="searchValue.type" placeholder="请选择类型" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </p-item>
        </p-search>

        <p-table style="margin-top: 10px" :data="tableData" row-key="id">
          <template #column>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="type" label="类型" width="90">
              <template #default="{ row }">
                <el-tag :type="typeTagMap[row.type]">{{ typeLabelMap[row.type] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="key" label="权限Key" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column
              prop="operation"
              label="操作"
              fixed="right"
              width="200"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="handleView(row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="handleEdit(row)"
                >
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
      </div>
    </div>

    <p-dialog
      title="权限管理详情页"
      type="drawer"
      width="600px"
      v-model="isDetail"
    >
      <Detail
        ref="detailRef"
        :type="detailType"
        :id="detailId"
        :appKey="currentNode"
      ></Detail>
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
  min-height: 100%;
  padding: 0 10px 10px;
  background-color: var(--c-bg);
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    min-height: 0;
    display: flex;

    .plan1 {
      width: 200px;
    }
    .plan2 {
      flex: 1;
      padding-left: 10px;
    }
  }

  .item {
    width: 250px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
