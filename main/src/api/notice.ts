import request from "@Passets/request";

/** 通知类型（与 system 子应用的通知管理保持一致） */
export type NoticeType = "notice" | "todo" | "warning";

/** 铃铛列表项（在通知记录上附加当前用户的已读状态） */
export interface MyNoticeItem {
  id: number;
  title: string;
  content: string;
  type: NoticeType;
  createTime: string;
  isRead: boolean;
}

/** 当前用户通知列表（最近 N 条，倒序） */
export const getMyNoticeList = (data: { limit?: number } = {}) =>
  request.get<MyNoticeItem[]>({ url: "/main/notice/getMyList", data });

/** 未读数（轮询接口，静默失败避免定时弹错） */
export const getNoticeUnreadCount = () =>
  request.get<{ count: number }>({
    url: "/main/notice/getUnreadCount",
    config: { silent: true },
  });

export const markNoticeRead = (data: { id: number }) =>
  request.post({ url: "/main/notice/markRead", data });

export const markAllNoticeRead = () =>
  request.post({ url: "/main/notice/markAllRead" });
