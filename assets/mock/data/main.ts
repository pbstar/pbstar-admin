import { ok, fail, isToday } from "../utils";
import { users } from "./user";
import { roles } from "./role";
import { logs } from "./log";

/** 当前登录用户 id：从 localStorage 的 token 还原（token 即 mock-token-<id>，前端存于 p_token，刷新后据此还原登录态） */
const getCurrentUserId = () =>
  (localStorage.getItem("p_token") || "").replace("mock-token-", "");

function buildUserInfo(userId: any) {
  const user = users.find((u) => String(u.id) === String(userId));
  if (!user) return null;
  const role = roles.find((r) => r.key === user.role);
  return {
    token: `mock-token-${user.id}`,
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    username: user.username,
    role: user.role,
    permissions: role?.permissions || "",
  };
}

export function login(data: any) {
  const user = users.find(
    (u) => u.username === data?.username && u.password === data?.password,
  );
  if (!user) return fail("账号或密码错误");
  return ok(buildUserInfo(user.id));
}

export function loginByToken() {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return fail("登录已失效，请重新登录");
  const info = buildUserInfo(currentUserId);
  if (!info) return fail("登录已失效，请重新登录");
  return ok(info);
}

export function logout() {
  return ok(null);
}

export function updateMyInfo(data: any) {
  const currentUserId = getCurrentUserId();
  const user = users.find((u) => String(u.id) === String(currentUserId));
  if (!user) return fail("登录已失效，请重新登录");
  user.name = data?.name ?? user.name;
  user.avatar = data?.avatar ?? user.avatar;
  user.username = data?.username ?? user.username;
  if (data?.password) user.password = data.password;
  return ok(null);
}

/** 仪表盘概览：由现有用户/角色/日志数据聚合而来，应用数用固定值（应用清单已迁至前端 assets/constants/apps.ts） */
export function getDashboardStats() {
  const todayLoginCount = logs.filter(
    (log) => log.path === "/main/login" && isToday(log.createTime),
  ).length;
  return ok({
    userCount: users.length,
    appCount: 3,
    roleCount: roles.length,
    todayLoginCount,
    recentLogs: logs.slice(-5).reverse(),
  });
}
