<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h3 class="title">{{ title }}</h3>
      <div class="formBox">
        <pa-input
          size="large"
          v-model="loginForm.username"
          placeholder="请输入用户名"
        >
          <template #prefix-icon>
            <pa-icon name="user"/>
          </template>
        </pa-input>
        <pa-input
          size="large"
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        >
          <template #prefix-icon>
            <pa-icon name="lock-on"/>
          </template>
        </pa-input>
        <pa-input
          size="large"
          v-model="loginForm.captcha"
          placeholder="请输入验证码"
        >
          <template #suffix-icon>
            <pa-verification-code
              :contentHeight="32"
              identifyCodes="23456789"
              @changeCode="changeCode"
            >
            </pa-verification-code>
          </template>
        </pa-input>
        <pa-button size="large" theme="primary" block @click="handleSubmit()"
          >登录</pa-button
        >
      </div>
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

let title = ref(config.title)
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
    token: "123",
    role: "admin",
    user_id: "123",
    user_info: {
      name: "admin"
    }
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
  justify-content: flex-end;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #a6d1de, #0000d8);
  background-size: cover;
  background-position: center;
}

.login-form-wrapper {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-right: 10%;
  margin-left: 10%;
  padding: 30px;
  width: 380px;
  height: 330px;
  overflow: hidden;
  position: relative;
}

.login-form-wrapper .title {
  font-size: 20px;
  text-align: center;
  line-height: 30px;
}

.login-form-wrapper :deep(.t-input) {
  margin-top: 15px;
}

.login-form-wrapper :deep(.t-button) {
  margin-top: 20px;
}

.codeBox {
  text-align: center;
  position: relative;

  img {
    width: 150px;
    height: 150px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  p {
    font-size: 13px;
    color: #333;
  }

  .codeTip {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    height: 150px;
    width: 150px;
    background-color: #ffffffc7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      background-color: #fff;
      padding: 0 10px;
      border-radius: 5px;
      color: #666;
      font-size: 12px;
    }
  }
}

.changeBox {
  position: absolute;
  top: -12px;
  right: -38px;
  transform: rotate(45deg);
  background-color: #eee;
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  padding-bottom: 5px;

  .t-icon {
    transform: rotate(-45deg);
    color: #0052d9;
  }
}
</style>
