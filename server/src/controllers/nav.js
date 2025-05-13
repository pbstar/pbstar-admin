import db from "../db/nav.js";
import crud from "../utils/crud.js";
import { toTree } from "../utils/array.js";

export default {
  getNavTreeList: (req, res) => {
    const list = crud.findAll(db);
    res.json({
      code: 200,
      data: toTree(list),
      message: "成功",
    });
  },
  getNavList: (req, res) => {
    const list = crud.findAll(db);
    res.json({
      code: 200,
      data: list,
      message: "成功",
    });
  },
  // 查询
  getList: (req, res) => {
    const { pageNumber, pageSize, name, url } = req.body;
    const allList = toTree(crud.findAll(db));
    const filteredList = allList.filter((item) => {
      const matchName =
        !name ||
        item.name.includes(name) ||
        (item.children &&
          item.children.some((child) => child.name.includes(name)));
      const matchKey =
        !url ||
        item.url.includes(url) ||
        (item.children &&
          item.children.some((child) => child.url.includes(url)));
      return matchName && matchKey;
    });
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const result = {
      list: toTree(filteredList.slice(startIndex, endIndex)),
      total: filteredList.length,
    };
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 详情
  getDetail: (req, res) => {
    const { id } = req.query;
    const result = crud.findById(db, id);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 新增
  create: (req, res) => {
    const { name, url, parentId, icon } = req.body;
    const newObj = { name, url, parentId, icon };
    const result = crud.create(db, newObj);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 修改
  update: (req, res) => {
    const { id, name, url, parentId, icon } = req.body;
    const updatedObj = { id, name, url, parentId, icon };
    const result = crud.update(db, updatedObj);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
  // 删除
  delete: (req, res) => {
    const { idList } = req.body;
    const result = crud.delete(db, idList);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
};
