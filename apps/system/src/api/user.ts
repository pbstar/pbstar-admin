import request from "@Passets/request";
import type { PageResult } from "@Passets/request";

/** 用户记录（不含 password） */
export interface UserItem {
  id: number | string;
  name: string;
  avatar: string;
  username: string;
  role: string;
}

/** 用户列表查询参数：分页必填，其余为可选搜索条件 */
export interface UserListParams extends Record<string, any> {
  pageNumber: number;
  pageSize: number;
}

export const getUserList = (data: UserListParams) =>
  request.post<PageResult<UserItem>>({ url: "/system/user/getList", data });

export const getUserDetail = (data: { id: string | number }) =>
  request.get<UserItem>({ url: "/system/user/getDetail", data });

export const createUser = (data: Record<string, any>) =>
  request.post({ url: "/system/user/create", data });

export const updateUser = (data: Record<string, any>) =>
  request.post({ url: "/system/user/update", data });

export const deleteUsers = (idList: (string | number)[]) =>
  request.post({ url: "/system/user/delete", data: { idList } });
