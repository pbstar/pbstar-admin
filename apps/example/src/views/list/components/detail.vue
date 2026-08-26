<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { getPersonDetail } from "@/api/person";
import { pCollapse, pItem } from "@Pcomponents";
import { booleanOptions, ethnicOptions, sexOptions, getOptionLabel } from "@/constants/options";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: Number,
    default: 0,
  },
});
const detailInfo = ref<Record<string, any>>({});
const detailType = ref("");
const detailId = ref<number>(0);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});

const getDetailInfo = () => {
  getPersonDetail({ id: detailId.value })
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
          label="姓名"
          isRequired
          :showText="detailType === 'view'"
          :text="detailInfo.name"
        >
          <el-input v-model="detailInfo.name" placeholder="请输入姓名" />
        </p-item>
        <p-item
          class="item"
          label="年龄"
          isRequired
          :showText="detailType === 'view'"
          :text="detailInfo.age"
        >
          <el-input-number v-model="detailInfo.age" placeholder="请输入年龄" />
        </p-item>
        <p-item
          class="item"
          label="性别"
          isRequired
          :showText="detailType === 'view'"
          :text="
            detailType === 'view'
              ? getOptionLabel(sexOptions, detailInfo.sex)
              : ''
          "
        >
          <el-select v-model="detailInfo.sex" placeholder="请选择性别">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="item"
          label="民族"
          :showText="detailType === 'view'"
          :text="
            detailType === 'view'
              ? getOptionLabel(ethnicOptions, detailInfo.ethnic)
              : ''
          "
        >
          <el-select v-model="detailInfo.ethnic" placeholder="请选择民族">
            <el-option
              v-for="item in ethnicOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="item"
          label="是否健康"
          :showText="detailType === 'view'"
          :text="
            detailType === 'view'
              ? getOptionLabel(booleanOptions, detailInfo.isHealthy)
              : ''
          "
        >
          <el-select v-model="detailInfo.isHealthy" placeholder="请选择">
            <el-option
              v-for="item in booleanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
    width: calc(33.33% - 20px);

    &.full {
      width: 100%;
    }
  }
}
</style>
