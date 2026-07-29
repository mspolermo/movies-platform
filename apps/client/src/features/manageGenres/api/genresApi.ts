import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TGenreAdminItemResponse,
  TUpdateGenreRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** GET `/admin/genres` — пагинированный список жанров с id. */
export const listGenres = async (
  params: TAdminListRequest = {}
): Promise<TAdminGenresListResponse> => {
  const { data } = await apiClient.get<TAdminGenresListResponse>(API_ENDPOINTS.ADMIN.GENRES.LIST, {
    params,
  });
  return data;
};

/** POST `/admin/genres` — создание жанра (409 при дубликате имени). */
export const createGenre = async (
  payload: TCreateGenreRequest
): Promise<TGenreAdminItemResponse> => {
  const { data } = await apiClient.post<TGenreAdminItemResponse>(
    API_ENDPOINTS.ADMIN.GENRES.LIST,
    payload
  );
  return data;
};

/** PATCH `/admin/genres/:id` — обновление жанра. */
export const updateGenre = async (
  id: number,
  payload: TUpdateGenreRequest
): Promise<TGenreAdminItemResponse> => {
  const { data } = await apiClient.patch<TGenreAdminItemResponse>(
    API_ENDPOINTS.ADMIN.GENRES.BY_ID(id),
    payload
  );
  return data;
};

/** DELETE `/admin/genres/:id` (409, если жанр привязан к фильмам). */
export const deleteGenre = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.GENRES.BY_ID(id));
};
