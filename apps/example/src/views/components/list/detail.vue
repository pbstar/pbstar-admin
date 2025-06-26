<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PForm from "@Pcomponents/base/p-form/index.vue";
import hobbyTable from "./hobbyTable.vue";
import eduTable from "./eduTable.vue";

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
const formRef = ref(null);
const formData = ref([
  {
    key: "name",
    label: "姓名",
    type: "input",
    isRequired: true,
    isText: detailType.value == "view",
  },
  {
    key: "age",
    label: "年龄",
    type: "inputNumber",
    isRequired: true,
    isText: detailType.value == "view",
  },
  {
    key: "sex",
    label: "性别",
    type: "select",
    isRequired: true,
    options: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
    isText: detailType.value == "view",
  },
  {
    key: "ethnic",
    label: "民族",
    type: "select",
    enumKey: "ethnic",
    isText: detailType.value == "view",
  },
  {
    key: "isHealthy",
    label: "是否健康",
    type: "select",
    enumKey: "boolean",
    isText: detailType.value == "view",
  },
  {
    key: "hobbyList",
    label: "兴趣爱好",
    type: "slot",
  },
]);

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
      url: "/example/person/getDetail",
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
  const isRequired = formRef.value && formRef.value.toCheckRequired();
  if (!isRequired) {
    return false;
  }
  return detailInfo.value;
};

defineExpose({
  getFormValue,
});
</script>

<template>
  <div class="detail">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <p-form
        :data="formData"
        :spanList="[4, 4, 4, 4, 4, 12]"
        ref="formRef"
        v-model="detailInfo"
      >
        <template #hobbyList>
          <hobbyTable :type="detailType" v-model="detailInfo.hobbyList" />
        </template>
      </p-form>
    </p-collapse>
    <p-collapse title="教育背景">
      <eduTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss"></style>
