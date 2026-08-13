import type { Res } from "@Passets/utils/request";

/** mock 处理函数：接收请求参数（get 走 params，post 走 data），同步返回响应体 */
export type MockHandler = (data: any) => Res<any>;

/** 分页查询通用参数 */
export interface PageParams {
  pageNumber?: number;
  pageSize?: number;
  [key: string]: any;
}
