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

export const updateMyInfo = (data: Record<string, any>) =>
  request.post({ url: "/main/updateMyInfo", data });
