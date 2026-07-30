import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TCreateProfessionRequest,
  TAdminProfessionItemResponse,
  TUpdateProfessionRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listProfessions = async (
  params: TAdminListRequest = {}
): Promise<TAdminProfessionsListResponse> => {
  const { data } = await apiClient.get<TAdminProfessionsListResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.LIST,
    { params }
  );
  return data;
};

export const createProfession = async (
  payload: TCreateProfessionRequest
): Promise<TAdminProfessionItemResponse> => {
  const { data } = await apiClient.post<TAdminProfessionItemResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.LIST,
    payload
  );
  return data;
};

export const updateProfession = async (
  id: number,
  payload: TUpdateProfessionRequest
): Promise<TAdminProfessionItemResponse> => {
  const { data } = await apiClient.patch<TAdminProfessionItemResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id),
    payload
  );
  return data;
};

export const deleteProfession = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id));
};
