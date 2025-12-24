<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import { pCollapse, pItem } from "@Pcomponents";

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
          label="用户名"
          :showText="detailType === 'view'"
          :text="detailInfo.userName"
        >
          <el-input v-model="detailInfo.userName" placeholder="请输入用户名" />
        </p-item>
        <p-item
          class="item"
          label="请求方法"
          :showText="detailType === 'view'"
          :text="detailInfo.method"
        >
          <el-input v-model="detailInfo.method" placeholder="请输入请求方法" />
        </p-item>
        <p-item
          class="item"
          label="请求路径"
          :showText="detailType === 'view'"
          :text="detailInfo.path"
        >
          <el-input v-model="detailInfo.path" placeholder="请输入请求路径" />
        </p-item>
        <p-item
          class="item"
          label="IP地址"
          :showText="detailType === 'view'"
          :text="detailInfo.ip"
        >
          <el-input v-model="detailInfo.ip" placeholder="请输入IP地址" />
        </p-item>
        <p-item
          class="item"
          label="请求参数"
          :showText="detailType === 'view'"
          :text="detailInfo.param"
          isTextWrap
        >
          <el-input
            v-model="detailInfo.param"
            type="textarea"
            :rows="3"
            placeholder="请输入请求参数"
          />
        </p-item>
        <p-item
          class="item"
          label="操作时间"
          :showText="detailType === 'view'"
          :text="detailInfo.createTime"
        >
          <el-date-picker
            v-model="detailInfo.createTime"
            type="datetime"
            placeholder="请选择操作时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
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
