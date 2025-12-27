<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
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
});
const detailInfo = ref({});
const detailType = ref("");
const detailId = ref("");
const roleList = ref([]);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getRoleList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});
const getRoleList = () => {
  request
    .get({
      url: "/system/role/getAllList",
    })
    .then((res) => {
      if (res.code === 200 && res.data) {
        roleList.value = res.data.map((item) => {
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
const getDetailInfo = () => {
  request
    .get({
      url: "/system/user/getDetail",
      data: {
        id: detailId.value,
      },
    })
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
          label="姓名"
          :showText="detailType === 'view'"
          :text="detailInfo.name"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入姓名" />
        </p-item>
        <p-item
          class="dtItem"
          label="头像"
          :showText="detailType === 'view'"
          :text="detailInfo.avatar"
        >
          <el-input v-model="detailInfo.avatar" placeholder="请输入头像地址" />
        </p-item>
        <p-item
          class="dtItem"
          label="账号"
          :showText="detailType === 'view'"
          :text="detailInfo.username"
        >
          <el-input
            v-model="detailInfo.username"
            placeholder="请输入账号"
            :disabled="detailInfo.id == '1'"
          />
        </p-item>
        <p-item class="dtItem" v-show="detailType == 'add'" label="密码">
          <el-input v-model="detailInfo.password" placeholder="请输入密码" />
        </p-item>
        <p-item
          class="dtItem"
          label="角色"
          :showText="detailType === 'view'"
          :text="
            roleList.find((item) => item.value == detailInfo.role)?.label ||
            detailInfo.role
          "
        >
          <el-select
            v-model="detailInfo.role"
            placeholder="请选择角色"
            :disabled="detailInfo.id == '1'"
          >
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
