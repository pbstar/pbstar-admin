import { ok, fail, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 应用记录（id 与 nav 种子数据的 appId 对应） */
export interface AppRecord {
  id: any;
  name: string;
  group: string;
  key: string;
  icon: string;
}

export const apps: AppRecord[] = [
  { id: 1, name: "系统管理", group: "内置应用", key: "system", icon: "el-icon-setting" },
  { id: 2, name: "示例应用", group: "内置应用", key: "example", icon: "el-icon-menu" },
];

export function getList(data: any) {
  return ok(fuzzyFilter(apps, data || {}));
}

export function getDetail(data: any) {
  const app = findById(apps, data?.id);
  if (!app) return fail("应用不存在");
  return ok(app);
}

export function create(data: any) {
  const app: AppRecord = {
    id: nextId(),
    name: data?.name || "",
    group: data?.group || "",
    key: data?.key || "",
    icon: data?.icon || "",
  };
  apps.push(app);
  return ok(null);
}

export function update(data: any) {
  const app = findById(apps, data?.id);
  if (!app) return fail("应用不存在");
  app.name = data?.name ?? app.name;
  app.group = data?.group ?? app.group;
  app.key = data?.key ?? app.key;
  app.icon = data?.icon ?? app.icon;
  return ok(null);
}

export function deleteApps(data: any) {
  removeByIdList(apps, data?.idList || []);
  return ok(null);
}
