import { ok, fail, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 菜单记录（parentId 为驼峰命名，与 /system/nav/* 接口保持一致） */
export interface NavRecord {
  id: any;
  appId: number;
  name: string;
  url: string | null;
  parentId: any;
  icon: string;
  isNav: 0 | 1;
  index: number;
  remark: string;
}

/** 菜单种子数据：system 应用（appId=1）的导航树 */
export const navs: NavRecord[] = [
  { id: 1, appId: 1, name: "系统管理", url: null, parentId: "", icon: "el-icon-setting", isNav: 1, index: 1, remark: "" },
  { id: 2, appId: 1, name: "用户管理", url: "/user", parentId: 1, icon: "el-icon-user", isNav: 1, index: 1, remark: "" },
  { id: 3, appId: 1, name: "角色管理", url: "/role", parentId: 1, icon: "el-icon-avatar", isNav: 1, index: 2, remark: "" },
  { id: 4, appId: 1, name: "菜单管理", url: "/nav", parentId: 1, icon: "el-icon-menu", isNav: 1, index: 3, remark: "" },
  { id: 5, appId: 1, name: "应用管理", url: "/app", parentId: 1, icon: "el-icon-grid", isNav: 1, index: 4, remark: "" },
  { id: 6, appId: 1, name: "操作日志", url: "/log", parentId: 1, icon: "el-icon-document", isNav: 1, index: 5, remark: "" },
  { id: 7, appId: 2, name: "用户列表", url: "/list", parentId: "", icon: "el-icon-tickets", isNav: 1, index: 1, remark: "" },
  { id: 8, appId: 2, name: "图表", url: "/echarts", parentId: "", icon: "el-icon-pie-chart", isNav: 1, index: 2, remark: "" },
];

export function getList(data: any) {
  const { appId, ...filters } = data || {};
  let filtered = navs;
  if (appId !== undefined && appId !== "") {
    filtered = filtered.filter((item) => String(item.appId) === String(appId));
  }
  filtered = fuzzyFilter(filtered, filters);
  return ok(filtered);
}

/** 按钮权限树（供角色管理页选择，元素为 el-tree-select 可用的 label/value 结构） */
export function getBtnList() {
  return ok([
    {
      label: "用户管理",
      value: "user",
      children: [
        { label: "新增", value: "user_add" },
        { label: "编辑", value: "user_edit" },
        { label: "查看", value: "user_view" },
        { label: "删除", value: "user_delete" },
      ],
    },
    {
      label: "角色管理",
      value: "role",
      children: [
        { label: "新增", value: "role_add" },
        { label: "编辑", value: "role_edit" },
        { label: "删除", value: "role_delete" },
      ],
    },
  ]);
}

export function getDetail(data: any) {
  const nav = findById(navs, data?.id);
  if (!nav) return fail("菜单不存在");
  return ok(nav);
}

export function create(data: any) {
  const nav: NavRecord = {
    id: nextId(),
    appId: data?.appId,
    name: data?.name || "",
    url: data?.url || null,
    parentId: data?.parentId ?? "",
    icon: data?.icon || "",
    isNav: data?.isNav ?? 1,
    index: data?.index ?? 0,
    remark: data?.remark || "",
  };
  navs.push(nav);
  return ok(null);
}

export function update(data: any) {
  const nav = findById(navs, data?.id);
  if (!nav) return fail("菜单不存在");
  nav.appId = data?.appId ?? nav.appId;
  nav.name = data?.name ?? nav.name;
  nav.url = data?.url ?? nav.url;
  nav.parentId = data?.parentId ?? nav.parentId;
  nav.icon = data?.icon ?? nav.icon;
  nav.isNav = data?.isNav ?? nav.isNav;
  nav.index = data?.index ?? nav.index;
  nav.remark = data?.remark ?? nav.remark;
  return ok(null);
}

export function deleteNavs(data: any) {
  removeByIdList(navs, data?.idList || []);
  return ok(null);
}
