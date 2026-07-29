import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TCreateProfessionRequest,
  TProfessionAdminItemResponse,
  TUpdateProfessionRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** GET `/admin/professions` — пагинированный список профессий с id. */
export const listProfessions = async (
  params: TAdminListRequest = {}
): Promise<TAdminProfessionsListResponse> => {
  const { data } = await apiClient.get<TAdminProfessionsListResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.LIST,
    { params }
  );
  return data;
};

/** POST `/admin/professions` — создание профессии (409 при дубликате имени). */
export const createProfession = async (
  payload: TCreateProfessionRequest
): Promise<TProfessionAdminItemResponse> => {
  const { data } = await apiClient.post<TProfessionAdminItemResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.LIST,
    payload
  );
  return data;
};

/** PATCH `/admin/professions/:id` — обновление профессии. */
export const updateProfession = async (
  id: number,
  payload: TUpdateProfessionRequest
): Promise<TProfessionAdminItemResponse> => {
  const { data } = await apiClient.patch<TProfessionAdminItemResponse>(
    API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id),
    payload
  );
  return data;
};

/** DELETE `/admin/professions/:id` (409, если профессия используется персонами). */
export const deleteProfession = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id));
};
