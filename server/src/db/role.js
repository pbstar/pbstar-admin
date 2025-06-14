const db = {
  list: [
    {
      id: 1,
      name: "超级管理员",
      key: "admin",
      navs: "all",
      btns: "all",
    },
    {
      id: 2,
      name: "普通管理员",
      key: "common",
      navs: [1, 3, 7, 8, 9, 10],
      btns: ["list_add", "list_delete", "list_export"],
    },
    {
      id: 3,
      name: "普通用户",
      key: "user",
      navs: [1, 3, 9, 10],
      btns: [],
    },
  ],
  lastId: 3,
};

export default db;
