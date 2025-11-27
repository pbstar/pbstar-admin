<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PCollapse, PItem, PIconSelect } from "@Pcomponents";
import apps from "../../../../../apps.json" with { type: "json" };

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
const appOptions = apps.map((item) => {
  return {
    label: item.key,
    value: item.key,
  };
});

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
      url: "/system/app/getDetail",
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
      <div class="form">
        <p-item
          class="item"
          :config="{
            label: '应用名称',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="item"
          :config="{
            label: '应用分组',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.group"
        />
        <p-item
          class="item"
          :config="{
            label: '应用key',
            type: 'select',
            options: appOptions,
            isText: detailType === 'view',
          }"
          v-model="detailInfo.key"
        />
        <div class="item">
          <PIconSelect
            title="选择图标"
            v-model="detailInfo.icon"
            :isText="detailType === 'view'"
          />
        </div>
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
}
.form {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: calc(100% - 20px);
  }
}
</style>
