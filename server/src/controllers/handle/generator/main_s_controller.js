const create = (json) => {
  let dataStr = "";
  const searchData = [];
  json.fields.forEach((field) => {
    if (!dataStr) dataStr = `${field.key}`;
    else dataStr += `, ${field.key}`;
    if (field.showIn.includes("search")) {
      searchData.push({ key: field.key, label: field.label, type: field.type });
    }
  });
  const searchStr = searchData.map((item) => item.key).join(", ");
  return `
import db from "../db/${json.key}.js";
import crud from "../utils/crud.js";

export default {
  // 查询
  getList: (req, res) => {
    const { pageNumber, pageSize, ${searchStr} } = req.body;
    const allList = crud.findAll(db).sort((a, b) => b.id - a.id);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const list = allList.filter((item) => {
      ${searchData
        .map((item) => {
          if (item.type === "input" || item.type === "textarea") {
            return `const match_${item.key} = !${item.key} || item.${item.key}.includes(${item.key});`;
          } else {
            return `const match_${item.key} =!${item.key} || item.${item.key} == ${item.key};`;
          }
        })
        .join("\n")}
      
      return ${searchData
        .map((item) => {
          return `match_${item.key}`;
        })
        .join("&&")};
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
    const { ${dataStr} } = req.body;
    const newObj = {  ${dataStr} };
    const result = crud.create(db, newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改
  update: (req, res) => {
    const { id,  ${dataStr} } = req.body;
    const updatedObj = { id,  ${dataStr} };
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
};

  `;
};
export default {
  create,
};
