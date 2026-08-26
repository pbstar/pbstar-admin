<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { getPermissionList, getPermissionDetail } from "@/api/permission";
import { pCollapse, pItem } from "@Pcomponents";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
  appKey: {
    type: String,
    default: "",
  },
});
const detailInfo = ref<Record<string, any>>({
  type: "menu",
  appKey: props.appKey,
});
const detailType = ref("");
const detailId = ref<string | number>("");
const groupList = ref<any[]>([]); // 同应用下的分组列表（供 menu/button 选择归属）

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getGroupList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getGroupList = () => {
  getPermissionList({ appKey: detailInfo.value.appKey, type: "group" })
    .then((res) => {
      if (res.code === 200) {
        groupList.value = res.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      } else {
        ElMessage.error(res.msg || "获取分组失败");
      }
    });
};

const getDetailInfo = () => {
  getPermissionDetail({ id: detailId.value })
    .then((res) => {
      if (res && res.code == 200) {
        detailInfo.value = res.data;
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const getFormValue = () => {
  return detailInfo.value;
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
          label="类型"
          :showText="detailType === 'view'"
          :text="({ group: '分组', menu: '菜单', button: '按钮' } as Record<string, string>)[detailInfo.type]"
        >
          <el-radio-group v-model="detailInfo.type" :disabled="detailType === 'edit'">
            <el-radio value="group">分组</el-radio>
            <el-radio value="menu">菜单</el-radio>
            <el-radio value="button">按钮</el-radio>
          </el-radio-group>
        </p-item>
        <p-item
          v-if="detailInfo.type !== 'group'"
          class="dtItem"
          label="所属分组"
          :showText="detailType === 'view'"
          :text="groupList.find((item) => item.value === detailInfo.groupId)?.label"
        >
          <el-select v-model="detailInfo.groupId" placeholder="请选择所属分组">
            <el-option
              v-for="item in groupList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="dtItem"
          label="名称"
          :showText="detailType === 'view'"
          :text="detailInfo.name"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入名称" />
        </p-item>
        <p-item
          v-if="detailInfo.type !== 'group'"
          class="dtItem"
          label="权限Key"
          :showText="detailType === 'view'"
          :text="detailInfo.key"
        >
          <el-input v-model="detailInfo.key" placeholder="请输入权限Key（如 system_user）" />
        </p-item>
        <p-item
          class="dtItem"
          label="备注"
          :showText="detailType === 'view'"
          :text="detailInfo.remark"
          isTextWrap
        >
          <el-input
            v-model="detailInfo.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
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
