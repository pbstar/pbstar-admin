import type { MenuItem } from "@Passets/utils/permission";

/** system 应用的全量菜单结构（硬编码维护，与后台权限管理的 key 字段一一对应） */
const menus: MenuItem[] = [
  {
    name: "系统管理",
    icon: "el-icon-setting",
    children: [
      { key: "system_user", name: "用户管理", url: "/user", icon: "el-icon-user" },
      { key: "system_role", name: "角色管理", url: "/role", icon: "el-icon-avatar" },
      { key: "system_permission", name: "权限管理", url: "/permission", icon: "el-icon-menu" },
      { key: "system_app", name: "应用管理", url: "/app", icon: "el-icon-grid" },
      { key: "system_log", name: "操作日志", url: "/log", icon: "el-icon-document" },
    ],
  },
];

export default menus;
