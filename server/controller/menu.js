import db_menu from "../db/menu";
import db_user from "../db/user";
import db_role from "../db/role";
const getMenuList = (userId, param) => {
  let user = db_user.find((item) => item.id == userId);
  let role = db_role.find((item) => item.id == user.role);
  return new Promise((resolve, reject) => {
    if (!userId || !user || !role) {
      resolve({
        code: 401,
        msg: "用户不存在",
        data: null,
      });
      return;
    }
    let menu = db_menu.filter((item) => {
      return role.menus.includes(item.id);
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
