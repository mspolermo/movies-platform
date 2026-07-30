import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TCreateFilmRequest,
  TUpdateFilmRequest,
} from '@common/types';

import { isAxiosError } from 'axios';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listFilms = async (
  params: TAdminListRequest = {}
): Promise<TAdminFilmsListResponse> => {
  const { data } = await apiClient.get<TAdminFilmsListResponse>(API_ENDPOINTS.ADMIN.FILMS.LIST, {
    params,
  });
  return data;
};

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

export const createFilm = async (payload: TCreateFilmRequest): Promise<TAdminFilmItemResponse> => {
  const { data } = await apiClient.post<TAdminFilmItemResponse>(
    API_ENDPOINTS.ADMIN.FILMS.LIST,
    payload
  );
  return data;
};

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

export const deleteFilm = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.FILMS.BY_ID(id));
};
