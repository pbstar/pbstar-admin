const db = {
  list: [
    {
      id: 1,
      name: "超级管理员",
      key: "admin",
      navs: "all",
    },
    {
      id: 2,
      name: "普通管理员",
      key: "common",
      navs: [1, 3, 7, 8, 9, 10],
    },
    {
      id: 3,
      name: "普通用户",
      key: "user",
      navs: [1, 3, 9, 10],
    },
  ],
  lastId: 3,
};

export default db;
