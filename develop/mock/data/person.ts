import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 示例人员记录（example 应用） */
export interface PersonRecord {
  id: number;
  name: string;
  age: number;
  sex: string;
  ethnic: string;
  isHealthy: string;
}

export const persons: PersonRecord[] = [
  { id: 1, name: "张三", age: 28, sex: "1", ethnic: "汉族", isHealthy: "是" },
  { id: 2, name: "李四", age: 35, sex: "1", ethnic: "满族", isHealthy: "是" },
  { id: 3, name: "王芳", age: 24, sex: "2", ethnic: "回族", isHealthy: "否" },
  { id: 4, name: "赵敏", age: 42, sex: "2", ethnic: "蒙古族", isHealthy: "是" },
];

/** 人员列表查询参数（分页 + 可选搜索条件） */
export interface PersonListQuery {
  pageNumber?: number;
  pageSize?: number;
  name?: string;
  age?: number;
  sex?: string;
  ethnic?: string;
  isHealthy?: string;
}

/** 人员新增/更新入参 */
export interface PersonPayload {
  id?: number;
  name?: string;
  age?: number;
  sex?: string;
  ethnic?: string;
  isHealthy?: string;
}

export function getList(data: PersonListQuery = {}) {
  const { pageNumber, pageSize, name, age, sex, ethnic, isHealthy } = data;
  const filters: Record<string, unknown> = { name, age, sex, ethnic, isHealthy };
  const filtered = fuzzyFilter(persons, filters);
  const { list, total: count } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total: count });
}

export function getDetail(data: { id: number }) {
  const person = findById(persons, data?.id);
  if (!person) return fail("人员不存在");
  return ok(person);
}

export function create(data: PersonPayload) {
  const person: PersonRecord = {
    id: nextId(persons),
    name: data?.name || "",
    age: data?.age ?? 0,
    sex: data?.sex || "",
    ethnic: data?.ethnic || "",
    isHealthy: data?.isHealthy || "",
  };
  persons.push(person);
  return ok(null);
}

export function update(data: PersonPayload) {
  if (!data.id) return fail("人员不存在");
  const person = findById(persons, data.id);
  if (!person) return fail("人员不存在");
  person.name = data?.name ?? person.name;
  person.age = data?.age ?? person.age;
  person.sex = data?.sex ?? person.sex;
  person.ethnic = data?.ethnic ?? person.ethnic;
  person.isHealthy = data?.isHealthy ?? person.isHealthy;
  return ok(null);
}

export function deletePersons(data: { idList?: number[] }) {
  removeByIdList(persons, data?.idList || []);
  return ok(null);
}
