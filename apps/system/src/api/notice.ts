import request from "@Passets/request";
import type { PageResult } from "@Passets/request";
import type {
  NoticeItem,
  NoticeListParams,
  NoticePayload,
} from "./notice.types";

export * from "./notice.types";

export const getNoticeList = (data: NoticeListParams) =>
  request.post<PageResult<NoticeItem>>({ url: "/system/notice/getList", data });

export const getNoticeDetail = (data: { id: number }) =>
  request.get<NoticeItem>({ url: "/system/notice/getDetail", data });

export const createNotice = (data: NoticePayload) =>
  request.post({ url: "/system/notice/create", data });

export const updateNotice = (data: NoticePayload) =>
  request.post({ url: "/system/notice/update", data });

export const deleteNotices = (idList: number[]) =>
  request.post({ url: "/system/notice/delete", data: { idList } });
