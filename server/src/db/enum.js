const db = {
  list: [
    { id: 1, name: "布尔值", key: "p_boolean" },
    { id: 2, name: "性别", key: "p_sex" },
    { id: 3, name: "民族", key: "p_ethnic" },
  ],
  lastId: 3,
  children: {
    enum: {
      list: [
        { id: 1, label: "是", value: "1", enumId: 1 },
        { id: 2, label: "否", value: "2", enumId: 1 },
        { id: 3, label: "男", value: "1", enumId: 2 },
        { id: 4, label: "女", value: "2", enumId: 2 },
        { id: 5, label: "汉族", value: "1", enumId: 3 },
        { id: 6, label: "苗族", value: "2", enumId: 3 },
        { id: 7, label: "满族", value: "3", enumId: 3 },
        { id: 8, label: "回族", value: "4", enumId: 3 },
      ],
      lastId: 8,
    },
  },
};

export default db;
