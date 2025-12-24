<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem, pIconSelect } from "@Pcomponents";
import btnTable from "./btnTable.vue";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    default: "",
  },
  appId: {
    type: [String, Number],
    default: "",
  },
});
const detailInfo = ref({
  isNav: 1,
  appId: Number(props.appId),
});
const detailType = ref("");
const detailId = ref("");
const appList = ref([]); // 应用列表
const navList = ref([]); // 菜单树结构

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getAppList();
  getNavList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getAppList = () => {
  request
    .post({
      url: "/system/app/getList",
    })
    .then((res) => {
      if (res && res.code === 200) {
        appList.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
      } else {
        ElMessage.error(res.msg || "获取应用失败");
      }
    });
};
const getNavList = () => {
  request
    .post({
      url: "/system/nav/getList",
      data: {
        appId: detailInfo.value.appId,
      },
    })
    .then((res) => {
      if (res.code === 200) {
        navList.value = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            ...item,
          };
        });
      } else {
        ElMessage.error(res.msg || "获取菜单失败");
      }
    });
};

const getDetailInfo = () => {
  request
    .get({
      url: "/system/nav/getDetail",
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
            type: 'select',
            label: '所属应用',
            options: appList,
            isDisabled: true,
          }"
          v-model="detailInfo.appId"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '菜单名称',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '菜单链接',
          }"
          v-model="detailInfo.url"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'selectTree',
            label: '上级菜单',
            options: navList,
            more: {
              checkStrictly: true,
            },
          }"
          v-model="detailInfo.parentId"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'slot',
            label: '菜单图标',
          }"
        >
          <p-iconSelect title="选择图标" v-model="detailInfo.icon" />
        </p-item>
        <p-item
          class="dtItem"
          :config="{
            type: 'radio',
            label: '是否显示在导航',
            options: [
              {
                label: '是',
                value: 1,
              },
              {
                label: '否',
                value: 0,
              },
            ],
          }"
          v-model="detailInfo.isNav"
        />
        <!-- 排序 -->
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'inputNumber',
            label: '排序',
          }"
          v-model="detailInfo.index"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'textarea',
            label: '备注',
          }"
          v-model="detailInfo.remark"
        />
        <p-item
          class="dtItem"
          :config="{
            type: 'slot',
            label: '页面按钮',
          }"
        >
          <btnTable :type="detailType" v-model="detailInfo.btnList" />
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
