/** 通知类型（决定列表标签颜色） */
export type NoticeType = "notice" | "todo" | "warning";

/** 通知记录 */
export interface NoticeItem {
  id: number;
  title: string;
  content: string;
  type: NoticeType;
  receiverIds: number[];
  createTime: string;
}

/** 通知列表查询参数：分页必填，title 为可选搜索条件 */
export interface NoticeListParams {
  pageNumber: number;
  pageSize: number;
  title?: string;
}

/** 通知新增/编辑入参 */
export interface NoticePayload {
  id?: number;
  title: string;
  content: string;
  type: NoticeType;
  receiverIds: number[];
}
