import menu from "./controller/menu";
import user from "./controller/user";
const getMap = {
  "/api/getMyMenuList": menu.getMyMenuList,
  "/api/getUserList": user.getUserList,
};
const postMap = {
  "/api/login": user.login,
};
const request = (e) => {
  let userId = e.headers?.token || "";
  let param = null;
  let apifunc = null;
  if (e.method === "get") {
    param = e.params || null;
    apifunc = getMap[e.url] || null;
  } else if (e.method === "post") {
    param = e.data || null;
    apifunc = postMap[e.url] || null;
  }
  return new Promise((resolve, reject) => {
    apifunc(userId, param || {}).then((res) => {
      resolve(res);
    });
  });
};
export default request;
