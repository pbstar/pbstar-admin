<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { getPermissionList } from "@/api/permission";
import type { PermissionItem } from "@/api/permission";
import { getRoleDetail } from "@/api/role";
import type { RolePayload } from "@/api/role";
import { pCollapse, pItem } from "@Pcomponents";
import appGroups from "@Passets/constants/apps";

/** 应用列表已改为按分组维护的二级数组，这里展平供权限树逐个应用挂靠 */
const apps = appGroups.flatMap((group) => group.apps);

/** 权限树节点（tree-select 数据，value 为权限 key） */
interface PermissionTreeNode {
  label: string;
  value: string;
  disabled?: boolean;
  children?: PermissionTreeNode[];
}

/** 角色表单：permissions 在表单内为勾选的 key 数组，保存时 join 成逗号字符串 */
interface RoleForm {
  id: number;
  name: string;
  key: string;
  permissions: string[];
}

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: Number,
    default: 0,
  },
});
const detailInfo = ref<RoleForm>({ id: 0, name: "", key: "", permissions: [] });
const detailType = ref("");
const detailId = ref<number>(0);
const permissionTree = ref<PermissionTreeNode[]>([]);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getPermissionTree();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

/** 组装 tree-select 数据：应用（虚拟根）-> 分组 -> 菜单/按钮叶子（可勾选，value 为其 key） */
const getPermissionTree = () => {
  getPermissionList().then((permissionRes) => {
    if (permissionRes.code !== 200) {
      ElMessage.error(permissionRes.msg || "获取权限数据失败");
      return;
    }
    const permissions = permissionRes.data;
    permissionTree.value = apps.map<PermissionTreeNode>((app) => {
      const appPermissions = permissions.filter((item: PermissionItem) => item.appKey === app.appKey);
      const groups = appPermissions.filter((item: PermissionItem) => item.type === "group");
      return {
        label: app.name,
        value: `__app_${app.appKey}`,
        disabled: true,
        children: groups.map<PermissionTreeNode>((group) => ({
          label: group.name,
          value: `__group_${group.id}`,
          disabled: true,
          children: appPermissions
            .filter((item: PermissionItem) => item.groupId === group.id)
            .map((item: PermissionItem) => ({ label: item.name, value: item.key })),
        })),
      };
    });
  });
};

const getDetailInfo = () => {
  getRoleDetail({ id: detailId.value })
    .then((res) => {
      if (res && res.code == 200) {
        detailInfo.value = {
          ...res.data,
          permissions: res.data.permissions ? res.data.permissions.split(",") : [],
        };
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const getFormValue = (): RolePayload => {
  const permissions = detailInfo.value.permissions
    // 防御性过滤虚拟应用/分组节点（disabled 节点正常不会进入勾选值）
    .filter((v: string) => !v.startsWith("__app_") && !v.startsWith("__group_"))
    .join(",");
  return { ...detailInfo.value, permissions };
};

defineExpose({
  getFormValue,
});
</script>

<template>
  <div class="detail">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <div class="items">
        <p-item
          class="dtItem"
          label="角色名称"
          :showText="detailType === 'view'"
          :text="detailInfo.name"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入角色名称" />
        </p-item>
        <p-item
          class="dtItem"
          label="角色Key"
          :showText="detailType === 'view'"
          :text="detailInfo.key"
        >
          <el-input
            v-model="detailInfo.key"
            placeholder="请输入角色Key"
            :disabled="detailInfo.id === 1"
          />
        </p-item>
        <p-item
          class="dtItem"
          label="权限"
          :showText="detailType === 'view'"
          :text="detailInfo.permissions.join(',')"
        >
          <el-tree-select
            v-model="detailInfo.permissions"
            :data="permissionTree"
            show-checkbox
            multiple
            :check-strictly="false"
            placeholder="请选择权限"
            :disabled="detailInfo.id === 1"
          />
        </p-item>
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  .items {
    display: flex;
    flex-direction: column;

    .dtItem {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
