<template>
  <div class="login-container">
    <!-- 左侧品牌区：深空蓝渐变 + 光晕/网格纹理，纯 CSS 实现，不依赖插画资源 -->
    <div class="login-brand">
      <div class="brand-header">
        <img src="@/assets/imgs/logo-w.png" alt="" />
        <span class="name">{{ title }}</span>
      </div>
      <div class="brand-main">
        <h2>现代化企业级微后台</h2>
        <p>基于 wujie 微前端 · Rsbuild 高性能构建 · pnpm monorepo</p>
        <ul class="brand-features">
          <li><p-icon name="el-icon-CircleCheckFilled" :size="15" />微前端架构，多应用动态解耦</li>
          <li><p-icon name="el-icon-CircleCheckFilled" :size="15" />企业级组件化，跨应用复用</li>
          <li><p-icon name="el-icon-CircleCheckFilled" :size="15" />全链路工程化，完整 CLI 工具链</li>
        </ul>
      </div>
      <div class="brand-footer">© {{ year }} {{ title }}</div>
      <!-- 装饰层：光晕 + 网格纹理 -->
      <div class="brand-glow brand-glow-1"></div>
      <div class="brand-glow brand-glow-2"></div>
      <div class="brand-grid"></div>
    </div>

    <!-- 右侧表单区 -->
    <div class="login-form-panel">
      <div class="formInner">
        <div class="top">
          <h3>欢迎回来</h3>
          <p>请使用您的账号登录系统</p>
        </div>
        <div class="formBox">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号"
            clearable
          >
            <template #prefix>
              <p-icon name="el-icon-user" />
            </template>
          </el-input>
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            show-password
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
        <!-- 演示账号卡片：点击自动填充，方便体验 -->
        <div class="demo-card">
          <div class="demo-title">
            <p-icon name="el-icon-InfoFilled" :size="14" />
            <span>演示账号（点击填充）</span>
          </div>
          <div class="demo-users">
            <button
              v-for="item in demoUsers"
              :key="item.username"
              type="button"
              class="demo-user"
              @click="fillDemoUser(item)"
            >
              <span class="role">{{ item.label }}</span>
              <span class="cred">{{ item.username }} / {{ item.password }}</span>
            </button>
          </div>
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

// 页面标题与版权年份（静态值，无需响应式）
const title = import.meta.env.PUBLIC_TITLE;
const year = new Date().getFullYear();

const demoUsers = [
  { label: "超管", username: "admin", password: "123456" },
  { label: "管理员", username: "common", password: "123456" },
  { label: "用户", username: "user", password: "123456" },
];

let code = "";
const changeCode = (e: string) => {
  code = e;
};

const loginForm = ref({
  username: "",
  password: "",
  captcha: "",
});

const fillDemoUser = (item: { username: string; password: string }) => {
  loginForm.value.username = item.username;
  loginForm.value.password = item.password;
};

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

const handleSubmit = async () => {
  if (!validateForm()) return;
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

/* ========== 左侧品牌区 ========== */
.login-brand {
  flex: 0 0 46%;
  min-width: 440px;
  height: 100%;
  position: relative;
  overflow: hidden;
  color: var(--c-text-theme);
  display: flex;
  flex-direction: column;
  /* 深空蓝渐变：从品牌蓝过渡到深蓝黑，底部最暗，托起光晕层次 */
  background: linear-gradient(160deg, #1d4ed8 0%, #16336e 55%, #0f172a 100%);

  > * {
    position: relative;
    z-index: 1;
  }

  .brand-header {
    display: flex;
    align-items: center;
    padding: var(--space-6) var(--space-6) 0;
    img {
      width: 32px;
      height: 32px;
    }
    .name {
      margin-left: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .brand-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 var(--space-6);
    h2 {
      font-size: 34px;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: 1px;
    }
    p {
      margin-top: var(--space-3);
      font-size: var(--font-size-md);
      color: rgba(255, 255, 255, 0.66);
    }
    .brand-features {
      margin-top: var(--space-6);
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      li {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-md);
        color: rgba(255, 255, 255, 0.85);
        :deep(.el-icon) {
          color: #7da6ff;
        }
      }
    }
  }

  .brand-footer {
    padding: 0 var(--space-6) var(--space-5);
    font-size: var(--font-size-xs);
    color: rgba(255, 255, 255, 0.4);
  }

  /* 光晕：两团低透明度径向渐变，营造空间纵深 */
  .brand-glow {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .brand-glow-1 {
    width: 560px;
    height: 560px;
    right: -180px;
    top: -140px;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.28) 0%,
      transparent 65%
    );
  }
  .brand-glow-2 {
    width: 420px;
    height: 420px;
    left: -140px;
    bottom: -120px;
    background: radial-gradient(
      circle,
      rgba(37, 99, 235, 0.32) 0%,
      transparent 65%
    );
  }

  /* 网格纹理：细线 + 顶部到底部的透明度渐隐，科技感底纹 */
  .brand-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 75%);
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.9),
      transparent 75%
    );
  }
}

/* ========== 右侧表单区 ========== */
.login-form-panel {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: var(--space-6);

  .formInner {
    width: 380px;
    max-width: 100%;

    .top {
      margin-bottom: var(--space-6);
      h3 {
        font-size: 26px;
        font-weight: 700;
        color: var(--c-text);
        letter-spacing: 0.5px;
      }
      p {
        margin-top: var(--space-2);
        font-size: var(--font-size-md);
        color: var(--c-text2);
      }
    }
  }

  :deep(.el-input) {
    margin-top: var(--space-4);
    --el-input-bg-color: #f5f7fa;
    .el-input__wrapper {
      border-radius: var(--radius-md);
    }
  }
  :deep(.el-input__inner),
  :deep(.el-input__prefix),
  :deep(.el-input__suffix),
  :deep(.el-input__wrapper),
  :deep(.el-button) {
    height: 44px;
  }
  :deep(.el-input__prefix) {
    color: var(--c-text2);
  }
  :deep(.el-button) {
    margin-top: var(--space-5);
    width: 100%;
    font-size: var(--font-size-md);
    font-weight: 600;
    letter-spacing: 6px;
    border: none;
    border-radius: var(--radius-md);
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    transition: opacity 0.2s, transform 0.1s;
    &:hover {
      opacity: 0.9;
    }
    &:active {
      transform: scale(0.99);
    }
  }

  /* 演示账号卡片 */
  .demo-card {
    margin-top: var(--space-5);
    padding: var(--space-4) var(--space-2);
    border: 1px dashed var(--c-border);
    border-radius: var(--radius-md);
    background: var(--c-bg-box);
    .demo-title {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--c-text2);
      :deep(.el-icon) {
        color: var(--c-text3);
      }
    }
    .demo-users {
      margin-top: var(--space-2);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
      .demo-user {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding: var(--space-2);
        border: none;
        border-radius: var(--radius-sm);
        background: var(--c-bg);
        cursor: pointer;
        .role {
          font-size: var(--font-size-xs);
          color: var(--c-text3);
          font-weight: 600;
        }
        .cred {
          text-wrap: nowrap;
          font-size: var(--font-size-xs);
          color: var(--c-text2);
        }
      }
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
