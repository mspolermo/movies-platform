import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TAdminGenreItemResponse,
  TUpdateGenreRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listGenres = async (
  params: TAdminListRequest = {}
): Promise<TAdminGenresListResponse> => {
  const { data } = await apiClient.get<TAdminGenresListResponse>(API_ENDPOINTS.ADMIN.GENRES.LIST, {
    params,
  });
  return data;
};

export const createGenre = async (
  payload: TCreateGenreRequest
): Promise<TAdminGenreItemResponse> => {
  const { data } = await apiClient.post<TAdminGenreItemResponse>(
    API_ENDPOINTS.ADMIN.GENRES.LIST,
    payload
  );
  return data;
};

export const updateGenre = async (
  id: number,
  payload: TUpdateGenreRequest
): Promise<TAdminGenreItemResponse> => {
  const { data } = await apiClient.patch<TAdminGenreItemResponse>(
    API_ENDPOINTS.ADMIN.GENRES.BY_ID(id),
    payload
  );
  return data;
};

export const deleteGenre = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.GENRES.BY_ID(id));
};
