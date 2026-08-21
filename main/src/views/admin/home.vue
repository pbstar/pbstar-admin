<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { pIcon, pTitle } from "@Pcomponents";
import request from "@Passets/utils/request";
import { useAppsStore } from "@/stores/apps";
import type { AppItem } from "@/stores/apps";

interface RecentLog {
  id: any;
  userName: string;
  method: string;
  path: string;
  createTime: string;
}

interface DashboardStats {
  userCount: number;
  appCount: number;
  roleCount: number;
  todayLoginCount: number;
  recentLogs: RecentLog[];
}

const router = useRouter();
const appsStore = useAppsStore();

const stats = ref<{ icon: string; label: string; value: number }[]>([]);
const recentLogs = ref<RecentLog[]>([]);
const myApps = ref<AppItem[]>([]);

// 拉取仪表盘概览数据（用户/应用/角色/今日登录 + 最近操作日志）
const loadStats = async () => {
  const res = await request.get<DashboardStats>({
    url: "/main/getDashboardStats",
  });
  if (res.code !== 200 || !res.data) return;
  const data = res.data;
  stats.value = [
    { icon: "el-icon-user", label: "用户数", value: data.userCount },
    { icon: "el-icon-grid", label: "应用数", value: data.appCount },
    { icon: "el-icon-avatar", label: "角色数", value: data.roleCount },
    { icon: "el-icon-right", label: "今日登录", value: data.todayLoginCount },
  ];
  recentLogs.value = data.recentLogs;
};

// 跳转到指定应用的第一个可用导航
const toApp = async (app: AppItem) => {
  const isOk = await appsStore.setAppId({ id: app.id });
  if (!isOk) return;
  const current = appsStore.getApp();
  const firstNav = current?.navs?.find((item) => item.url);
  if (firstNav?.url) {
    router.push(firstNav.url);
  }
};

onBeforeMount(() => {
  loadStats();
  myApps.value = appsStore.getApps();
});
</script>

<template>
  <div class="page">
    <div class="stat-grid">
      <div class="stat-card" v-for="item in stats" :key="item.label">
        <div class="iconBox">
          <p-icon :name="item.icon" size="22" />
        </div>
        <div class="info">
          <div class="num">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div class="panel-grid">
      <div class="panel">
        <p-title :list="['最近操作日志']" />
        <div class="log-list">
          <div class="log-item" v-for="log in recentLogs" :key="log.id">
            <span class="user">{{ log.userName }}</span>
            <span class="method">{{ log.method }}</span>
            <span class="path">{{ log.path }}</span>
            <span class="time">{{ log.createTime }}</span>
          </div>
          <el-empty v-if="!recentLogs.length" description="暂无操作日志" />
        </div>
      </div>
      <div class="panel">
        <p-title :list="['我的应用']" />
        <div class="app-list">
          <div
            class="app-item"
            v-for="app in myApps"
            :key="app.id"
            @click="toApp(app)"
          >
            <div class="iconBox">
              <p-icon :name="app.icon" size="18" />
            </div>
            <span class="name">{{ app.name }}</span>
            <p-icon class="arrow" name="el-icon-ArrowRight" size="14" />
          </div>
          <el-empty v-if="!myApps.length" description="暂无应用" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  height: 100%;
  padding: var(--space-3);
  overflow-y: auto;
  background: var(--c-bg);
  border-radius: var(--radius-md);

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-md);
    background: var(--c-bg);
    border: 1px solid var(--c-border-light);

    .iconBox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--c-bg-theme-tint);
      color: var(--c-text3);
      flex-shrink: 0;
    }

    .info {
      .num {
        font-size: 24px;
        font-weight: 700;
        color: var(--c-text);
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
      }
      .label {
        font-size: var(--font-size-sm);
        color: var(--c-text2);
        margin-top: 2px;
      }
    }
  }

  .panel-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-3);
  }

  .panel {
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--c-bg);
    border: 1px solid var(--c-border);
  }

  .log-list {
    margin-top: var(--space-2);

    .log-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) 0;
      font-size: var(--font-size-sm);
      color: var(--c-text2);
      border-bottom: 1px solid var(--c-border-light);

      &:last-child {
        border-bottom: none;
      }

      .user {
        color: var(--c-text);
        font-weight: 500;
      }
      .method {
        color: var(--c-text3);
      }
      .path {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        flex-shrink: 0;
      }
    }
  }

  .app-list {
    margin-top: var(--space-2);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);

    .app-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2);
      border-radius: var(--radius-sm);
      color: var(--c-text);
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover {
        background: var(--c-menu-hover-bg);

        .arrow {
          color: var(--c-text3);
          transform: translateX(2px);
        }
      }

      .iconBox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: var(--radius-sm);
        background: var(--c-bg-theme-tint);
        color: var(--c-text3);
        flex-shrink: 0;
      }

      .name {
        flex: 1;
        font-size: var(--font-size-sm);
      }

      .arrow {
        color: var(--c-text2);
        transition: color 0.15s, transform 0.15s;
      }
    }
  }
}
</style>
