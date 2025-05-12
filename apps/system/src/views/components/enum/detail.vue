<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import EnumTable from "./enumTable.vue";

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

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getDetailInfo = () => {
  request
    .get({
      base: "base",
      url: "/system/enum/getDetail",
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
            label: '枚举名称',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'input',
            label: '枚举Key',
          }"
          v-model="detailInfo.key"
        />
      </div>
    </p-collapse>
    <p-collapse title="详细列表">
      <enumTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
  .items {
    display: flex;
    flex-wrap: wrap;

    .dtItem {
      width: 50%;
      margin-bottom: 10px;
    }
  }
}
</style>
