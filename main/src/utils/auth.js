// 路由白名单
export const whiteList = ["/login", "/403", "/404"];
// 开发环境免登录配置
export const isFreeLogin =
  import.meta.env.DEV && import.meta.env.PUBLIC_FREE_LOGIN === "T";