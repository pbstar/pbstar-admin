import type { NoticeType } from "@/api/notice";

/** 通知类型下拉选项 + 列表标签展示（两处共用，避免各写一份映射） */
export const noticeTypeOptions: {
  label: string;
  value: NoticeType;
  tag: "primary" | "warning" | "danger";
}[] = [
  { label: "通知", value: "notice", tag: "primary" },
  { label: "待办", value: "todo", tag: "warning" },
  { label: "警告", value: "warning", tag: "danger" },
];

/** 取类型对应的中文名 */
export const getNoticeTypeLabel = (type: NoticeType) =>
  noticeTypeOptions.find((item) => item.value === type)?.label || type;

/** 取类型对应的标签色 */
export const getNoticeTypeTag = (type: NoticeType) =>
  noticeTypeOptions.find((item) => item.value === type)?.tag || "primary";
