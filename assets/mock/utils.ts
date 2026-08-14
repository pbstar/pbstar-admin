import type { Res } from "@Passets/utils/request";

let autoId = 10000;

/** 生成自增 mock id（避免与种子数据的固定 id 冲突） */
export function nextId(): number {
  autoId += 1;
  return autoId;
}

/** 成功响应包装 */
export function ok<T>(data: T, msg = "操作成功"): Res<T> {
  return { code: 200, msg, data };
}

/** 失败响应包装 */
export function fail(msg: string): Res<null> {
  return { code: 500, msg, data: null };
}

/**
 * 按分页参数切片
 * @param list 全量数据
 * @param pageNumber 页码，默认 1
 * @param pageSize 每页条数，默认 10
 */
export function paginate<T>(
  list: T[],
  pageNumber = 1,
  pageSize = 10,
): { list: T[]; total: number } {
  const start = (pageNumber - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  };
}

/**
 * 模糊过滤：字段值需存在且包含关键字（大小写不敏感）
 * @param list 全量数据
 * @param filters 字段 -> 关键字，空值/undefined 会被忽略
 */
export function fuzzyFilter<T extends Record<string, any>>(
  list: T[],
  filters: Record<string, any>,
): T[] {
  const entries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "" && v !== null);
  if (!entries.length) return list;
  return list.filter((item) =>
    entries.every(([key, val]) => {
      const itemVal = item[key];
      if (itemVal === undefined || itemVal === null) return false;
      return String(itemVal).toLowerCase().includes(String(val).toLowerCase());
    }),
  );
}

/**
 * 按 idList 从数组中批量删除（原地修改）
 * @param list 数据数组（会被原地修改）
 * @param idList 待删除的 id 列表
 */
export function removeByIdList<T extends { id: any }>(list: T[], idList: any[]): void {
  const idSet = new Set(idList.map(String));
  const keep = list.filter((item) => !idSet.has(String(item.id)));
  list.splice(0, list.length, ...keep);
}

/**
 * 按 id 查找单条记录
 */
export function findById<T extends { id: any }>(list: T[], id: any): T | undefined {
  return list.find((item) => String(item.id) === String(id));
}

/**
 * 判断 createTime（形如 "2026-08-10 09:00:00"）是否为当天
 */
export function isToday(createTime: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return createTime.slice(0, 10) === today;
}
