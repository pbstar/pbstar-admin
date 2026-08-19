<template>
  <div class="login-container">
    <!-- 左侧品牌区：纯色块 + 已有 Logo，不引入额外插画资源 -->
    <div class="login-brand">
      <div class="brand-header">
        <img src="@/assets/imgs/logo-w.png" alt="" />
        <span class="name">{{ title }}</span>
      </div>
      <div class="brand-main">
        <h2>企业级后台管理平台</h2>
        <p>统一管理多应用、多角色的一体化控制台</p>
        <div class="brand-line"></div>
      </div>
      <!-- 大尺寸低透明度水印，用现有 Logo 增加层次，不依赖新插画素材 -->
      <img class="brand-watermark" src="@/assets/imgs/logo-w.png" alt="" />
    </div>

    <!-- 右侧表单区 -->
    <div class="login-form-panel">
      <div class="formInner">
        <div class="top">
          <h3>欢迎登录</h3>
          <p>请输入账号信息进入系统</p>
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
      <div class="login-footer">京ICP备2025125905号</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { pIcon, pVerificationCode } from "@Pcomponents";
import request from "@Passets/utils/request";
import useSharedStore from "@Passets/stores/shared";

const sharedStore = useSharedStore();
const router = useRouter();

// 页面标题（静态值，无需响应式）
const title = import.meta.env.PUBLIC_TITLE;

// 验证码
let code = "";
const changeCode = (e: string) => {
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
    sharedStore.setUserInfo(res.data);
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
  height: 100vh;
  width: 100vw;
  background-color: var(--c-bg);
  overflow: hidden;
}

/* 左侧品牌区 */
.login-brand {
  flex: 0 0 44%;
  min-width: 420px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--c-bg-header);
  color: var(--c-text-theme);
  display: flex;
  flex-direction: column;

  .brand-header {
    display: flex;
    align-items: center;
    padding: var(--space-6) var(--space-6) 0;
    position: relative;
    z-index: 1;
    img {
      width: 32px;
      height: 32px;
    }
    .name {
      margin-left: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: 600;
    }
  }

  .brand-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 var(--space-6);
    position: relative;
    z-index: 1;
    h2 {
      font-size: 30px;
      font-weight: 600;
      line-height: 1.4;
    }
    p {
      margin-top: var(--space-3);
      font-size: var(--font-size-md);
      color: rgba(255, 255, 255, 0.72);
    }
    .brand-line {
      margin-top: var(--space-5);
      width: 48px;
      height: 3px;
      background-color: var(--c-bg-theme-light);
    }
  }

  .brand-watermark {
    position: absolute;
    right: -60px;
    bottom: -60px;
    width: 320px;
    height: 320px;
    opacity: 0.08;
    z-index: 0;
  }
}

/* 右侧表单区 */
.login-form-panel {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  .formInner {
    width: 360px;

    .top {
      margin-bottom: var(--space-6);
      h3 {
        font-size: 24px;
        font-weight: 600;
        color: var(--c-text);
      }
      p {
        margin-top: var(--space-2);
        font-size: var(--font-size-sm);
        color: var(--c-text2);
      }
    }
  }

  :deep(.el-input) {
    margin-top: var(--space-4);
  }
  :deep(.el-input__inner),
  :deep(.el-input__prefix),
  :deep(.el-input__suffix),
  :deep(.el-input__wrapper),
  :deep(.el-button) {
    height: 40px;
  }
  :deep(.el-button) {
    margin-top: var(--space-6);
    width: 100%;
  }

  .users {
    margin-top: var(--space-4);
    p {
      font-size: var(--font-size-xs);
      color: var(--c-text2);
    }
  }

  .login-footer {
    position: absolute;
    bottom: var(--space-5);
    left: 0;
    right: 0;
    text-align: center;
    font-size: var(--font-size-xs);
    color: var(--c-text2);
  }
}

@media (max-width: 860px) {
  .login-brand {
    display: none;
  }
}
</style>
