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
const navList = ref([]);
const btnList = ref([]);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getBtnList();
  getNavList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});
const getNavList = () => {
  request
    .post({
      url: "/system/nav/getList",
    })
    .then((res) => {
      if (res.code === 200) {
        navList.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id.toString(),
            parentId: item.parentId?.toString() || "",
          };
        });
      } else {
        ElMessage.error(res.msg || "获取菜单失败");
      }
    });
};

const getBtnList = () => {
  request
    .post({
      url: "/system/nav/getBtnList",
    })
    .then((res) => {
      if (res.code === 200) {
        btnList.value = res.data;
      } else {
        ElMessage.error(res.msg || "获取按钮失败");
      }
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
        if (detailInfo.value.navs) {
          detailInfo.value.navs = detailInfo.value.navs.split(",");
        }
        if (detailInfo.value.btns) {
          detailInfo.value.btns = detailInfo.value.btns.split(",");
        }
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const getFormValue = () => {
  const info = {
    ...detailInfo.value,
  };
  if (info.navs) {
    info.navs = info.navs.join(",");
  }
  if (info.btns) {
    info.btns = info.btns.join(",");
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
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '角色名称',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '角色Key',
            isDisabled: detailInfo.id == '1',
          }"
          v-model="detailInfo.key"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'selectTree',
            label: '菜单权限',
            options: navList,
            isDisabled: detailInfo.id == '1',
            more: {
              showCheckbox: true,
              multiple: true,
              checkStrictly: false,
            },
          }"
          v-model="detailInfo.navs"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'selectTree',
            label: '按钮权限',
            options: btnList,
            isDisabled: detailInfo.id == '1',
            more: {
              showCheckbox: true,
              multiple: true,
              checkStrictly: false,
            },
          }"
          v-model="detailInfo.btns"
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
