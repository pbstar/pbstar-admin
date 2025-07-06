<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PForm from "@Pcomponents/base/p-form/index.vue";
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
const formData = ref([
  {
    label: "枚举名称",
    type: "input",
    key: "name",
    isText: detailType.value == "view",
  },
  {
    label: "枚举key",
    type: "input",
    key: "key",
    isText: detailType.value == "view",
  },
]);

onBeforeMount(() => {
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
  <div style="padding: 0 10px">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <p-form
        :data="formData"
        :spanList="[12, 12]"
        v-model="detailInfo"
      ></p-form>
    </p-collapse>
    <p-collapse title="枚举值">
      <enumTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss"></style>
