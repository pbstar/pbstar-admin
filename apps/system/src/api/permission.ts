import request from "@Passets/request";
import type {
  PermissionItem,
  PermissionListParams,
  PermissionPayload,
} from "./permission.types";

export * from "./permission.types";

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
