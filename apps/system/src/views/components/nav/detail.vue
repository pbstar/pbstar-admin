<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import PIconSelect from "@Pcomponents/more/p-iconSelect/index.vue";

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
const navList = ref([]); // 菜单树结构

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getNavList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getNavList = () => {
  request
    .get({
      base: "base",
      url: "/system/nav/getAllList",
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
      base: "base",
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
          <PIconSelect title="选择图标" v-model="detailInfo.icon" />
        </p-item>
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
