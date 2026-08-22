<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem } from "@Pcomponents";
import appGroups from "@Passets/constants/apps";

/** 应用列表已改为按分组维护的二级数组，这里展平供权限树逐个应用挂靠 */
const apps = appGroups.flatMap((group) => group.apps);

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
});
const detailInfo = ref<Record<string, any>>({});
const detailType = ref("");
const detailId = ref<string | number>("");
const permissionTree = ref<any[]>([]);

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
  request.post({ url: "/system/permission/getList" }).then((permissionRes) => {
    if (permissionRes.code !== 200) {
      ElMessage.error(permissionRes.msg || "获取权限数据失败");
      return;
    }
    const permissions = permissionRes.data;
    permissionTree.value = apps.map((app) => {
      const appPermissions = permissions.filter((item: any) => item.appKey === app.appKey);
      const groups = appPermissions.filter((item: any) => item.type === "group");
      return {
        label: app.name,
        value: app.appKey,
        disabled: true,
        children: groups.map((group: any) => ({
          label: group.name,
          value: `__group_${group.id}`,
          disabled: true,
          children: appPermissions
            .filter((item: any) => item.groupId === group.id)
            .map((item: any) => ({ label: item.name, value: item.key })),
        })),
      };
    });
  });
};

const getDetailInfo = () => {
  request
    .get({
      url: "/system/role/getDetail",
      data: {
        id: detailId.value,
      },
    })
    .then((res) => {
      if (res && res.code == 200) {
        detailInfo.value = res.data;
        if (detailInfo.value.permissions) {
          detailInfo.value.permissions = detailInfo.value.permissions.split(",");
        }
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const getFormValue = () => {
  const info = { ...detailInfo.value };
  if (Array.isArray(info.permissions)) {
    // 防御性过滤虚拟应用/分组节点（disabled 节点正常不会进入勾选值）
    info.permissions = info.permissions
      .filter((v: string) => !v.startsWith("__app_") && !v.startsWith("__group_"))
      .join(",");
  }
  return info;
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
            :disabled="detailInfo.id == '1'"
          />
        </p-item>
        <p-item
          class="dtItem"
          label="权限"
          :showText="detailType === 'view'"
          :text="detailInfo.permissions"
        >
          <el-tree-select
            v-model="detailInfo.permissions"
            :data="permissionTree"
            show-checkbox
            multiple
            :check-strictly="false"
            placeholder="请选择权限"
            :disabled="detailInfo.id == '1'"
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
