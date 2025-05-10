import db from "../db/enum.js";
import crud from "../utils/crud.js";

export default {
  getEnum: (req, res) => {
    const { enumType } = req.query;
    const all = crud.findAll(db);
    const typeArr = enumType.split(",");
    const result = {};
    typeArr.forEach((item) => {
      result[item] = all.filter((i) => i.type === item);
    });
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
};
