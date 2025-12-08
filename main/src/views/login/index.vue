<template>
  <div class="login-container">
    <div class="login-center">
      <div class="top">
        <img src="@/assets/imgs/logo.png" alt="" />
        <h3>{{ title }}</h3>
      </div>
      <div class="formBox">
        <el-input v-model="loginForm.username" placeholder="请输入账号">
          <template #prefix>
            <p-icon name="el-icon-user" />
          </template>
        </el-input>
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          type="password"
        >
          <template #prefix>
            <p-icon name="el-icon-lock" />
          </template>
        </el-input>
        <el-input v-model="loginForm.captcha" placeholder="请输入验证码">
          <template #prefix>
            <p-icon name="el-icon-postcard" />
          </template>
          <template #suffix>
            <p-verificationCode
              identifyCodes="23456789"
              @changeCode="changeCode"
            />
          </template>
        </el-input>
        <el-button type="primary" @click="handleSubmit"> 登 录 </el-button>
      </div>
      <div class="users">
        <p>超管：admin/123456</p>
        <p>普通管理员：common/123456</p>
        <p>普通用户：user/123456</p>
      </div>
    </div>
    <LoginLb class="login-lb" />
    <LoginRt class="login-rt" />
    <div class="login-footer">京ICP备2025125905号</div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { PIcon, PVerificationCode } from "@Pcomponents";
import request from "@Passets/utils/request";
import useSharedStore from "@Passets/stores/shared";
import LoginLb from "./components/login-lb.vue";
import LoginRt from "./components/login-rt.vue";

const sharedStore = useSharedStore();
const router = useRouter();

// 页面标题
const title = ref(import.meta.env.PUBLIC_TITLE);

// 验证码
let code = "";
const changeCode = (e) => {
  code = e;
};

// 登录表单
const loginForm = ref({
  username: "",
  password: "",
  captcha: "",
});

// 表单验证
const validateForm = () => {
  if (!loginForm.value.username) {
    ElMessage.error("请输入账号");
    return false;
  }
  if (!loginForm.value.password) {
    ElMessage.error("请输入密码");
    return false;
  }
  if (!loginForm.value.captcha) {
    ElMessage.error("请输入验证码");
    return false;
  }
  if (loginForm.value.captcha !== code) {
    ElMessage.error("验证码错误");
    return false;
  }
  return true;
};

// 登录提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  const res = await request.post({
    url: "/main/login",
    data: {
      username: loginForm.value.username,
      password: loginForm.value.password,
    },
  });
  if (res.code === 200 && res.data) {
    localStorage.setItem("p_token", res.data.token);
    sharedStore.userInfo = {
      id: res.data.id,
      name: res.data.name,
      avatar: res.data.avatar,
      username: res.data.username,
      role: res.data.role,
      btns: res.data.btns,
    };
    router.push({ path: "/" });
    ElMessage.success("登录成功");
  } else {
    ElMessage.error(res.msg);
  }
};
</script>
<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.login-center {
  width: 520px;
  padding: 36px 60px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  .top {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 38px;
      height: 38px;
    }
    h3 {
      font-size: 26px;
      font-weight: bold;
      margin-left: 10px;
    }
  }
  :deep(.el-input) {
    margin-top: 16px;
  }
  :deep(.el-input__inner),
  :deep(.el-input__prefix),
  :deep(.el-input__suffix),
  :deep(.el-input__wrapper),
  :deep(.el-button) {
    height: 36px;
  }
  :deep(.el-button) {
    margin-top: 30px;
    width: 100%;
  }
  .users {
    margin-top: 10px;
    p {
      font-size: 13px;
      color: #999;
    }
  }
}
.login-lb {
  position: absolute;
  bottom: -500px;
  left: -300px;
  width: 900px;
  height: 800px;
  overflow: hidden;
  z-index: -1;
}
.login-rt {
  position: absolute;
  top: -750px;
  right: -450px;
  width: 900px;
  overflow: hidden;
  z-index: -1;
}
.login-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.8);
  height: 36px;
  line-height: 36px;
  color: #666;
  z-index: 0;
  border-top: 1px solid #f0f0f0;
  backdrop-filter: blur(5px);
}
@media screen and (max-width: 700px) {
  .login-center {
    width: 90%;
    padding: 20px;
  }
  .login-lb {
    left: -360px;
  }
  .login-rt {
    right: -550px;
    top: -700px;
  }
}
</style>
