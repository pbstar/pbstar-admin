import {
  ok,
  fail,
  fuzzyFilter,
  removeByIdList,
  findById,
  nextId,
} from "../utils";

/**
 * 权限记录：分组(group)/菜单(menu)/按钮(button) 统一存储，用 type 区分
 * - group：纯展示容器，用于后台权限管理页把同模块的 menu/button 归拢展示，不参与任何权限判断
 * - menu/button：groupId 归属分组，key 是权限判断的唯一标识，需与前端硬编码菜单/按钮的 key 保持一致
 * 菜单的展示信息（url/icon/层级/排序）不在此维护，交由各子应用前端硬编码（见 constants/menus.ts），
 * 本表只承载"权限点清单"，与真实菜单结构解耦
 */
export interface PermissionRecord {
  id: number;
  appKey: string;
  type: "group" | "menu" | "button";
  groupId: number; // menu/button 归属的分组 id；group 类型本身为 0（无归属）
  key: string; // 权限标识；group 不参与权限判断，留空
  name: string;
  remark: string;
}

/** 权限种子数据：system 应用（appKey=system）+ example 应用（appKey=example） */
export const permissions: PermissionRecord[] = [
  // ---- system 应用：分组 ----
  {
    id: 1,
    appKey: "system",
    type: "group",
    groupId: 0,
    key: "",
    name: "用户管理",
    remark: "",
  },
  {
    id: 2,
    appKey: "system",
    type: "group",
    groupId: 0,
    key: "",
    name: "角色管理",
    remark: "",
  },
  {
    id: 3,
    appKey: "system",
    type: "group",
    groupId: 0,
    key: "",
    name: "权限管理",
    remark: "",
  },
  // ---- 用户管理组 ----
  {
    id: 6,
    appKey: "system",
    type: "menu",
    groupId: 1,
    key: "system_user",
    name: "用户管理",
    remark: "",
  },
  {
    id: 7,
    appKey: "system",
    type: "button",
    groupId: 1,
    key: "user_add",
    name: "新增",
    remark: "",
  },
  {
    id: 8,
    appKey: "system",
    type: "button",
    groupId: 1,
    key: "user_edit",
    name: "编辑",
    remark: "",
  },
  {
    id: 9,
    appKey: "system",
    type: "button",
    groupId: 1,
    key: "user_view",
    name: "查看",
    remark: "",
  },
  {
    id: 10,
    appKey: "system",
    type: "button",
    groupId: 1,
    key: "user_delete",
    name: "删除",
    remark: "",
  },
  // ---- 角色管理组 ----
  {
    id: 11,
    appKey: "system",
    type: "menu",
    groupId: 2,
    key: "system_role",
    name: "角色管理",
    remark: "",
  },
  {
    id: 12,
    appKey: "system",
    type: "button",
    groupId: 2,
    key: "role_add",
    name: "新增",
    remark: "",
  },
  {
    id: 13,
    appKey: "system",
    type: "button",
    groupId: 2,
    key: "role_edit",
    name: "编辑",
    remark: "",
  },
  {
    id: 14,
    appKey: "system",
    type: "button",
    groupId: 2,
    key: "role_delete",
    name: "删除",
    remark: "",
  },
  // ---- 权限管理组：暂无按钮 ----
  {
    id: 15,
    appKey: "system",
    type: "menu",
    groupId: 3,
    key: "system_permission",
    name: "权限管理",
    remark: "",
  },
  // ---- example 应用：分组 ----
  {
    id: 18,
    appKey: "example",
    type: "group",
    groupId: 0,
    key: "",
    name: "用户列表",
    remark: "",
  },
  {
    id: 19,
    appKey: "example",
    type: "group",
    groupId: 0,
    key: "",
    name: "图表",
    remark: "",
  },
  {
    id: 20,
    appKey: "example",
    type: "group",
    groupId: 0,
    key: "",
    name: "Markdown编辑器",
    remark: "",
  },
  {
    id: 21,
    appKey: "example",
    type: "group",
    groupId: 0,
    key: "",
    name: "富文本编辑器",
    remark: "",
  },
  {
    id: 22,
    appKey: "example",
    type: "group",
    groupId: 0,
    key: "",
    name: "数据大屏",
    remark: "",
  },
  // ---- example 应用：菜单 ----
  {
    id: 23,
    appKey: "example",
    type: "menu",
    groupId: 18,
    key: "example_list",
    name: "用户列表",
    remark: "",
  },
  {
    id: 24,
    appKey: "example",
    type: "menu",
    groupId: 19,
    key: "example_echarts",
    name: "图表",
    remark: "",
  },
  {
    id: 25,
    appKey: "example",
    type: "menu",
    groupId: 20,
    key: "example_editorMd",
    name: "Markdown编辑器",
    remark: "",
  },
  {
    id: 26,
    appKey: "example",
    type: "menu",
    groupId: 21,
    key: "example_editorRt",
    name: "富文本编辑器",
    remark: "",
  },
  {
    id: 27,
    appKey: "example",
    type: "menu",
    groupId: 22,
    key: "example_bigScreen",
    name: "数据大屏",
    remark: "",
  },
];

export function getList(data: any) {
  const { appKey, type, groupId, ...filters } = data || {};
  let filtered = permissions;
  if (appKey !== undefined && appKey !== "") {
    filtered = filtered.filter((item) => item.appKey === appKey);
  }
  if (type !== undefined && type !== "") {
    filtered = filtered.filter((item) => item.type === type);
  }
  if (groupId !== undefined && groupId !== "") {
    filtered = filtered.filter(
      (item) => String(item.groupId) === String(groupId),
    );
  }
  filtered = fuzzyFilter(filtered, filters);
  return ok(filtered);
}

export function getDetail(data: any) {
  const permission = findById(permissions, data?.id);
  if (!permission) return fail("权限不存在");
  return ok(permission);
}

export function create(data: any) {
  const permission: PermissionRecord = {
    id: nextId(permissions),
    appKey: data?.appKey || "",
    type: data?.type || "menu",
    groupId: data?.type === "group" ? 0 : (data?.groupId ?? 0),
    key: data?.type === "group" ? "" : data?.key || "",
    name: data?.name || "",
    remark: data?.remark || "",
  };
  permissions.push(permission);
  return ok(null);
}

export function update(data: any) {
  const permission = findById(permissions, data?.id);
  if (!permission) return fail("权限不存在");
  permission.appKey = data?.appKey ?? permission.appKey;
  permission.name = data?.name ?? permission.name;
  permission.remark = data?.remark ?? permission.remark;
  if (permission.type !== "group") {
    permission.groupId = data?.groupId ?? permission.groupId;
    permission.key = data?.key ?? permission.key;
  }
  return ok(null);
}

export function deletePermissions(data: any) {
  removeByIdList(permissions, data?.idList || []);
  return ok(null);
}
