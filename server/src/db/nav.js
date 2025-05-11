const db = {
  list: [
    { id: 1, name: "首页", parentId: null, url: "/admin/home" },
    { id: 2, name: "示例应用", parentId: null, url: null },
    {
      id: 3,
      name: "列表",
      parentId: 2,
      url: "/admin/example?example=%2Flist",
    },
    { id: 4, name: "系统管理", parentId: null },
    {
      id: 5,
      name: "菜单管理",
      parentId: 4,
      url: "/admin/system?system=%2Flist",
    },
    {
      id: 6,
      name: "代码生成器",
      parentId: 4,
      url: "/admin/system?system=%2Fgenerator",
    },
    {
      id: 7,
      name: "Echarts示例",
      parentId: 2,
      url: "/admin/example?example=%2Fecharts",
    },
  ],
  lastId: 2,
};

export default db;
