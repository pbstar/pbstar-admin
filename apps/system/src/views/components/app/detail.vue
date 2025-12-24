<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem, pIconSelect } from "@Pcomponents";
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
          label="应用名称"
          :showText="detailType === 'view'"
          :text="detailInfo.name"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入应用名称" />
        </p-item>
        <p-item
          class="item"
          label="应用分组"
          :showText="detailType === 'view'"
          :text="detailInfo.group"
        >
          <el-input v-model="detailInfo.group" placeholder="请输入应用分组" />
        </p-item>
        <p-item
          class="item"
          label="应用key"
          :showText="detailType === 'view'"
          :text="
            appOptions.find((item) => item.value == detailInfo.key)?.label ||
            detailInfo.key
          "
        >
          <el-select v-model="detailInfo.key" placeholder="请选择应用key">
            <el-option
              v-for="item in appOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item class="item" label="选择图标">
          <p-iconSelect title="选择图标" v-model="detailInfo.icon" />
        </p-item>
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
