import { users } from "./data/user";
import { roles } from "./data/role";
import { permissions } from "./data/permission";
import { logs } from "./data/log";
import { persons } from "./data/person";

/** mock 总开关：仅开发环境 + PUBLIC_MOCK=T 时生效，生产环境永久关闭 */
export const isMockEnabled = import.meta.env.DEV && import.meta.env.PUBLIC_MOCK === "T";

/** localStorage 持久化键，重置时只需删除该键再刷新即可重新种子化 */
const STORAGE_KEY = "p_mock_data";

type MockData = {
  users: typeof users;
  roles: typeof roles;
  permissions: typeof permissions;
  logs: typeof logs;
  persons: typeof persons;
};

/** 用目标数组原地替换内存数组，保持引用一致（其它模块按引用读取同一份数据） */
function replace<T extends any[]>(target: T, source?: T) {
  if (!Array.isArray(source)) return;
  target.splice(0, target.length, ...source);
}

/** 从 localStorage 恢复数据到内存数组；字段缺失/非数组则保持现状（初始即种子数据） */
function restore(data: Partial<MockData>) {
  replace(users, data.users);
  replace(roles, data.roles);
  replace(permissions, data.permissions);
  replace(logs, data.logs);
  replace(persons, data.persons);
}

/** 把当前内存数据全量写入 localStorage */
export function persist() {
  if (!isMockEnabled) return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ users, roles, permissions, logs, persons }),
  );
}

// 模块加载时初始化：首次加载把种子写入 localStorage，之后从 localStorage 恢复上次的改动
if (isMockEnabled) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) restore(JSON.parse(raw) as Partial<MockData>);
    else persist();
  } catch {
    persist(); // 数据损坏：覆盖旧值，重新写入当前种子数据
  }
}
