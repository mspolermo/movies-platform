import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TCreatePersonRequest,
  TAdminPersonItemResponse,
  TUpdatePersonRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listPersons = async (
  params: TAdminListRequest = {}
): Promise<TAdminPersonsListResponse> => {
  const { data } = await apiClient.get<TAdminPersonsListResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.LIST,
    { params }
  );
  return data;
};

export const createPerson = async (
  payload: TCreatePersonRequest
): Promise<TAdminPersonItemResponse> => {
  const { data } = await apiClient.post<TAdminPersonItemResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.LIST,
    payload
  );
  return data;
};

export const updatePerson = async (
  id: number,
  payload: TUpdatePersonRequest
): Promise<TAdminPersonItemResponse> => {
  const { data } = await apiClient.patch<TAdminPersonItemResponse>(
    API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id),
    payload
  );
  return data;
};

export const deletePerson = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id));
};
