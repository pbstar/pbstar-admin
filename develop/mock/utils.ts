import type { Res } from "@Passets/request";

/** 生成自增 mock id：取数组当前最大 id + 1，避免与种子数据冲突，也无需维护额外状态 */
export function nextId(list: { id: number }[]): number {
  return list.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}

export function ok<T>(data: T, msg = "操作成功"): Res<T> {
  return { code: 200, msg, data };
}

export function fail(msg: string): Res<null> {
  return { code: 500, msg, data: null };
}

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
 * @param filters 字段 -> 关键字，空值/undefined 会被忽略
 */
export function fuzzyFilter<T>(
  list: T[],
  filters: Record<string, unknown>,
): T[] {
  const entries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "" && v !== null);
  if (!entries.length) return list;
  return list.filter((item) =>
    entries.every(([key, val]) => {
      // 泛型 T 无索引签名，按记录读取字段值（搜索字段为动态键名）
      const itemVal = (item as Record<string, unknown>)[key];
      if (itemVal === undefined || itemVal === null) return false;
      return String(itemVal).toLowerCase().includes(String(val).toLowerCase());
    }),
  );
}

/**
 * 按 idList 从数组中批量删除（原地修改）
 */
export function removeByIdList(list: { id: number }[], idList: number[]): void {
  const idSet = new Set(idList);
  const keep = list.filter((item) => !idSet.has(item.id));
  list.splice(0, list.length, ...keep);
}

export function findById<T extends { id: number }>(list: T[], id: number): T | undefined {
  return list.find((item) => item.id === id);
}

/**
 * 判断 createTime（形如 "2026-08-10 09:00:00"）是否为当天
 */
export function isToday(createTime: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return createTime.slice(0, 10) === today;
}
