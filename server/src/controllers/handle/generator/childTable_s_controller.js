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
  const key = json.key.charAt(0).toUpperCase() + json.key.slice(1);
  return `
  import db from "../db/${json.key}.js";
  import crud from "../utils/crud.js";
  
  export default {
     // 获取子表列表
  get${key}List: (req, res) => {
    const { ${json.key}Id } = req.query;
    const result = crud.getChildrenList(db, "${json.childTableKey}", "${json.key}Id", ${json.key}Id);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 获取子表详情
  get${key}Detail: (req, res) => {
    const { id } = req.query;
    const result = crud.getChildrenById(db, "${json.childTableKey}", id);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 新增子表
  create${key}: (req, res) => {
    const {  ${searchStr} } = req.body;
    const newObj = {  ${searchStr} };
    const result = crud.createChildren(db, "${json.childTableKey}", newObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 修改子表
  update${key}: (req, res) => {
    const { id, ${searchStr} } = req.body;
    const updatedObj = { id, ${searchStr} };
    const result = crud.updateChildren(db, "${json.childTableKey}", updatedObj);
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 删除子表
  delete${key}: (req, res) => {
    const { idList } = req.body;
    const result = crud.deleteChildren(db, "${json.childTableKey}", idList);
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
