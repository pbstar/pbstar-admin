<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import { PCollapse, PForm, PIconSelect } from "@Pcomponents";
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
const formData = ref([
  {
    label: "应用名称",
    type: "input",
    key: "name",
    isText: detailType.value == "view",
  },
  {
    label: "应用分组",
    type: "input",
    key: "group",
    isText: detailType.value == "view",
  },
  {
    label: "应用key",
    type: "select",
    key: "key",
    isText: detailType.value == "view",
    options: apps.map((item) => {
      return {
        label: item.key,
        value: item.key,
      };
    }),
  },
  {
    label: "应用图标",
    type: "slot",
    key: "icon",
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
      <p-form
        :data="formData"
        :spanList="[12, 12, 12, 12]"
        v-model="detailInfo"
      >
        <template #icon>
          <PIconSelect title="选择图标" v-model="detailInfo.icon" />
        </template>
      </p-form>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding: 0 10px;
}
</style>
