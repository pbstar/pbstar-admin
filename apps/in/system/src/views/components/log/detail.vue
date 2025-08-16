<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PForm from "@Pcomponents/base/p-form/index.vue";

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
const formData = ref([
  {
    label: "用户名",
    type: "input",
    key: "userName",
    isText: 'detailType.value == "view"',
  },
  {
    label: "请求方法",
    type: "input",
    key: "method",
    isText: 'detailType.value == "view"',
  },
  {
    label: "请求路径",
    type: "input",
    key: "path",
    isText: 'detailType.value == "view"',
  },
  {
    label: "IP地址",
    type: "input",
    key: "ip",
    isText: 'detailType.value == "view"',
  },
  {
    label: "请求参数",
    type: "textarea",
    key: "param",
    isText: 'detailType.value == "view"',
  },
  {
    label: "操作时间",
    type: "dateTime",
    key: "createTime",
    isText: 'detailType.value == "view"',
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
      <p-form
        :data="formData"
        :spanList="[12, 12, 12, 12, 12, 12]"
        v-model="detailInfo"
      ></p-form>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss"></style>
