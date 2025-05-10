import db from "../db/test.js";

export default {
  // 查询
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, age, sex } = req.body;
    const allList = await db.findAll();
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = allList.filter((item) => {
      const matchName = !name || item.name.includes(name);
      const matchAge = !age || item.age.toString().includes(age);
      const matchSex = !sex || item.sex == sex;
      return matchName && matchAge && matchSex;
    });
    const result = {
      list: list.slice(startIndex, endIndex),
      total: list.length,
    };
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const result = await db.findById(id);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 新增
  create: async (req, res) => {
    const { name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const newObj = { name, age, sex, ethnic, isHealthy, hobbyList };
    const result = await db.create(newObj);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const updatedObj = { id, name, age, sex, ethnic, isHealthy, hobbyList };
    const result = await db.update(updatedObj);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const result = await db.delete(idList);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
};
