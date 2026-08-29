import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 角色记录（permissions 为逗号分隔的权限 key 字符串，"all" 表示全量放行，与真实接口保持一致） */
export interface RoleRecord {
  id: number;
  name: string;
  key: string;
  permissions: string;
}

/** 角色种子数据（key 与用户模块的 role 字段一一对应） */
export const roles: RoleRecord[] = [
  {
    id: 1,
    name: "超级管理员",
    key: "admin",
    permissions: "all",
  },
  {
    id: 2,
    name: "普通管理员",
    key: "common",
    permissions:
      "system_user,user_add,user_edit,user_view,system_role,example_list,example_echarts,example_editorMd",
  },
  {
    id: 3,
    name: "普通用户",
    key: "user",
    permissions: "system_user,user_view,example_list",
  },
];

/** 角色列表查询参数（分页 + 可选搜索条件） */
export interface RoleListQuery {
  pageNumber?: number;
  pageSize?: number;
  name?: string;
  key?: string;
}

/** 角色新增/更新入参 */
export interface RolePayload {
  id?: number;
  name?: string;
  key?: string;
  permissions?: string;
}

export function getList(data: RoleListQuery = {}) {
  const { pageNumber, pageSize, name, key } = data;
  const filters: Record<string, unknown> = { name, key };
  const filtered = fuzzyFilter(roles, filters);
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total });
}

/** 供下拉选项使用，字段名为 role_key（与真实接口的既有不一致保持一致，不做"修正"） */
export function getAllList() {
  return ok(roles.map((r) => ({ id: r.id, name: r.name, role_key: r.key })));
}

export function getDetail(data: { id: number }) {
  const role = findById(roles, data?.id);
  if (!role) return fail("角色不存在");
  return ok(role);
}

export function create(data: RolePayload) {
  const role: RoleRecord = {
    id: nextId(roles),
    name: data?.name || "",
    key: data?.key || "",
    permissions: data?.permissions || "",
  };
  roles.push(role);
  return ok(null);
}

export function update(data: RolePayload) {
  if (!data.id) return fail("角色不存在");
  const role = findById(roles, data.id);
  if (!role) return fail("角色不存在");
  role.name = data?.name ?? role.name;
  role.key = data?.key ?? role.key;
  role.permissions = data?.permissions ?? role.permissions;
  return ok(null);
}

export function deleteRoles(data: { idList?: number[] }) {
  removeByIdList(roles, data?.idList || []);
  return ok(null);
}
