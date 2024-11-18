import menu from "./controller/menu";
const request = (e) => {
  let userId = e.headers.token || "";
  let param = null;
  if (e.method === "get") {
    param = e.params || null;
  } else if (e.method === "post") {
    param = e.data || null;
  }
  return new Promise((resolve, reject) => {
    if (e.url === "/api/getMenuList" && e.method === "get") {
      menu.getMenuList(userId, param).then((res) => {
        resolve(res);
      });
    }
  });
};
export default request;
