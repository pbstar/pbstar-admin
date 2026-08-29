import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 用户记录（password 仅用于登录校验，不会出现在任何响应里） */
export interface UserRecord {
  id: number;
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

/** 用户列表查询参数（分页 + 可选搜索条件） */
export interface UserListQuery {
  pageNumber?: number;
  pageSize?: number;
  name?: string;
  username?: string;
  role?: string;
}

/** 用户新增/更新入参 */
export interface UserPayload {
  id?: number;
  name?: string;
  avatar?: string;
  username?: string;
  password?: string;
  role?: string;
}

export function getList(data: UserListQuery = {}) {
  const { pageNumber, pageSize, name, username, role } = data;
  const filters: Record<string, unknown> = { name, username, role };
  const filtered = fuzzyFilter(users, filters);
  const { list, total } = paginate(filtered, pageNumber, pageSize);
  return ok({ list: list.map(toPublicUser), total });
}

export function getDetail(data: { id: number }) {
  const user = findById(users, data?.id);
  if (!user) return fail("用户不存在");
  return ok(toPublicUser(user));
}

export function create(data: UserPayload) {
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

export function update(data: UserPayload) {
  if (!data.id) return fail("用户不存在");
  const user = findById(users, data.id);
  if (!user) return fail("用户不存在");
  user.name = data?.name ?? user.name;
  user.avatar = data?.avatar ?? user.avatar;
  user.username = data?.username ?? user.username;
  user.role = data?.role ?? user.role;
  if (data?.password) user.password = data.password;
  return ok(null);
}

export function deleteUsers(data: { idList?: number[] }) {
  removeByIdList(users, data?.idList || []);
  return ok(null);
}
