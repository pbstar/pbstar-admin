import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 操作日志记录 */
export interface LogRecord {
  id: any;
  userName: string;
  method: string;
  path: string;
  ip: string;
  param: string;
  createTime: string;
}

export const logs: LogRecord[] = [
  {
    id: 1,
    userName: "admin",
    method: "POST",
    path: "/main/login",
    ip: "127.0.0.1",
    param: '{"username":"admin"}',
    createTime: "2026-08-10 09:00:00",
  },
  {
    id: 2,
    userName: "admin",
    method: "POST",
    path: "/system/user/create",
    ip: "127.0.0.1",
    param: '{"name":"张三","username":"zhangsan"}',
    createTime: "2026-08-11 10:20:00",
  },
  {
    id: 3,
    userName: "common",
    method: "POST",
    path: "/system/role/update",
    ip: "192.168.1.10",
    param: '{"id":2,"name":"普通管理员"}',
    createTime: "2026-08-12 15:45:00",
  },
];

export function getList(data: any) {
  const { pageNumber, pageSize, createTime, ...filters } = data || {};
  let filtered = fuzzyFilter(logs, filters);
  if (Array.isArray(createTime) && createTime.length === 2) {
    const [start, end] = createTime;
    filtered = filtered.filter((item) => {
      const date = item.createTime.slice(0, 10);
      return date >= start && date <= end;
    });
  }
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total });
}

export function getDetail(data: any) {
  const log = findById(logs, data?.id);
  if (!log) return fail("日志不存在");
  return ok(log);
}

export function create(data: any) {
  const log: LogRecord = {
    id: nextId(),
    userName: data?.userName || "",
    method: data?.method || "",
    path: data?.path || "",
    ip: data?.ip || "",
    param: data?.param || "",
    createTime: data?.createTime || "",
  };
  logs.push(log);
  return ok(null);
}

export function update(data: any) {
  const log = findById(logs, data?.id);
  if (!log) return fail("日志不存在");
  log.userName = data?.userName ?? log.userName;
  log.method = data?.method ?? log.method;
  log.path = data?.path ?? log.path;
  log.ip = data?.ip ?? log.ip;
  log.param = data?.param ?? log.param;
  log.createTime = data?.createTime ?? log.createTime;
  return ok(null);
}

export function deleteLogs(data: any) {
  removeByIdList(logs, data?.idList || []);
  return ok(null);
}
