import type { UserInfo } from "@Passets/stores/shared";

/** 登录 / 凭 token 恢复后返回的用户信息（含 token） */
export type LoginResult = UserInfo & { token: string };

/** 仪表盘概览数据 */
export interface DashboardStats {
  userCount: number;
  appCount: number;
  roleCount: number;
}

/** 个人资料更新入参（password 仅需修改密码时提交） */
export interface UpdateMyInfoPayload {
  name?: string;
  avatar?: string;
  username?: string;
  password?: string;
}
