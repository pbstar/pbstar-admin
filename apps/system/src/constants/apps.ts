/**
 * 应用列表常量（原"应用管理"模块的后台维护数据，改为前端硬编码）
 * 按分组组织为二级数组，权限管理（应用分组树）、角色管理（分配权限时按应用归类）依赖此列表
 */
export interface AppItem {
  id: number;
  name: string;
  key: string;
  icon: string;
}

export interface AppGroup {
  group: string;
  apps: AppItem[];
}

const appGroups: AppGroup[] = [
  {
    group: "内置应用",
    apps: [
      { id: 1, name: "系统管理", key: "system", icon: "el-icon-setting" },
      { id: 2, name: "示例应用", key: "example", icon: "el-icon-menu" },
    ],
  },
];

export default appGroups;
