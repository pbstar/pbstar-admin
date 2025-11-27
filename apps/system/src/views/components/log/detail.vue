<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { PCollapse, PItem } from "@Pcomponents";

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
      url: "/system/log/getDetail",
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
            label: '用户名',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.userName"
        />
        <p-item
          class="item"
          :config="{
            label: '请求方法',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.method"
        />
        <p-item
          class="item"
          :config="{
            label: '请求路径',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.path"
        />
        <p-item
          class="item"
          :config="{
            label: 'IP地址',
            type: 'input',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.ip"
        />
        <p-item
          class="item"
          :config="{
            label: '请求参数',
            type: 'textarea',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.param"
        />
        <p-item
          class="item"
          :config="{
            label: '操作时间',
            type: 'dateTime',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.createTime"
        />
      </div>
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
