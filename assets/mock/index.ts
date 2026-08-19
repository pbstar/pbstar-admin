import type { Res } from "@Passets/utils/request";
import type { MockHandler } from "./types";
import * as mainMock from "./data/main";
import * as userMock from "./data/user";
import * as roleMock from "./data/role";
import * as permissionMock from "./data/permission";
import * as logMock from "./data/log";
import * as personMock from "./data/person";

/** mock 总开关：仅开发环境 + PUBLIC_MOCK=T 时生效，生产环境永久关闭 */
export const isMockEnabled = import.meta.env.DEV && import.meta.env.PUBLIC_MOCK === "T";

/** method:url -> handler 路由表 */
const routes: Record<string, MockHandler> = {
  "post:/main/login": mainMock.login,
  "post:/main/loginByToken": mainMock.loginByToken,
  "post:/main/logout": mainMock.logout,
  "get:/main/getMyAppList": mainMock.getMyAppList,
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

  "post:/system/log/getList": logMock.getList,
  "get:/system/log/getDetail": logMock.getDetail,
  "post:/system/log/create": logMock.create,
  "post:/system/log/update": logMock.update,
  "post:/system/log/delete": logMock.deleteLogs,

  "post:/example/person/getList": personMock.getList,
  "get:/example/person/getDetail": personMock.getDetail,
  "post:/example/person/create": personMock.create,
  "post:/example/person/update": personMock.update,
  "post:/example/person/delete": personMock.deletePersons,
};

/** 模拟网络延迟，避免 loading 状态一闪而过 */
const MOCK_DELAY = 200;

/**
 * 尝试用 mock 数据响应请求
 * @param method 请求方法（大小写不敏感）
 * @param url 请求 url
 * @param data 请求参数
 * @returns 命中路由表时返回 Promise<Res>；未命中或 mock 未开启时返回 null，交由真实请求处理
 */
export function matchMock(method: string, url: string, data: any): Promise<Res<any>> | null {
  const handler = routes[`${method.toLowerCase()}:${url}`];
  if (!handler) {
    console.warn(`[mock] 未登记的接口，将发起真实请求：${method.toUpperCase()} ${url}`);
    return null;
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(handler(data)), MOCK_DELAY);
  });
}
