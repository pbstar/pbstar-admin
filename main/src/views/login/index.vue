<template>
  <div class="login-container">
    <div class="login-center">
      <div class="top">
        <img src="@/assets/imgs/logo.png" alt="" />
        <h3>{{ title }}</h3>
      </div>
      <div class="formBox">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          :prefix-icon="User"
        ></el-input>
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          :prefix-icon="Lock"
          type="password"
        ></el-input>
        <el-input
          v-model="loginForm.captcha"
          placeholder="请输入验证码"
          :prefix-icon="Postcard"
        >
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
    <div class="login-lb">
      <svg
        data-v-c9f4d7d9=""
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        height="896"
        width="967.8852157128662"
      >
        <defs>
          <path
            id="path-2"
            opacity="1"
            fill-rule="evenodd"
            d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z"
          ></path>
          <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stop-color="#28aff0" stop-opacity="1"></stop>
            <stop offset="1" stop-color="#120fc4" stop-opacity="1"></stop>
          </linearGradient>
        </defs>
        <g opacity="1">
          <use
            xlink:href="#path-2"
            fill="url(#linearGradient-3)"
            fill-opacity="1"
          ></use>
        </g>
      </svg>
    </div>
    <div class="login-rt">
      <svg data-v-c9f4d7d9="" height="1337" width="1337">
        <defs>
          <path
            id="path-1"
            opacity="1"
            fill-rule="evenodd"
            d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"
          ></path>
          <linearGradient
            id="linearGradient-2"
            x1="0.79"
            y1="0.62"
            x2="0.21"
            y2="0.86"
          >
            <stop offset="0" stop-color="#28aff0" stop-opacity="1"></stop>
            <stop offset="1" stop-color="#120fc4" stop-opacity="1"></stop>
          </linearGradient>
        </defs>
        <g opacity="1">
          <use
            xlink:href="#path-1"
            fill="url(#linearGradient-2)"
            fill-opacity="1"
          ></use>
        </g>
      </svg>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock, Postcard } from "@element-plus/icons-vue";
import request from "@Passets/utils/request";
import { useNavsStore } from "@/stores/navs";
import useSharedStore from "@Passets/stores/shared";
import pVerificationCode from "@Pcomponents/more/p-verificationCode/index.vue";

const sharedStore = useSharedStore();
const navsStore = useNavsStore();
const router = useRouter();

let title = ref(import.meta.env.PUBLIC_TITLE);

let code = "";
const changeCode = (e) => {
  code = e;
};
const loginForm = ref({
  username: "",
  password: "",
  captcha: "",
});
const handleSubmit = async () => {
  if (loginForm.value.username == "") {
    ElMessage.error("请输入用户名");
    return;
  }
  if (loginForm.value.password == "") {
    ElMessage.error("请输入密码");
    return;
  }
  if (loginForm.value.captcha == "") {
    ElMessage.error("请输入验证码");
    return;
  }
  if (loginForm.value.captcha != code) {
    ElMessage.error("验证码错误");
    return;
  }
  const res = await request.post({
    base: "base",
    url: "/main/login",
    data: {
      username: loginForm.value.username,
      password: loginForm.value.password,
    },
  });
  if (res.code == 200 && res.data) {
    localStorage.setItem("p_token", res.data.token);
    sharedStore.userInfo = {
      id: res.data.id,
      name: res.data.name,
      avatar: res.data.avatar,
      username: res.data.username,
      role: res.data.role,
    };
    request
      .get({
        base: "base",
        url: "/main/getMyNavTreeList",
      })
      .then((r) => {
        if (r.code === 200) {
          navsStore.setNavs(r.data);
          router.push({ path: "/" });
          ElMessage.success("登录成功");
        } else {
          ElMessage.error(r.msg);
        }
      });
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
  height: 390px;
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
</style>
