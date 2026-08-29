import request from "@Passets/request";
import type { PageResult } from "@Passets/request";
import type {
  PersonItem,
  PersonListParams,
  PersonPayload,
} from "./person.types";

export * from "./person.types";

export const getPersonList = (data: PersonListParams) =>
  request.post<PageResult<PersonItem>>({ url: "/example/person/getList", data });

export const getPersonDetail = (data: { id: number }) =>
  request.get<PersonItem>({ url: "/example/person/getDetail", data });

export const createPerson = (data: PersonPayload) =>
  request.post({ url: "/example/person/create", data });

export const updatePerson = (data: PersonPayload) =>
  request.post({ url: "/example/person/update", data });

export const deletePersons = (idList: number[]) =>
  request.post({ url: "/example/person/delete", data: { idList } });
