import request from "@Passets/request";
import type { PageResult } from "@Passets/request";

/** 示例人员记录 */
export interface PersonItem {
  id: number | string;
  name: string;
  age: number;
  sex: string;
  ethnic: string;
  isHealthy: string;
}

/** 人员列表查询参数：分页必填，其余为可选搜索条件 */
export interface PersonListParams extends Record<string, any> {
  pageNumber: number;
  pageSize: number;
}

export const getPersonList = (data: PersonListParams) =>
  request.post<PageResult<PersonItem>>({ url: "/example/person/getList", data });

export const getPersonDetail = (data: { id: string | number }) =>
  request.get<PersonItem>({ url: "/example/person/getDetail", data });

export const createPerson = (data: Record<string, any>) =>
  request.post({ url: "/example/person/create", data });

export const updatePerson = (data: Record<string, any>) =>
  request.post({ url: "/example/person/update", data });

export const deletePersons = (idList: (string | number)[]) =>
  request.post({ url: "/example/person/delete", data: { idList } });
