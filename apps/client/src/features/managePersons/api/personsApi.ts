import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TCreatePersonRequest,
  TPersonAdminItemResponse,
  TUpdatePersonRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** GET `/admin/persons` — пагинированный список с серверным поиском `q` (в БД ~61k персон). */
export const listPersons = async (
  params: TAdminListRequest = {}
): Promise<TAdminPersonsListResponse> => {
  const { data } = await apiClient.get<TAdminPersonsListResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.LIST,
    { params }
  );
  return data;
};

/** POST `/admin/persons` — создание персоны с professionIds. */
export const createPerson = async (
  payload: TCreatePersonRequest
): Promise<TPersonAdminItemResponse> => {
  const { data } = await apiClient.post<TPersonAdminItemResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.LIST,
    payload
  );
  return data;
};

/** PATCH `/admin/persons/:id`; `photoUrl: null` — очистить фото (ADR-007). */
export const updatePerson = async (
  id: number,
  payload: TUpdatePersonRequest
): Promise<TPersonAdminItemResponse> => {
  const { data } = await apiClient.patch<TPersonAdminItemResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id),
    payload
  );
  return data;
};

/** DELETE `/admin/persons/:id` (409, если персона участвует в фильмах). */
export const deletePerson = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id));
};
