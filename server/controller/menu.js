import db_menu from "../db/menu";
import db_user from "../db/user";
import db_role from "../db/role";
const getMenuList = (userId, param) => {
  return new Promise((resolve, reject) => {
    let user = db_user.find((item) => item.id == userId);
    if (!userId || !user) {
      resolve({
        code: 401,
        msg: "用户不存在",
        data: null,
      });
      return;
    }
    let role = db_role.find((item) => item.id == user.role);
    if (!role) {
      resolve({
        code: 401,
        msg: "用户角色不存在",
        data: null,
      });
      return;
    }
    let menu = db_menu.filter((item) => {
      return role.menus == "all" || role.menus.includes(item.id);
    });
    resolve({
      code: 200,
      msg: "成功",
      data: menu,
    });
  });
};
export default {
  getMenuList,
};
