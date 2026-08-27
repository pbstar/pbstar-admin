import request from "@Passets/request";
import type { PageResult } from "@Passets/request";
import type {
  RoleItem,
  RoleOption,
  RoleListParams,
  RolePayload,
} from "./role.types";

export * from "./role.types";

export const getRoleList = (data: RoleListParams) =>
  request.post<PageResult<RoleItem>>({ url: "/system/role/getList", data });

export const getAllRoles = () =>
  request.get<RoleOption[]>({ url: "/system/role/getAllList" });

export const getRoleDetail = (data: { id: number }) =>
  request.get<RoleItem>({ url: "/system/role/getDetail", data });

export const createRole = (data: RolePayload) =>
  request.post({ url: "/system/role/create", data });

export const updateRole = (data: RolePayload) =>
  request.post({ url: "/system/role/update", data });

export const deleteRoles = (idList: number[]) =>
  request.post({ url: "/system/role/delete", data: { idList } });
