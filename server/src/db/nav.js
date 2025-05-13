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
      name: "菜单管理",
      parentId: 4,
      url: "/admin/system?system=%2Fnav",
      icon: "",
    },
    {
      id: 6,
      name: "代码生成器",
      parentId: 4,
      url: "/admin/system?system=%2Fgenerator",
      icon: "",
    },
    {
      id: 7,
      name: "Echarts示例",
      parentId: 2,
      url: "/admin/example?example=%2Fecharts",
      icon: "",
    },
    {
      id: 8,
      name: "枚举管理",
      parentId: 4,
      url: "/admin/system?system=%2Fenum",
      icon: "",
    },
  ],
  lastId: 2,
};

export default db;
