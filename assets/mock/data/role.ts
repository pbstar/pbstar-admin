import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 角色记录（navs/btns 为逗号分隔的 id/key 字符串，与真实接口保持一致） */
export interface RoleRecord {
  id: any;
  name: string;
  key: string;
  navs: string;
  btns: string;
}

/** 角色种子数据（key 与用户模块的 role 字段一一对应） */
export const roles: RoleRecord[] = [
  {
    id: 1,
    name: "超级管理员",
    key: "admin",
    navs: "1,2,3,4,5,6,7,8,9,10,11,12",
    btns: "all",
  },
  {
    id: 2,
    name: "普通管理员",
    key: "common",
    navs: "1,2,3,7,8,9",
    btns: "user_add,user_edit,user_view",
  },
  {
    id: 3,
    name: "普通用户",
    key: "user",
    navs: "1,7",
    btns: "user_view",
  },
];

export function getList(data: any) {
  const { pageNumber, pageSize, ...filters } = data || {};
  const filtered = fuzzyFilter(roles, filters);
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total });
}

/** 供下拉选项使用，字段名为 role_key（与真实接口的既有不一致保持一致，不做"修正"） */
export function getAllList() {
  return ok(roles.map((r) => ({ id: r.id, name: r.name, role_key: r.key })));
}

export function getDetail(data: any) {
  const role = findById(roles, data?.id);
  if (!role) return fail("角色不存在");
  return ok(role);
}

export function create(data: any) {
  const role: RoleRecord = {
    id: nextId(),
    name: data?.name || "",
    key: data?.key || "",
    navs: data?.navs || "",
    btns: data?.btns || "",
  };
  roles.push(role);
  return ok(null);
}

export function update(data: any) {
  const role = findById(roles, data?.id);
  if (!role) return fail("角色不存在");
  role.name = data?.name ?? role.name;
  role.key = data?.key ?? role.key;
  role.navs = data?.navs ?? role.navs;
  role.btns = data?.btns ?? role.btns;
  return ok(null);
}

export function deleteRoles(data: any) {
  removeByIdList(roles, data?.idList || []);
  return ok(null);
}
