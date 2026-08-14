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
        <p-icon :name="item.icon" size="24" class="icon" />
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
            <p-icon :name="app.icon" size="20" class="icon" />
            <span class="name">{{ app.name }}</span>
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
  padding: 16px;
  overflow-y: auto;
  background: var(--c-bg);

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border-radius: 8px;
    background: var(--c-bg-box);

    .icon {
      color: var(--c-text3);
    }

    .info {
      .num {
        font-size: 24px;
        font-weight: bold;
        color: var(--c-text);
        line-height: 1.2;
      }
      .label {
        font-size: 13px;
        color: var(--c-text2);
        margin-top: 4px;
      }
    }
  }

  .panel-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
  }

  .panel {
    padding: 16px;
    border-radius: 8px;
    background: var(--c-bg-box);
  }

  .log-list {
    margin-top: 12px;

    .log-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      font-size: 13px;
      color: var(--c-text2);
      border-bottom: 1px solid var(--c-border);

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
    margin-top: 12px;

    .app-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 8px;
      border-radius: 6px;
      color: var(--c-text);
      cursor: pointer;

      &:hover {
        background: var(--c-menu-hover-bg);
      }

      .icon {
        color: var(--c-text3);
      }
    }
  }

}
</style>
