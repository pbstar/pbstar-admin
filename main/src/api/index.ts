import request from "@Passets/request";
import type { UserInfo } from "@Passets/stores/shared";

/** 登录 / 凭 token 恢复后返回的用户信息（含 token） */
export type LoginResult = UserInfo & { token: string };

/** 仪表盘概览数据 */
export interface DashboardStats {
  userCount: number;
  appCount: number;
  roleCount: number;
}

export const login = (data: { username: string; password: string }) =>
  request.post<LoginResult>({ url: "/main/login", data });

export const loginByToken = () =>
  request.post<LoginResult>({ url: "/main/loginByToken" });

export const logout = () => request.post({ url: "/main/logout" });

export const getDashboardStats = () =>
  request.get<DashboardStats>({ url: "/main/getDashboardStats" });

/** 个人资料更新入参（password 仅需修改密码时提交） */
export interface UpdateMyInfoPayload {
  name?: string;
  avatar?: string;
  username?: string;
  password?: string;
}

export const updateMyInfo = (data: UpdateMyInfoPayload) =>
  request.post({ url: "/main/updateMyInfo", data });
