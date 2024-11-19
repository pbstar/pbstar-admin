import db_menu from "../db/menu";
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
        role: role.role,
        user_id: user.id,
        user_info: {
          name: user.name,
        },
      },
    });
  });
};
export default {
  login,
};
