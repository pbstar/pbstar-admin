import dayjs from "dayjs";
import {
  ok,
  fail,
  paginate,
  fuzzyFilter,
  removeByIdList,
  findById,
  nextId,
} from "../utils";
import { getCurrentUserId } from "./main";

/**
 * 通知记录：定向发送，receiverIds 为接收人用户 id 列表
 * 已读状态不挂在通知上（一条通知对应多人），单独存于 noticeReads 关联表
 */
export interface NoticeRecord {
  id: number;
  title: string;
  content: string;
  type: "notice" | "todo" | "warning";
  receiverIds: number[];
  createTime: string;
}

/** 已读关联记录（通知 + 人 唯一） */
export interface NoticeReadRecord {
  id: number;
  noticeId: number;
  userId: number;
  readTime: string;
}

/** 通知种子数据：覆盖三个内置用户，保证各账号登录后都有未读可看 */
export const notices: NoticeRecord[] = [
  {
    id: 1,
    title: "系统将于本周六凌晨维护",
    content:
      "本周六 02:00 - 04:00 将进行数据库升级维护，期间后台服务暂停使用，请提前保存工作内容。",
    type: "warning",
    receiverIds: [1, 2, 3],
    createTime: "2026-09-08 09:30:00",
  },
  {
    id: 2,
    title: "新版权限管理已上线",
    content:
      "权限模型已合并菜单与按钮，各子应用菜单改为前端硬编码维护，详情见项目文档。",
    type: "notice",
    receiverIds: [1, 2, 3],
    createTime: "2026-09-07 14:20:00",
  },
  {
    id: 3,
    title: "请完善个人资料",
    content: "为方便同事联系，请尽快在「个人资料」中补充头像与真实姓名。",
    type: "todo",
    receiverIds: [2, 3],
    createTime: "2026-09-06 10:00:00",
  },
  {
    id: 4,
    title: "季度考核待提交",
    content: "第三季度考核材料请于本月 15 日前提交至直属主管。",
    type: "todo",
    receiverIds: [1],
    createTime: "2026-09-05 16:45:00",
  },
  {
    id: 5,
    title: "数据大屏功能灰度开放",
    content: "example 应用的数据大屏已对管理员开放，欢迎试用并反馈问题。",
    type: "notice",
    receiverIds: [1, 2],
    createTime: "2026-09-04 11:10:00",
  },
];

/** 已读种子数据：让列表同时存在已读/未读两种状态 */
export const noticeReads: NoticeReadRecord[] = [
  { id: 1, noticeId: 2, userId: 1, readTime: "2026-09-07 15:00:00" },
  { id: 2, noticeId: 1, userId: 2, readTime: "2026-09-08 10:00:00" },
  { id: 3, noticeId: 5, userId: 1, readTime: "2026-09-04 12:00:00" },
];

/** 通知列表查询参数（分页 + 标题模糊搜索） */
export interface NoticeListQuery {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
}

/** 通知新增/更新入参 */
export interface NoticePayload {
  id?: number;
  title?: string;
  content?: string;
  type?: NoticeRecord["type"];
  receiverIds?: number[];
}

const now = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

/** 是否已读：存在对应的关联记录 */
const isReadBy = (noticeId: number, userId: number) =>
  noticeReads.some((r) => r.noticeId === noticeId && r.userId === userId);

/** 给通知附加当前用户的已读状态 */
const withReadFlag = (notice: NoticeRecord, userId: number) => ({
  ...notice,
  isRead: isReadBy(notice.id, userId),
});

/** 通知管理列表：全量（不按接收人过滤），标题模糊搜索 + 分页 */
export function getList(data: NoticeListQuery = {}) {
  const { pageNumber, pageSize, title } = data;
  const filters: Record<string, unknown> = { title };
  const filtered = fuzzyFilter(notices, filters);
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total });
}

export function getDetail(data: { id: number }) {
  const notice = findById(notices, data?.id);
  if (!notice) return fail("通知不存在");
  return ok(notice);
}

export function create(data: NoticePayload) {
  const notice: NoticeRecord = {
    id: nextId(notices),
    title: data?.title || "",
    content: data?.content || "",
    type: data?.type || "notice",
    receiverIds: data?.receiverIds || [],
    createTime: now(),
  };
  notices.push(notice);
  return ok(null);
}

export function update(data: NoticePayload) {
  if (!data.id) return fail("通知不存在");
  const notice = findById(notices, data.id);
  if (!notice) return fail("通知不存在");
  notice.title = data?.title ?? notice.title;
  notice.content = data?.content ?? notice.content;
  notice.type = data?.type ?? notice.type;
  notice.receiverIds = data?.receiverIds ?? notice.receiverIds;
  return ok(null);
}

export function deleteNotices(data: { idList?: number[] }) {
  const idList = data?.idList || [];
  removeByIdList(notices, idList);
  // 同步清理孤儿已读记录，避免残留数据影响后续未读数统计
  const idSet = new Set(idList);
  const keep = noticeReads.filter((r) => !idSet.has(r.noticeId));
  noticeReads.splice(0, noticeReads.length, ...keep);
  return ok(null);
}

/** 当前用户可见的通知：接收人命中，按创建时间倒序，默认取最近 10 条 */
export function getMyList(data: { limit?: number } = {}) {
  const userId = getCurrentUserId();
  if (!userId) return fail("登录已失效，请重新登录");
  const list = notices
    .filter((n) => n.receiverIds.includes(userId))
    .sort((a, b) => b.createTime.localeCompare(a.createTime))
    .slice(0, data?.limit || 10)
    .map((n) => withReadFlag(n, userId));
  return ok(list);
}

/** 当前用户未读数（铃铛轮询接口，响应体保持最小） */
export function getUnreadCount() {
  const userId = getCurrentUserId();
  if (!userId) return fail("登录已失效，请重新登录");
  const count = notices.filter(
    (n) => n.receiverIds.includes(userId) && !isReadBy(n.id, userId),
  ).length;
  return ok({ count });
}

/** 单条标记已读（重复标记幂等） */
export function markRead(data: { id: number }) {
  const userId = getCurrentUserId();
  if (!userId) return fail("登录已失效，请重新登录");
  const notice = findById(notices, data?.id);
  if (!notice) return fail("通知不存在");
  if (!notice.receiverIds.includes(userId)) return fail("无权操作该通知");
  if (!isReadBy(notice.id, userId)) {
    noticeReads.push({
      id: nextId(noticeReads),
      noticeId: notice.id,
      userId,
      readTime: now(),
    });
  }
  return ok(null);
}

/** 当前用户全部标记已读 */
export function markAllRead() {
  const userId = getCurrentUserId();
  if (!userId) return fail("登录已失效，请重新登录");
  notices
    .filter((n) => n.receiverIds.includes(userId) && !isReadBy(n.id, userId))
    .forEach((n) => {
      noticeReads.push({
        id: nextId(noticeReads),
        noticeId: n.id,
        userId,
        readTime: now(),
      });
    });
  return ok(null);
}
