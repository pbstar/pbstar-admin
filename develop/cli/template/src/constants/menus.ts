import type { MenuItem } from "@Passets/utils/permission";

/** app-template-package-name 应用的全量菜单结构（硬编码维护，与后台权限管理的 key 字段一一对应） */
const menus: MenuItem[] = [
  { key: "app-template-package-name_list", name: "列表", url: "/list", icon: "el-icon-tickets" },
];

export default menus;
