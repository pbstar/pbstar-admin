import { ok, fail, isToday } from "../utils";
import { users } from "./user";
import { roles } from "./role";
import { logs } from "./log";

/** 当前登录用户 id（模拟服务端会话，login 时写入，logout 时清空） */
let currentUserId: any = null;

function buildUserInfo(userId: any) {
  const user = users.find((u) => String(u.id) === String(userId));
  if (!user) return null;
  const role = roles.find((r) => r.key === user.role);
  return {
    token: `mock-token-${user.id}-${Date.now()}`,
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
  currentUserId = user.id;
  return ok(buildUserInfo(user.id));
}

export function loginByToken() {
  if (!currentUserId) return fail("登录已失效，请重新登录");
  const info = buildUserInfo(currentUserId);
  if (!info) return fail("登录已失效，请重新登录");
  return ok(info);
}

export function logout() {
  currentUserId = null;
  return ok(null);
}

export function updateMyInfo(data: any) {
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
