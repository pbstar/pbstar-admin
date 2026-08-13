import { ok, fail, paginate, fuzzyFilter, removeByIdList, findById, nextId } from "../utils";

/** 示例人员记录（example 应用） */
export interface PersonRecord {
  id: any;
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

export function getList(data: any) {
  const { pageNumber, pageSize, total, ...filters } = data || {};
  const filtered = fuzzyFilter(persons, filters);
  const { list, total: count } = paginate(filtered, pageNumber, pageSize);
  return ok({ list, total: count });
}

export function getDetail(data: any) {
  const person = findById(persons, data?.id);
  if (!person) return fail("人员不存在");
  return ok(person);
}

export function create(data: any) {
  const person: PersonRecord = {
    id: nextId(),
    name: data?.name || "",
    age: data?.age ?? 0,
    sex: data?.sex || "",
    ethnic: data?.ethnic || "",
    isHealthy: data?.isHealthy || "",
  };
  persons.push(person);
  return ok(null);
}

export function update(data: any) {
  const person = findById(persons, data?.id);
  if (!person) return fail("人员不存在");
  person.name = data?.name ?? person.name;
  person.age = data?.age ?? person.age;
  person.sex = data?.sex ?? person.sex;
  person.ethnic = data?.ethnic ?? person.ethnic;
  person.isHealthy = data?.isHealthy ?? person.isHealthy;
  return ok(null);
}

export function deletePersons(data: any) {
  removeByIdList(persons, data?.idList || []);
  return ok(null);
}
