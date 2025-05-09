const db = {
  list: [
    {
      id: 1,
      label: "是",
      value: "1",
      type: "p_boolean",
      remark: "",
    },
    {
      id: 2,
      label: "否",
      value: "2",
      type: "p_boolean",
      remark: "",
    },
  ],
  lastId: 2,
};

export default {
  // 根据枚举类型查找
  findByEnumType: (enumType) => {
    const typeArr = enumType.split(",");
    const res = {};
    typeArr.forEach((item) => {
      res[item] = db.list.filter((i) => i.type === item);
    });
    return Promise.resolve(res);
  },
};
