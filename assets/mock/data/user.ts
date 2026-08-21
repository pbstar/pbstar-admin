import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 用户记录（password 仅用于登录校验，不会出现在任何响应里） */
export interface UserRecord {
  id: any;
  name: string;
  avatar: string;
  username: string;
  password: string;
  role: string;
}

/** 用户种子数据（与登录页展示的三个示例账号保持一致） */
export const users: UserRecord[] = [
  {
    id: 1,
    name: "超级管理员",
    avatar: "",
    username: "admin",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    name: "普通管理员",
    avatar: "",
    username: "common",
    password: "123456",
    role: "common",
  },
  {
    id: 3,
    name: "普通用户",
    avatar: "",
    username: "user",
    password: "123456",
    role: "user",
  },
];

/** 剔除 password，得到可对外返回的用户信息 */
function toPublicUser(u: UserRecord) {
  return { id: u.id, name: u.name, avatar: u.avatar, username: u.username, role: u.role };
}

export function getList(data: any) {
  const { pageNumber, pageSize, ...filters } = data || {};
  const filtered = fuzzyFilter(users, filters);
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list: list.map(toPublicUser), total });
}

export function getDetail(data: any) {
  const user = findById(users, data?.id);
  if (!user) return fail("用户不存在");
  return ok(toPublicUser(user));
}

export function create(data: any) {
  const user: UserRecord = {
    id: nextId(users),
    name: data?.name || "",
    avatar: data?.avatar || "",
    username: data?.username || "",
    password: data?.password || "123456",
    role: data?.role || "",
  };
  users.push(user);
  return ok(null);
}

export function update(data: any) {
  const user = findById(users, data?.id);
  if (!user) return fail("用户不存在");
  user.name = data?.name ?? user.name;
  user.avatar = data?.avatar ?? user.avatar;
  user.username = data?.username ?? user.username;
  user.role = data?.role ?? user.role;
  if (data?.password) user.password = data.password;
  return ok(null);
}

export function deleteUsers(data: any) {
  removeByIdList(users, data?.idList || []);
  return ok(null);
}
