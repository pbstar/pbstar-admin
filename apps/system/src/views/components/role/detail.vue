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
          label="角色名称"
          :text="detailType === 'view' ? detailInfo.name : ''"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入角色名称" />
        </p-item>
        <p-item
          class="dtItem"
          label="角色Key"
          :text="detailType === 'view' ? detailInfo.key : ''"
        >
          <el-input
            v-model="detailInfo.key"
            placeholder="请输入角色Key"
            :disabled="detailInfo.id == '1'"
          />
        </p-item>
        <p-item
          class="dtItem"
          label="菜单权限"
          :text="detailType === 'view' ? detailInfo.navs : ''"
        >
          <el-tree-select
            v-model="detailInfo.navs"
            :data="navList"
            :props="{ value: 'value', label: 'label', children: 'children' }"
            show-checkbox
            multiple
            :check-strictly="false"
            placeholder="请选择菜单权限"
            :disabled="detailInfo.id == '1'"
          />
        </p-item>
        <p-item
          class="dtItem"
          label="按钮权限"
          :text="detailType === 'view' ? detailInfo.btns : ''"
        >
          <el-tree-select
            v-model="detailInfo.btns"
            :data="btnList"
            show-checkbox
            multiple
            :check-strictly="false"
            placeholder="请选择按钮权限"
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
