import db from "../db/enum.js";
import crud from "../utils/crud.js";

export default {
  getEnum: (req, res) => {
    const { enumKey } = req.query;
    const all = crud.findAll(db);
    const keyArr = enumKey.split(",");
    const result = {};
    keyArr.forEach((item) => {
      const enumId = all.find((i) => i.key === item)?.id;
      if (enumId) {
        const enumData = crud.getChildrenList(db, "enum", "enumId", enumId);
        result[item] = enumData;
      } else {
        result[item] = [];
      }
    });
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 查询
  getList: (req, res) => {
    const { pageNumber, pageSize, name, key } = req.body;
    const allList = crud.findAll(db).sort((a, b) => b.id - a.id);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = allList.filter((item) => {
      const matchName = !name || item.name.includes(name);
      const matchKey = !key || item.key.includes(key);
      return matchName && matchKey;
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
    const { name, key } = req.body;
    const newObj = { name, key };
    const result = crud.create(db, newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改
  update: (req, res) => {
    const { id, name, key } = req.body;
    const updatedObj = { id, name, key };
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
  // 获取教育经历子表列表
  getEnumList: (req, res) => {
    const { enumId } = req.query;
    const result = crud.getChildrenList(db, "enum", "enumId", enumId);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 获取教育经历子表详情
  getEnumDetail: (req, res) => {
    const { id } = req.query;
    const result = crud.getChildrenById(db, "enum", id);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 新增教育经历子表
  createEnum: (req, res) => {
    const { enumId, label, value } = req.body;
    const newObj = { enumId, label, value };
    const result = crud.createChildren(db, "enum", newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改教育经历子表
  updateEnum: (req, res) => {
    const { id, enumId, label, value } = req.body;
    const updatedObj = { id, enumId, label, value };
    const result = crud.updateChildren(db, "enum", updatedObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 删除教育经历子表
  deleteEnum: (req, res) => {
    const { idList } = req.body;
    const result = crud.deleteChildren(db, "enum", idList);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
};
