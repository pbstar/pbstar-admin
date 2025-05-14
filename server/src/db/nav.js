const db = {
  list: [
    {
      id: 1,
      name: "首页",
      parentId: null,
      url: "/admin/home",
      icon: "HomeFilled",
    },
    {
      id: 2,
      name: "示例应用",
      parentId: null,
      url: null,
      icon: "Menu",
    },
    {
      id: 3,
      name: "列表",
      parentId: 2,
      url: "/admin/example?example=%2Flist",
      icon: "",
    },
    { id: 4, name: "系统应用", parentId: null, url: null, icon: "Tools" },
    {
      id: 5,
      name: "用户管理",
      parentId: 4,
      url: "/admin/system?system=%2Fuser",
      icon: "",
    },
    {
      id: 6,
      name: "角色管理",
      parentId: 4,
      url: "/admin/system?system=%2Frole",
      icon: "",
    },
    {
      id: 7,
      name: "菜单管理",
      parentId: 4,
      url: "/admin/system?system=%2Fnav",
      icon: "",
    },
    {
      id: 8,
      name: "枚举管理",
      parentId: 4,
      url: "/admin/system?system=%2Fenum",
      icon: "",
    },
    {
      id: 9,
      name: "代码生成器",
      parentId: 4,
      url: "/admin/system?system=%2Fgenerator",
      icon: "",
    },
    {
      id: 10,
      name: "Echarts示例",
      parentId: 2,
      url: "/admin/example?example=%2Fecharts",
      icon: "",
    },
  ],
  lastId: 10,
};

export default db;
