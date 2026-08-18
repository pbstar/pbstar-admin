import type { MenuItem } from "@Passets/utils/permission";

/** example 应用的全量菜单结构（硬编码维护，与后台权限管理的 key 字段一一对应） */
export const exampleMenus: MenuItem[] = [
  { key: "example_list", name: "用户列表", url: "/list", icon: "el-icon-tickets" },
  { key: "example_echarts", name: "图表", url: "/echarts", icon: "el-icon-pie-chart" },
  { key: "example_editorMd", name: "Markdown编辑器", url: "/editorMd", icon: "el-icon-edit" },
  { key: "example_editorRt", name: "富文本编辑器", url: "/editorRt", icon: "el-icon-edit" },
  { key: "example_bigScreen", name: "数据大屏", url: "/bigScreen", icon: "el-icon-monitor" },
];
