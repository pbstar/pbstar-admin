import request from "@Passets/request";

/** 权限记录：分组/菜单/按钮统一存储，type 区分 */
export interface PermissionItem {
  id: number;
  appKey: string;
  type: "group" | "menu" | "button";
  groupId: number;
  key: string;
  name: string;
  remark: string;
}

/** 权限列表查询参数：appKey/type 精确过滤，其余为可选搜索条件 */
export interface PermissionListParams {
  appKey?: string;
  type?: string;
  groupId?: number;
  name?: string;
  remark?: string;
}

/** 权限新增/编辑入参 */
export interface PermissionPayload {
  id?: number;
  appKey?: string;
  type?: "group" | "menu" | "button";
  groupId?: number;
  key?: string;
  name?: string;
  remark?: string;
}

export const getPermissionList = (data?: PermissionListParams) =>
  request.post<PermissionItem[]>({ url: "/system/permission/getList", data });

export const getPermissionDetail = (data: { id: number }) =>
  request.get<PermissionItem>({ url: "/system/permission/getDetail", data });

export const createPermission = (data: PermissionPayload) =>
  request.post({ url: "/system/permission/create", data });

export const updatePermission = (data: PermissionPayload) =>
  request.post({ url: "/system/permission/update", data });

export const deletePermissions = (idList: number[]) =>
  request.post({ url: "/system/permission/delete", data: { idList } });
