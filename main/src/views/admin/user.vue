<template>
  <div class="page">
    <p-title :list="['个人资料']"></p-title>
    <div class="content">
      <div class="info">
        <div class="form">
          <p-item class="item" label="姓名" isRequired>
            <el-input v-model="detailInfo.name" placeholder="请输入姓名" />
          </p-item>
          <p-item class="item" label="头像">
            <el-input
              v-model="detailInfo.avatar"
              placeholder="请输入头像地址"
            />
          </p-item>
          <p-item class="item" label="账号" isRequired>
            <el-input v-model="detailInfo.username" placeholder="请输入账号" />
          </p-item>
          <p-item class="item" label="密码">
            <el-input
              v-model="detailInfo.password"
              placeholder="如需修改密码，请输入新密码"
            />
          </p-item>
        </div>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          :loading="saving"
          :disabled="saving"
          @click="toSave"
        >
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { updateMyInfo } from "@/api";
import type { UpdateMyInfoPayload } from "@/api";
import useSharedStore from "@Passets/stores/shared";
import { pTitle, pItem } from "@Pcomponents";
import { logout } from "@/utils/auth";

const sharedStore = useSharedStore();
const detailInfo = ref<UpdateMyInfoPayload>({ name: "", avatar: "", username: "", password: "" });
const saving = ref(false);

const toSave = () => {
  // 防重复点击：保存中直接忽略后续点击
  if (saving.value) return;
  saving.value = true;
  updateMyInfo(detailInfo.value)
    .then((res) => {
      if (res && res.code === 200) {
        ElMessage.success("修改成功，请重新登录");
        logout();
      } else {
        ElMessage.error(res?.msg || "操作异常");
      }
    })
    .finally(() => {
      saving.value = false;
    });
};
watch(
  () => sharedStore.userInfo,
  (newVal) => {
    if (newVal) {
      detailInfo.value = {
        name: newVal.name ?? "",
        avatar: newVal.avatar ?? "",
        username: newVal.username ?? "",
        password: "",
      };
    }
  },
  { deep: true, immediate: true },
);
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px 10px;
  background-color: var(--c-bg);
  .content {
    width: 100%;
    padding: 20px 0;
    .info {
      width: 360px;
      max-width: 100%;
      .form {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .item {
          width: 100%;
        }
      }
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
