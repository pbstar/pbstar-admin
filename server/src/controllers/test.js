import db from "../db/test.js";
import crud from "../utils/crud.js";

export default {
  // 查询
  getList: (req, res) => {
    const { pageNumber, pageSize, name, age, sex } = req.body;
    const allList = crud.findAll(db).sort((a, b) => b.id - a.id);
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
      msg: "成功",
    });
  },
  // 详情
  getDetail: (req, res) => {
    const { id } = req.query;
    const result = crud.findById(db, id);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 新增
  create: (req, res) => {
    const { name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const newObj = { name, age, sex, ethnic, isHealthy, hobbyList };
    const result = crud.create(db, newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改
  update: (req, res) => {
    const { id, name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const updatedObj = { id, name, age, sex, ethnic, isHealthy, hobbyList };
    const result = crud.update(db, updatedObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 删除
  delete: (req, res) => {
    const { idList } = req.body;
    const result = crud.delete(db, idList);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 获取子表列表
  getEducationList: (req, res) => {
    const { testId } = req.query;
    const result = crud.getChildrenList(db, "edu", "testId", testId);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 获取子表详情
  getEducationDetail: (req, res) => {
    const { id } = req.query;
    const result = crud.getChildrenById(db, "edu", id);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 新增子表
  createEducation: (req, res) => {
    const { testId, eduName, dateRange, remark } = req.body;
    const newObj = { testId, eduName, dateRange, remark };
    const result = crud.createChildren(db, "edu", newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改子表
  updateEducation: (req, res) => {
    const { id, testId, eduName, dateRange, remark } = req.body;
    const updatedObj = { id, testId, eduName, dateRange, remark };
    const result = crud.updateChildren(db, "edu", updatedObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 删除子表
  deleteEducation: (req, res) => {
    const { idList } = req.body;
    const result = crud.deleteChildren(db, "edu", idList);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
};
