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
};
