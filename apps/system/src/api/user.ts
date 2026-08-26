import request from "@Passets/request";
import type { PageResult } from "@Passets/request";

/** 用户记录（不含 password） */
export interface UserItem {
  id: number;
  name: string;
  avatar: string;
  username: string;
  role: string;
}

/** 用户列表查询参数：分页必填，其余为可选搜索条件 */
export interface UserListParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  username?: string;
  role?: string;
}

/** 用户新增/编辑入参（password 仅新增或重置密码时提交） */
export interface UserPayload {
  id?: number;
  name: string;
  avatar: string;
  username: string;
  password?: string;
  role: string;
}

export const getUserList = (data: UserListParams) =>
  request.post<PageResult<UserItem>>({ url: "/system/user/getList", data });

export const getUserDetail = (data: { id: number }) =>
  request.get<UserItem>({ url: "/system/user/getDetail", data });

export const createUser = (data: UserPayload) =>
  request.post({ url: "/system/user/create", data });

export const updateUser = (data: UserPayload) =>
  request.post({ url: "/system/user/update", data });

export const deleteUsers = (idList: number[]) =>
  request.post({ url: "/system/user/delete", data: { idList } });
