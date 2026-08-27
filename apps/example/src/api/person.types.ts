/** 示例人员记录 */
export interface PersonItem {
  id: number;
  name: string;
  age: number;
  sex: string;
  ethnic: string;
  isHealthy: string;
}

/** 人员列表查询参数：分页必填，其余为可选搜索条件 */
export interface PersonListParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  age?: number;
  sex?: string;
  ethnic?: string;
  isHealthy?: string;
}

/** 人员新增/编辑入参 */
export interface PersonPayload {
  id?: number;
  name: string;
  age: number;
  sex: string;
  ethnic: string;
  isHealthy: string;
}
