import request from "@Passets/request";
import type { PageResult } from "@Passets/request";
import type {
  UserItem,
  UserListParams,
  UserOption,
  UserPayload,
} from "./user.types";

export * from "./user.types";

export const getUserList = (data: UserListParams) =>
  request.post<PageResult<UserItem>>({ url: "/system/user/getList", data });

/** 全部用户下拉数据（只含 id/name，供选择接收人等场景） */
export const getAllUsers = () =>
  request.get<UserOption[]>({ url: "/system/user/getAllList" });

export const getUserDetail = (data: { id: number }) =>
  request.get<UserItem>({ url: "/system/user/getDetail", data });

export const createUser = (data: UserPayload) =>
  request.post({ url: "/system/user/create", data });

export const updateUser = (data: UserPayload) =>
  request.post({ url: "/system/user/update", data });

export const deleteUsers = (idList: number[]) =>
  request.post({ url: "/system/user/delete", data: { idList } });
