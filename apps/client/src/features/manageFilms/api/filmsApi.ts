import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TCreateFilmRequest,
  TUpdateFilmRequest,
} from '@common/types';

import { isAxiosError } from 'axios';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** GET `/admin/films` — пагинированный список с серверным поиском `q`. */
export const listFilms = async (
  params: TAdminListRequest = {}
): Promise<TAdminFilmsListResponse> => {
  const { data } = await apiClient.get<TAdminFilmsListResponse>(API_ENDPOINTS.ADMIN.FILMS.LIST, {
    params,
  });
  return data;
};

/** GET `/admin/films/:id`; 404 → `null` (контракт формы редактирования). */
export const getFilmById = async (id: number): Promise<TAdminFilmItemResponse | null> => {
  try {
    const { data } = await apiClient.get<TAdminFilmItemResponse>(
      API_ENDPOINTS.ADMIN.FILMS.BY_ID(id)
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};

/** POST `/admin/films` — создание фильма. */
export const createFilm = async (payload: TCreateFilmRequest): Promise<TAdminFilmItemResponse> => {
  const { data } = await apiClient.post<TAdminFilmItemResponse>(
    API_ENDPOINTS.ADMIN.FILMS.LIST,
    payload
  );
  return data;
};

/** PATCH `/admin/films/:id`; `null` в поле — очистить значение (ADR-007). */
export const updateFilm = async (
  id: number,
  payload: TUpdateFilmRequest
): Promise<TAdminFilmItemResponse> => {
  const { data } = await apiClient.patch<TAdminFilmItemResponse>(
    API_ENDPOINTS.ADMIN.FILMS.BY_ID(id),
    payload
  );
  return data;
};

/** DELETE `/admin/films/:id` — каскадное удаление фильма. */
export const deleteFilm = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.FILMS.BY_ID(id));
};
