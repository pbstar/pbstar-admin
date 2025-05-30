const db = {
  list: [
    {
      id: 1,
      name: "管理员",
      avatar:
        "https://p9-passport.byteacctimg.com/img/user-avatar/20aafa059387952c765dbfdd421298ed~80x80.awebp",
      username: "admin",
      password: "123456",
      role: "admin",
      token: "",
    },
    {
      id: 2,
      name: "普通管理员",
      avatar: "",
      username: "common",
      password: "123456",
      role: "common",
      token: "",
    },
    {
      id: 3,
      name: "普通用户",
      avatar: "",
      username: "user",
      password: "123456",
      role: "user",
      token: "",
    },
  ],
  lastId: 3,
};

export default db;
