const db = {
  list: [
    { id: 1, name: "首页", parentId: null, url: "/admin/home" },
    { id: 2, name: "示例应用", parentId: null, url: null },
    {
      id: 3,
      name: "列表",
      parentId: 2,
      url: "/admin/apps?name=app-example&app-example=%2Flist",
    },
    { id: 4, name: "系统管理", parentId: null },
    {
      id: 5,
      name: "菜单管理",
      parentId: 4,
      url: "/admin/apps?name=app-system&app-system=%2Flist",
    },
    {
      id: 6,
      name: "代码生成器",
      parentId: 4,
      url: "/admin/apps?name=app-system&app-system=%2Fgenerator",
    },
    {
      id: 7,
      name: "Echarts示例",
      parentId: 2,
      url: "/admin/apps?name=app-example&app-example=%2Fecharts",
    },
  ],
  lastId: 2,
};

export default {
  // 获取所有示例
  findAll: () => {
    return Promise.resolve(db.list);
  },

  // 根据ID查找
  findById: (id) => {
    const obj = db.list.find((item) => item.id === Number(id));
    return Promise.resolve(obj || null);
  },

  // 创建新示例
  create: (data) => {
    const newObj = { ...data, id: db.lastId++ };
    db.list.push(newObj);
    return Promise.resolve(newObj);
  },

  // 更新示例
  update: (data) => {
    if (!data.id) return Promise.resolve(null);
    const index = db.list.findIndex((item) => item.id === Number(data.id));
    if (index === -1) return Promise.resolve(null);
    const updatedObj = { ...db.list[index], ...data };
    db.list[index] = updatedObj;
    return Promise.resolve(updatedObj);
  },

  // 删除示例
  delete: (id) => {
    const index = db.list.findIndex((item) => item.id === Number(id));
    if (index === -1) return Promise.resolve(false);
    db.list.splice(index, 1);
    return Promise.resolve(true);
  },
};
