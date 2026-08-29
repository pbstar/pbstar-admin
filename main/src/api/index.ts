import request from "@Passets/request";
import type {
  LoginResult,
  DashboardStats,
  UpdateMyInfoPayload,
} from "./index.types";

export * from "./index.types";

export const login = (data: { username: string; password: string }) =>
  request.post<LoginResult>({ url: "/main/login", data });

export const loginByToken = () =>
  request.post<LoginResult>({ url: "/main/loginByToken" });

export const logout = () => request.post({ url: "/main/logout" });

export const getDashboardStats = () =>
  request.get<DashboardStats>({ url: "/main/getDashboardStats" });

export const updateMyInfo = (data: UpdateMyInfoPayload) =>
  request.post({ url: "/main/updateMyInfo", data });
