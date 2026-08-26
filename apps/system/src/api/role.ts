import request from "@Passets/request";
import type { PageResult } from "@Passets/request";

/** 角色记录（permissions 为逗号分隔的权限 key 字符串，"all" 表示全量放行） */
export interface RoleItem {
  id: number;
  name: string;
  key: string;
  permissions: string;
}

/** 角色下拉选项（getAllList 返回，字段名 role_key 与真实接口保持一致） */
export interface RoleOption {
  id: number;
  name: string;
  role_key: string;
}

/** 角色列表查询参数：分页必填，其余为可选搜索条件 */
export interface RoleListParams extends Record<string, any> {
  pageNumber: number;
  pageSize: number;
}

export const getRoleList = (data: RoleListParams) =>
  request.post<PageResult<RoleItem>>({ url: "/system/role/getList", data });

export const getAllRoles = () =>
  request.get<RoleOption[]>({ url: "/system/role/getAllList" });

export const getRoleDetail = (data: { id: number }) =>
  request.get<RoleItem>({ url: "/system/role/getDetail", data });

export const createRole = (data: Record<string, any>) =>
  request.post({ url: "/system/role/create", data });

export const updateRole = (data: Record<string, any>) =>
  request.post({ url: "/system/role/update", data });

export const deleteRoles = (idList: (string | number)[]) =>
  request.post({ url: "/system/role/delete", data: { idList } });
