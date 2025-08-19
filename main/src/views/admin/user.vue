<template>
  <div class="page">
    <p-title :list="['个人资料']"></p-title>
    <div class="content">
      <div class="info">
        <p-form
          :data="formData"
          :spanList="[12, 12, 12, 12]"
          v-model="detailInfo"
        >
        </p-form>
      </div>
      <div class="btn">
        <el-button type="primary" @click="toSave">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "@Passets/utils/request";
import useSharedStore from "@Passets/stores/shared";
import PTitle from "@Pcomponents/base/p-title/index.vue";
import PForm from "@Pcomponents/base/p-form/index.vue";

const sharedStore = useSharedStore();
const detailInfo = ref({});
const router = useRouter();
const formData = ref([
  {
    label: "姓名",
    key: "name",
    type: "input",
    isRequired: true,
  },
  {
    label: "头像",
    key: "avatar",
    type: "input",
    placeholder: "请输入头像地址",
  },
  {
    label: "账号",
    key: "username",
    type: "input",
    isRequired: true,
  },
  {
    label: "密码",
    key: "password",
    type: "input",
    placeholder: "如需修改密码，请输入新密码",
  },
]);

const toSave = () => {
  request
    .post({
      url: "/main/updateMyInfo",
      data: detailInfo.value,
    })
    .then((res) => {
      if (res && res.code === 200) {
        ElMessage.success("修改成功，请重新登录");
        localStorage.removeItem("p_token");
        sharedStore.userInfo = null;
        router.push({ path: "/login" });
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    });
};
watch(
  () => sharedStore.userInfo,
  (newVal, oldVal) => {
    if (newVal) {
      detailInfo.value = { ...newVal };
    }
  },
  { deep: true, immediate: true },
);
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px;
  background-color: var(--c-bg);
  .content {
    width: 100%;
    padding: 20px 0;
    .info {
      width: 360px;
      max-width: 100%;
    }
    .btn {
      width: 270px;
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
