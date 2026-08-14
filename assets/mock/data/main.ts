import { ok, fail, isToday } from "../utils";
import { users } from "./user";
import { roles } from "./role";
import { apps } from "./app";
import { navs } from "./nav";
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
    btns: role?.btns || "",
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

export function getMyAppList() {
  return ok(apps.map((a) => ({ id: a.id, key: a.key, name: a.name, icon: a.icon, group: a.group })));
}

export function getMyNavListByAppId(data: any) {
  const list = navs
    .filter((n) => String(n.appId) === String(data?.appId))
    .map((n) => ({
      id: n.id,
      name: n.name,
      url: n.url,
      icon: n.icon,
      parent_id: n.parentId,
    }));
  return ok(list);
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

/** 仪表盘概览：由现有用户/应用/角色/日志数据聚合而来，不引入新业务概念 */
export function getDashboardStats() {
  const todayLoginCount = logs.filter(
    (log) => log.path === "/main/login" && isToday(log.createTime),
  ).length;
  return ok({
    userCount: users.length,
    appCount: apps.length,
    roleCount: roles.length,
    todayLoginCount,
    recentLogs: logs.slice(-5).reverse(),
  });
}
