// 路由白名单（/404 由 catch-all 兜底，无需白名单）
export const whiteList = ["/login", "/403"];
// 开发环境免登录配置
export const isFreeLogin =
  import.meta.env.DEV && import.meta.env.PUBLIC_FREE_LOGIN === "T";

/** 免登录或白名单路径：直接放行 */
export const isPublicPath = (path: string) =>
  isFreeLogin || whiteList.includes(path);