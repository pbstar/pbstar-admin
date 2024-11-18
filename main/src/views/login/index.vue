<template>
  <div class="login-container">
    <div class="login-center">
      <div class="login-left"></div>
      <div class="login-right">
        <h3 class="title">{{ title }}</h3>
        <div class="formBox">
          <t-input
            size="large"
            v-model="loginForm.username"
            placeholder="请输入用户名"
          >
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
          <t-input
            size="large"
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
          <t-input
            size="large"
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
          >
            <template #suffix-icon>
              <p-verification-code
                :contentHeight="32"
                identifyCodes="23456789"
                @changeCode="changeCode"
              >
              </p-verification-code>
            </template>
          </t-input>
          <t-button size="large" theme="primary" block @click="handleSubmit()"
            >登录</t-button
          >
        </div>
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MessagePlugin } from "tdesign-vue-next";
import config from "@config";

const router = useRouter();
const route = useRoute();

let title = ref(config.title);
let redirect_path = "/";
onMounted(() => {
  if (route.query.redirect_path) redirect_path = route.query.redirect_path;
});
let code = "";
const changeCode = (e) => {
  code = e;
};
const loginForm = ref({
  username: "",
  password: "",
  captcha: "",
});
const handleSubmit = () => {
  if (loginForm.value.username == "") {
    MessagePlugin.error("请输入用户名");
    return;
  }
  if (loginForm.value.password == "") {
    MessagePlugin.error("请输入密码");
    return;
  }
  if (loginForm.value.captcha == "") {
    MessagePlugin.error("请输入验证码");
    return;
  }
  if (loginForm.value.captcha != code) {
    MessagePlugin.error("验证码错误");
    return;
  }
  toLoginOk({
    token: "1",
    role: "admin",
    user_id: "1",
    user_info: {
      name: "admin",
    },
  });
};
const toLoginOk = (e) => {
  localStorage.setItem("token", e.token);
  localStorage.setItem("role", e.role);
  localStorage.setItem("user_id", e.user_id);
  localStorage.setItem("user_info", JSON.stringify(e.user_info));
  router.push({ path: redirect_path });
  MessagePlugin.success("登录成功");
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
  width: 780px;
  height: 400px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  .login-left {
    width: 480px;
    height: 400px;
    background-image: url("@/assets/imgs/login.png");
    background-size: 100% 100%;
  }
  .login-right {
    width: 300px;
    height: 400px;
    background-color: #fff;
    padding: 40px 25px 0;
    .title {
      font-size: 20px;
      text-align: center;
      line-height: 40px;
    }
    :deep(.t-input) {
      margin-top: 20px;
    }
    :deep(.t-button) {
      margin-top: 25px;
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
