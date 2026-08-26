<script setup lang="ts">
import { pIcon } from "@Pcomponents";

defineProps<{ title: string; year: number }>();
</script>

<template>
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
</template>

<style scoped lang="scss">
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

@media (max-width: 860px) {
  .login-brand {
    display: none;
  }
}
</style>
