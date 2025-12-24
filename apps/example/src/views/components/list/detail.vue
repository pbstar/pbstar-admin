<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem } from "@Pcomponents";
import { useEnumStore } from "@Passets/stores/enum";
import hobbyTable from "./hobbyTable.vue";
import eduTable from "./eduTable.vue";

const enumStore = useEnumStore();

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

// 获取性别标签
const getSexLabel = (value) => {
  const sexMap = { 1: "男", 2: "女" };
  return sexMap[value] || value;
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
          label="姓名"
          isRequired
          :text="detailType === 'view' ? detailInfo.name : ''"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入姓名" />
        </p-item>
        <p-item
          class="item"
          label="年龄"
          isRequired
          :text="detailType === 'view' ? String(detailInfo.age) : ''"
        >
          <el-input-number v-model="detailInfo.age" placeholder="请输入年龄" />
        </p-item>
        <p-item
          class="item"
          label="性别"
          isRequired
          :text="detailType === 'view' ? getSexLabel(detailInfo.sex) : ''"
        >
          <el-select v-model="detailInfo.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </p-item>
        <p-item
          class="item"
          label="民族"
          :text="
            detailType === 'view'
              ? enumStore.getEnumLabel('ethnic', detailInfo.ethnic)
              : ''
          "
        >
          <el-select v-model="detailInfo.ethnic" placeholder="请选择民族">
            <el-option
              v-for="item in enumStore.getEnumOptions('ethnic')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="item"
          label="是否健康"
          :text="
            detailType === 'view'
              ? enumStore.getEnumLabel('boolean', detailInfo.isHealthy)
              : ''
          "
        >
          <el-select v-model="detailInfo.isHealthy" placeholder="请选择">
            <el-option
              v-for="item in enumStore.getEnumOptions('boolean')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item class="item full" label="爱好">
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
