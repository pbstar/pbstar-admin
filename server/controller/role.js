import db_role from "../db/role";
const getRoleList = (userId, param) => {
  return new Promise((resolve, reject) => {
    let allList = [];
    db_role.forEach((item) => {
      //模糊匹配
      if (param.name && !item.name.includes(param.name)) return;
      if (param.key && !item.phone.includes(param.key)) return;
      if (param.createTime && param.createTime.length == 2) {
        if (item.createTime < param.createTime[0]) return;
        if (item.createTime > param.createTime[1]) return;
      }
      allList.push({
        id: item.id,
        name: item.name,
        key: item.key,
        menus: item.menus,
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
  getRoleList,
};
