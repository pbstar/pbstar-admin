const db = {
  list: [
    { id: 1, name: "张三", age: 18, sex: "1", ethnic: "1", isHealthy: "1" },
    { id: 2, name: "李四", age: 19, sex: "2", ethnic: "3", isHealthy: "2" },
    { id: 3, name: "王五", age: 20, sex: "1", ethnic: "2", isHealthy: "1" },
    { id: 4, name: "赵六", age: 21, sex: "2", ethnic: "1", isHealthy: "2" },
    { id: 5, name: "钱七", age: 22, sex: "1", ethnic: "3", isHealthy: "1" },
    { id: 6, name: "孙八", age: 23, sex: "2", ethnic: "2", isHealthy: "2" },
    { id: 7, name: "周九", age: 24, sex: "1", ethnic: "1", isHealthy: "1" },
    { id: 8, name: "吴十", age: 25, sex: "2", ethnic: "3", isHealthy: "2" },
    { id: 9, name: "郑十一", age: 26, sex: "1", ethnic: "2", isHealthy: "1" },
    { id: 10, name: "王十二", age: 27, sex: "2", ethnic: "1", isHealthy: "2" },
    { id: 11, name: "李十三", age: 28, sex: "1", ethnic: "3", isHealthy: "1" },
    { id: 12, name: "张十四", age: 29, sex: "2", ethnic: "2", isHealthy: "2" },
    { id: 13, name: "王十五", age: 30, sex: "1", ethnic: "1", isHealthy: "1" },
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
