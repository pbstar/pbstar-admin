import db from "../db/user.js";
import crud from "../utils/crud.js";
import { generateToken, parseToken } from "../utils/token.js";

export default {
  // 用户登录
  login: (req, res) => {
    const { username, password } = req.body;
    const user = db.list.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      const token = generateToken(user.id);
      user.token = token;
      res.json({
        code: 200,
        data: { token },
        msg: "登录成功",
      });
    } else {
      res.json({
        code: 401,
        msg: "用户名或密码错误",
      });
    }
  },

  // 获取用户列表
  getList: (req, res) => {
    const { pageNumber, pageSize, username } = req.body;
    const allList = crud.findAll(db).sort((a, b) => b.id - a.id);
    const filteredList = allList.filter(
      (user) => !username || user.username.includes(username),
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

  // 获取用户详情
  getDetail: (req, res) => {
    const { id } = req.query;
    const user = crud.findById(db, id);

    if (user) {
      res.json({
        code: 200,
        data: user,
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "用户不存在",
      });
    }
  },

  // 创建用户
  create: (req, res) => {
    const { username, password, name, role } = req.body;
    const newUser = { username, password, name, role };
    const result = crud.create(db, newUser);

    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },

  // 更新用户
  update: (req, res) => {
    const { id, username, password, name, role } = req.body;
    const updatedUser = { id, username, password, name, role };
    const result = crud.update(db, updatedUser);

    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },

  // 删除用户
  delete: (req, res) => {
    const { idList } = req.body;
    const result = crud.delete(db, idList);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },

  // 通过token登录
  loginByToken: (req, res) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: "未登录",
      });
    }
    const { id } = parseToken(token);
    if (!id) {
      return res.status(401).json({
        code: 401,
        msg: "token无效",
      });
    }
    const user = crud.findById(db, id);

    if (user && user.token === token) {
      res.json({
        code: 200,
        data: user,
        msg: "登录成功",
      });
    } else {
      res.json({
        code: 401,
        msg: "token无效",
      });
    }
  },

  // 登出
  logout: (req, res) => {
    const token = req.headers.token;
    const { id } = parseToken(token);
    const user = crud.findById(db, id);

    if (user) {
      user.token = "";
    }
    res.json({
      code: 200,
      msg: "登出成功",
    });
  },
};
