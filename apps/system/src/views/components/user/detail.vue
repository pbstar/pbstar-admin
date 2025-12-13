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
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '姓名',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '头像',
          }"
          v-model="detailInfo.avatar"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '账号',
            isDisabled: detailInfo.id == '1',
          }"
          v-model="detailInfo.username"
        />
        <p-item
          class="dtItem"
          v-show="detailType == 'add'"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '密码',
          }"
          v-model="detailInfo.password"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'select',
            label: '角色',
            options: roleList,
            isDisabled: detailInfo.id == '1',
          }"
          v-model="detailInfo.role"
        />
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
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
