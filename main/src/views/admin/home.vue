<script setup>
import { pIcon } from "@Pcomponents";

// 打开外部链接
const toPath = (path) => {
  window.open(path);
};
</script>
<template>
  <div class="page">
    <div class="welcome-container">
      <div class="logo-text">
        <span>欢迎使用</span>
        <span class="gradient-text">PbstarAdmin</span>
        <span>微后台</span>
      </div>
      <div class="description">现代化、模块化、轻便化的后台管理解决方案</div>
    </div>
    <div class="btns">
      <el-button
        type="primary"
        size="large"
        @click="toPath('http://pbstar-admin-docs.pbstar.cn')"
      >
        <p-icon name="el-icon-document" class="icon" />
        官方文档
      </el-button>
      <el-button
        size="large"
        @click="toPath('https://github.com/pbstar/pbstar-admin')"
      >
        <p-icon name="el-icon-star" class="icon" />
        GitHub
      </el-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding-bottom: 120px;
  justify-content: center;
  align-items: center;
  background: var(--c-bg);

  .welcome-container {
    text-align: center;

    .logo-text {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 24px;
      line-height: 24px;
      color: var(--c-text2);

      .gradient-text {
        font-size: 48px;
        line-height: 48px;
        font-weight: bold;
        margin: 0 12px -4px;
        background: linear-gradient(
          135deg,
          var(--c-text3) 0%,
          var(--c-bg-theme-light) 40%,
          var(--c-bg-theme) 100%
        );
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .description {
      font-size: 16px;
      color: var(--c-text2);
      opacity: 0.8;
    }
  }

  .btns {
    margin-top: 60px;
    display: flex;

    .icon {
      margin-right: 5px;
    }
  }

  // 响应式布局
  @media (max-width: 700px) {
    .welcome-container {
      .logo-text {
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        line-height: 18px;

        .gradient-text {
          font-size: 32px;
          line-height: 32px;
          margin: 8px 0;
        }
      }

      .description {
        font-size: 14px;
        padding: 0 20px;
      }
    }

    .btns {
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-top: 40px;

      .el-button {
        width: 200px;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }
}
</style>
