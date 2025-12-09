<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem } from "@Pcomponents";
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
const detailType = ref(props.type);
const detailId = ref("");

onBeforeMount(() => {
  detailId.value = props.id;
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getDetailInfo = () => {
  request
    .get({
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
  <div style="padding: 0 10px">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <div class="form">
        <p-item
          class="item"
          :config="{
            label: '枚举名称',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="item"
          :config="{
            label: '枚举key',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.key"
        />
      </div>
    </p-collapse>
    <p-collapse title="枚举值">
      <enumTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .item {
    width: 100%;
  }
}
</style>
