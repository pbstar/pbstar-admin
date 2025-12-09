<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem } from "@Pcomponents";
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
            label: '姓名',
            type: 'input',
            isRequired: true,
            isText: detailType === 'view',
          }"
          v-model="detailInfo.name"
        />
        <p-item
          class="item"
          :config="{
            label: '年龄',
            type: 'inputNumber',
            isRequired: true,
            isText: detailType === 'view',
          }"
          v-model="detailInfo.age"
        />
        <p-item
          class="item"
          :config="{
            label: '性别',
            type: 'select',
            isRequired: true,
            options: [
              { label: '男', value: '1' },
              { label: '女', value: '2' },
            ],
            isText: detailType === 'view',
          }"
          v-model="detailInfo.sex"
        />
        <p-item
          class="item"
          :config="{
            label: '民族',
            type: 'select',
            enumKey: 'ethnic',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.ethnic"
        />
        <p-item
          class="item"
          :config="{
            label: '是否健康',
            type: 'select',
            enumKey: 'boolean',
            isText: detailType === 'view',
          }"
          v-model="detailInfo.isHealthy"
        />
        <div class="item full">
          <hobbyTable :type="detailType" v-model="detailInfo.hobbyList" />
        </div>
      </div>
    </p-collapse>
    <p-collapse title="教育背景">
      <eduTable :type="detailType" :id="detailId" />
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .item {
    width: calc(33.33% - 20px);

    &.full {
      width: 100%;
    }
  }
}
</style>
