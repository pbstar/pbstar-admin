<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { pIcon } from "@Pcomponents";
import {
  getMyNoticeList,
  getNoticeUnreadCount,
  markNoticeRead,
  markAllNoticeRead,
} from "@/api/notice";
import type { MyNoticeItem } from "@/api/notice";

/** 轮询间隔：通知非实时场景，10 分钟足够，避免无谓请求 */
const POLL_INTERVAL = 10 * 60 * 1000;

const unreadCount = ref(0);
const noticeList = ref<MyNoticeItem[]>([]);
const loading = ref(false);

let timer: ReturnType<typeof setInterval> | null = null;

/** 相对时间展示（避免为单个场景引入 dayjs 的 relativeTime 插件） */
const formatTime = (time: string) => {
  const target = new Date(time.replace(/-/g, "/")).getTime();
  if (Number.isNaN(target)) return time;
  const diff = Date.now() - target;
  if (diff < 60 * 1000) return "刚刚";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} 分钟前`;
  if (diff < 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (60 * 60 * 1000))} 小时前`;
  if (diff < 7 * 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} 天前`;
  return time.slice(0, 10);
};

const fetchUnreadCount = () => {
  getNoticeUnreadCount()
    .then((res) => {
      if (res?.code === 200) unreadCount.value = res.data.count;
    })
    .catch(() => {});
};

const fetchList = () => {
  loading.value = true;
  getMyNoticeList()
    .then((res) => {
      if (res?.code === 200) noticeList.value = res.data;
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
};

/** 打开弹层时拉全量列表，未读数与列表都以服务端为准 */
const handleBeforeEnter = () => {
  fetchUnreadCount();
  fetchList();
};

const handleRead = (item: MyNoticeItem) => {
  if (item.isRead) return;
  // 乐观更新：先改本地，失败再回滚，避免点击后要等一次往返
  item.isRead = true;
  unreadCount.value = Math.max(0, unreadCount.value - 1);
  markNoticeRead({ id: item.id }).catch(() => {
    item.isRead = false;
    unreadCount.value += 1;
  });
};

const handleReadAll = () => {
  if (!unreadCount.value) return;
  // 乐观更新：先全部置为已读，失败则重新拉取以回到服务端真实状态
  noticeList.value.forEach((item) => (item.isRead = true));
  unreadCount.value = 0;
  markAllNoticeRead().catch(() => {
    fetchUnreadCount();
    fetchList();
  });
};

const startPolling = () => {
  stopPolling();
  timer = setInterval(fetchUnreadCount, POLL_INTERVAL);
};
const stopPolling = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

/** 后台标签页暂停轮询，切回前台立即补拉一次，避免无效请求与信息滞后 */
const handleVisibilityChange = () => {
  if (document.hidden) {
    stopPolling();
  } else {
    fetchUnreadCount();
    startPolling();
  }
};

onMounted(() => {
  fetchUnreadCount();
  startPolling();
  document.addEventListener("visibilitychange", handleVisibilityChange);
});

onUnmounted(() => {
  stopPolling();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
  <el-popover trigger="click" :width="320" @before-enter="handleBeforeEnter">
    <template #reference>
      <div class="bellBox">
        <el-badge
          :value="unreadCount"
          :hidden="unreadCount === 0"
          :max="99"
          type="danger"
        >
          <p-icon class="bell" name="el-icon-Bell" size="18" />
        </el-badge>
      </div>
    </template>

    <div class="notice">
      <div class="head">
        <span class="title">通知</span>
        <el-button
          type="primary"
          size="small"
          link
          :disabled="unreadCount === 0"
          @click="handleReadAll"
          >全部已读</el-button
        >
      </div>
      <div v-loading="loading" class="list">
        <el-empty v-if="!noticeList.length" :image-size="60" description="暂无通知" />
        <div
          v-for="item in noticeList"
          :key="item.id"
          class="item"
          @click="handleRead(item)"
        >
          <div class="itemHead">
            <span class="dot" v-if="!item.isRead"></span>
            <span class="itemTitle">{{ item.title }}</span>
            <span class="time">{{ formatTime(item.createTime) }}</span>
          </div>
          <div class="content">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
.bellBox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;

  .bell {
    color: var(--c-text-theme);
  }
}
.bellBox:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.notice {
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--c-border);

    .title {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--c-text);
    }
  }
  .list {
    max-height: 320px;
    overflow-y: auto;

    .item {
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--c-border);
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: var(--c-bg-box);
      }
      .itemHead {
        display: flex;
        align-items: center;

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--el-color-danger);
          margin-right: var(--space-1);
          flex-shrink: 0;
        }
        .itemTitle {
          flex: 1;
          font-size: var(--font-size-sm);
          color: var(--c-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .time {
          margin-left: var(--space-2);
          font-size: var(--font-size-xs);
          color: var(--c-text2);
          flex-shrink: 0;
        }
      }
      .content {
        margin-top: 2px;
        font-size: var(--font-size-xs);
        color: var(--c-text2);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
