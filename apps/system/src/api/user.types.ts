/** 用户记录（不含 password） */
export interface UserItem {
  id: number;
  name: string;
  avatar: string;
  username: string;
  role: string;
}

/** 用户列表查询参数：分页必填，其余为可选搜索条件 */
export interface UserListParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  username?: string;
  role?: string;
}

/** 用户新增/编辑入参（password 仅新增或重置密码时提交） */
export interface UserPayload {
  id?: number;
  name: string;
  avatar: string;
  username: string;
  password?: string;
  role: string;
}
