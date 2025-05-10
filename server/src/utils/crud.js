export default {
  // 获取所有示例
  findAll: (db) => {
    const arr = db.list;
    return arr;
  },

  // 根据ID查找
  findById: (db, id) => {
    const obj = db.list.find((item) => item.id === Number(id));
    return obj || null;
  },

  // 创建新示例
  create: (db, data) => {
    db.lastId++;
    const newObj = { ...data, id: db.lastId };
    db.list.push(newObj);
    return newObj;
  },

  // 更新示例
  update: (db, data) => {
    if (!data.id) return null;
    const index = db.list.findIndex((item) => item.id === Number(data.id));
    if (index === -1) return null;
    const updatedObj = { ...db.list[index], ...data };
    db.list[index] = updatedObj;
    return updatedObj;
  },

  // 删除示例
  delete: (db, idList) => {
    db.list = db.list.filter((item) => !idList.includes(item.id));
    return true;
  },

  // 获取子表数据
  getChildrenList: (db, tableName, assKey, assId) => {
    const table = db.children[tableName];
    if (!table) return [];
    const list = table.list.filter((item) => item[assKey] === Number(assId));
    return list;
  },

  // 根据ID查找子表数据
  getChildrenById: (db, tableName, id) => {
    const table = db.children[tableName];
    if (!table) return null;
    const obj = table.list.find((item) => item.id === Number(id));
    return obj || null;
  },

  // 创建子表数据
  createChildren: (db, tableName, data) => {
    const table = db.children[tableName];
    if (!table) return null;
    table.lastId++;
    const newObj = { ...data, id: table.lastId };
    table.list.push(newObj);
    return newObj;
  },

  // 更新子表数据
  updateChildren: (db, tableName, data) => {
    const table = db.children[tableName];
    if (!table) return null;
    const index = table.list.findIndex((item) => item.id === Number(data.id));
    if (index === -1) return null;
    const updatedObj = { ...table.list[index], ...data };
    table.list[index] = updatedObj;
    return updatedObj;
  },

  // 删除子表数据
  deleteChildren: (db, tableName, idList) => {
    const table = db.children[tableName];
    if (!table) return null;
    table.list = table.list.filter((item) => !idList.includes(item.id));
    return true;
  },
};
