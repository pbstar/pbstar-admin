import db from "../db/nav.js";
import { toTree } from "../utils/array.js";

export default {
  getNavTreeList: async (req, res) => {
    const list = await db.findAll();
    res.json({
      code: 200,
      data: toTree(list),
      message: "成功",
    });
  },
  getNavList: async (req, res) => {
    const list = await db.findAll();
    res.json({
      code: 200,
      data: list,
      message: "成功",
    });
  },
};
