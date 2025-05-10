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
};
