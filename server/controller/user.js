import db_user from "../db/user";
import db_role from "../db/role";
const login = (userId, param) => {
  return new Promise((resolve, reject) => {
    let user = db_user.find(
      (item) =>
        item.username == param.username && item.password == param.password
    );
    if (!user) {
      resolve({
        code: 401,
        msg: "账号或密码错误",
        data: null,
      });
      return;
    }
    let role = db_role.find((item) => item.id == user.role);
    if (!role) {
      resolve({
        code: 402,
        msg: "用户角色不存在",
        data: null,
      });
      return;
    }
    resolve({
      code: 200,
      msg: "成功",
      data: {
        token: user.id,
        role_key: role.key,
        user_id: user.id,
        user_info: {
          name: user.name,
        },
      },
    });
  });
};
const getUserList = (userId, param) => {
  return new Promise((resolve, reject) => {
    let allList = [];
    db_user.forEach((item) => {
      //模糊匹配
      if (param.name && !item.name.includes(param.name)) return;
      if (param.phone && !item.phone.includes(param.phone)) return;
      if (param.username && !item.username.includes(param.username)) return;
      if (param.role && item.role != param.role) return;
      if (param.status && item.status != param.status) return;
      if (param.createTime && param.createTime.length == 2) {
        if (item.createTime < param.createTime[0]) return;
        if (item.createTime > param.createTime[1]) return;
      }
      allList.push({
        id: item.id,
        name: item.name,
        phone: item.phone,
        username: item.username,
        roleKey: db_role.find((itemR) => itemR.id == item.role).key,
        roleName: db_role.find((itemR) => itemR.id == item.role).name,
        status: item.status,
        createTime: item.createTime,
      });
    });
    let list = [];
    let page = param.page || 1;
    let pageSize = param.pageSize || 10;
    allList.forEach((item, index) => {
      if (index >= (page - 1) * pageSize && index < page * pageSize) {
        list.push(item);
      }
    });
    resolve({
      code: 200,
      msg: "成功",
      data: {
        list,
        total: allList.length,
      },
    });
  });
};
export default {
  login,
  getUserList,
};
