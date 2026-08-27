/** 角色记录（permissions 为逗号分隔的权限 key 字符串，"all" 表示全量放行） */
export interface RoleItem {
  id: number;
  name: string;
  key: string;
  permissions: string;
}

/** 角色下拉选项（getAllList 返回，字段名 role_key 与真实接口保持一致） */
export interface RoleOption {
  id: number;
  name: string;
  role_key: string;
}

/** 角色列表查询参数：分页必填，其余为可选搜索条件 */
export interface RoleListParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  key?: string;
}

/** 角色新增/编辑入参 */
export interface RolePayload {
  id?: number;
  name: string;
  key: string;
  permissions: string;
}
