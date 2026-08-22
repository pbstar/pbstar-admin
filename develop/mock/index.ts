import type { Res } from "@Passets/utils/request";
import { persist } from "./persist";
import * as mainMock from "./data/main";
import * as userMock from "./data/user";
import * as roleMock from "./data/role";
import * as permissionMock from "./data/permission";
import * as personMock from "./data/person";

type MockHandler = (data: any) => Res<any>;
/** method:url -> handler 路由表 */
const routes: Record<string, MockHandler> = {
  "post:/main/login": mainMock.login,
  "post:/main/loginByToken": mainMock.loginByToken,
  "post:/main/logout": mainMock.logout,
  "post:/main/updateMyInfo": mainMock.updateMyInfo,
  "get:/main/getDashboardStats": mainMock.getDashboardStats,

  "post:/system/user/getList": userMock.getList,
  "get:/system/user/getDetail": userMock.getDetail,
  "post:/system/user/create": userMock.create,
  "post:/system/user/update": userMock.update,
  "post:/system/user/delete": userMock.deleteUsers,

  "post:/system/role/getList": roleMock.getList,
  "get:/system/role/getAllList": roleMock.getAllList,
  "get:/system/role/getDetail": roleMock.getDetail,
  "post:/system/role/create": roleMock.create,
  "post:/system/role/update": roleMock.update,
  "post:/system/role/delete": roleMock.deleteRoles,

  "post:/system/permission/getList": permissionMock.getList,
  "get:/system/permission/getDetail": permissionMock.getDetail,
  "post:/system/permission/create": permissionMock.create,
  "post:/system/permission/update": permissionMock.update,
  "post:/system/permission/delete": permissionMock.deletePermissions,

  "post:/example/person/getList": personMock.getList,
  "get:/example/person/getDetail": personMock.getDetail,
  "post:/example/person/create": personMock.create,
  "post:/example/person/update": personMock.update,
  "post:/example/person/delete": personMock.deletePersons,
};

/** 模拟网络延迟，避免 loading 状态一闪而过 */
const MOCK_DELAY = 200;

/**
 * @param method 请求方法（大小写不敏感）
 * @returns 命中路由表时返回 Promise<Res>；未命中或 mock 未开启时返回 null，交由真实请求处理
 */
export function matchMock(
  method: string,
  url: string,
  data: any,
): Promise<Res<any>> | null {
  const handler = routes[`${method.toLowerCase()}:${url}`];
  if (!handler) {
    console.warn(
      `[mock] 未登记的接口，将发起真实请求：${method.toUpperCase()} ${url}`,
    );
    return null;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const result = handler(data);
      persist();
      resolve(result);
    }, MOCK_DELAY);
  });
}
