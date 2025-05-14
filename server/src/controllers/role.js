import db from "../db/role.js";
import crud from "../utils/crud.js";

export default {
  // 获取角色列表
  getList: (req, res) => {
    const { pageNumber, pageSize, name, key } = req.body;
    const allList = crud.findAll(db).sort((a, b) => b.id - a.id);
    const filteredList = allList.filter(
      (role) =>
        (!name || role.name.includes(name)) && (!key || role.key.includes(key)),
    );

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    res.json({
      code: 200,
      data: {
        list: filteredList.slice(startIndex, endIndex),
        total: filteredList.length,
      },
      msg: "成功",
    });
  },

  // 获取角色详情
  getDetail: (req, res) => {
    const { id } = req.query;
    const role = crud.findById(db, id);

    if (role) {
      res.json({
        code: 200,
        data: role,
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "角色不存在",
      });
    }
  },

  // 创建角色
  create: (req, res) => {
    const { name, key, navs } = req.body;
    const newRole = { name, key, navs };
    const result = crud.create(db, newRole);

    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },

  // 更新角色
  update: (req, res) => {
    const { id, name, key, navs } = req.body;
    const updatedRole = { id, name, key, navs };
    const result = crud.update(db, updatedRole);

    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },

  // 删除角色
  delete: (req, res) => {
    const { idList } = req.body;
    const result = crud.delete(db, idList);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },

  // 通过角色key获取角色信息
  getRoleByKey: (req, res) => {
    const { key } = req.query;
    const role = crud.findByKey(db, key);

    if (role) {
      res.json({
        code: 200,
        data: role,
        msg: "成功",
      });
    }
  },
};
