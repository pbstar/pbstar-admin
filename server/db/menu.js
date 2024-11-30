const list = [
  {
    id: 1,
    name: "首页面板",
    path: "/admin/home",
    icon: "home",
  },
  {
    id: 2,
    name: "模板管理",
    icon: "user",
  },
  {
    id: 3,
    parentId: 2,
    name: "页面一",
    path: "/admin/app_template?template=%2Fpage1",
  },
  {
    id: 4,
    parentId: 2,
    name: "页面二",
    path: "/admin/app_template?template=%2Fpage2",
  },
  {
    id: 5,
    name: "系统管理",
    icon: "system-setting",
  },
  {
    id: 6,
    parentId: 5,
    name: "用户管理",
    path: "/admin/user",
  },
  {
    id: 7,
    parentId: 5,
    name: "角色管理",
    path: "/admin/role",
  },
  {
    id: 8,
    parentId: 5,
    name: "菜单管理",
    path: "/admin/menu",
  },
  {
    id: 9,
    name: "外部链接管理",
    icon: "link-1",
  },
  {
    id: 11,
    parentId: 9,
    name: "掘金",
    path: "/admin/link_juejin",
  },
  {
    id: 12,
    parentId: 9,
    name: "GitHub",
    link: "https://github.com/pbstar/pbstar-admin",
  },
];
const type = {
  id: 0,
  parentId: 0,
  name: "",
  icon: "",
  link: "",
  path: "",
  isMenu: true,
};
export default list.map((item) => {
  return { ...type, ...item };
});
