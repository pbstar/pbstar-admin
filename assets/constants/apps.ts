/**
 * 应用清单（前端硬编码，主应用与 system 子应用共用同一份数据）
 * - 原"应用管理"模块的后台维护数据，改为前端硬编码
 * - 按分组组织为二级数组：system 侧按分组构建权限管理树；主应用侧用展平视图做应用切换/权限过滤
 * - key 需与 apps/apps.json 保持一致；应用是否对当前用户可见，由「该应用下是否存在可见菜单」决定（见 main 侧 stores/apps.ts）
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
      { id: 3, name: "外部应用", key: "out-app", icon: "el-icon-link" },
    ],
  },
];

/** 展平后的应用列表（附 group 字段），供需要扁平形态的场景（如主应用切换/过滤）使用 */
export const apps = appGroups.flatMap((group) =>
  group.apps.map((app) => ({ ...app, group: group.group })),
);

export default appGroups;
