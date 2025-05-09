import db from "../db/enum.js";

export default {
  getEnum: async (req, res) => {
    const { enumType } = req.query;
    const result = await db.findByEnumType(enumType);
    res.json({
      code: 200,
      data: result,
      message: "成功",
    });
  },
};
