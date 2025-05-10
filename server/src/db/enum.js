const db = {
  list: [
    { id: 1, label: "是", value: "1", type: "p_boolean" },
    { id: 2, label: "否", value: "2", type: "p_boolean" },
    { id: 3, label: "男", value: "1", type: "p_sex" },
    { id: 4, label: "女", value: "2", type: "p_sex" },
    { id: 5, label: "汉族", value: "1", type: "p_ethnic" },
    { id: 6, label: "苗族", value: "2", type: "p_ethnic" },
    { id: 7, label: "满族", value: "3", type: "p_ethnic" },
    { id: 8, label: "回族", value: "4", type: "p_ethnic" },
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
