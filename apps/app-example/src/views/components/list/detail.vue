<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@Passets/utils/request";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
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
      url: "/example/test/getDetail",
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
            label: '姓名',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'inputNumber',
            label: '年龄',
          }"
          v-model="detailInfo.age"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'select',
            label: '性别',
            options: [
              { label: '男', value: '1' },
              { label: '女', value: '2' },
            ],
          }"
          v-model="detailInfo.sex"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'select',
            label: '民族',
            enumType: 'p_ethnic',
          }"
          v-model="detailInfo.ethnic"
        />
        <p-item
          class="dtItem"
          :config="{
            isText: detailType == 'view',
            type: 'select',
            label: '是否健康',
            enumType: 'p_boolean',
          }"
          v-model="detailInfo.isHealthy"
        />
        <p-item
          class="dtItem"
          style="width: 96%"
          :config="{
            type: 'slot',
            label: '兴趣爱好',
          }"
        >
          <hobbyTable :type="detailType" v-model="detailInfo.hobbyList" />
        </p-item>
      </div>
    </p-collapse>
    <p-collapse title="教育背景">
      <eduTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  .items {
    display: flex;
    flex-wrap: wrap;

    .dtItem {
      width: 30%;
      margin-right: 3%;
      margin-bottom: 10px;
    }
  }
}
</style>
