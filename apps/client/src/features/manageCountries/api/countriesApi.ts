import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TCountryAdminItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** GET `/admin/countries` — пагинированный список стран с id. */
export const listCountries = async (
  params: TAdminListRequest = {}
): Promise<TAdminCountriesListResponse> => {
  const { data } = await apiClient.get<TAdminCountriesListResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.LIST,
    { params }
  );
  return data;
};

/** POST `/admin/countries` — создание страны (409 при дубликате имени). */
export const createCountry = async (
  payload: TCreateCountryRequest
): Promise<TCountryAdminItemResponse> => {
  const { data } = await apiClient.post<TCountryAdminItemResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.LIST,
    payload
  );
  return data;
};

/** PATCH `/admin/countries/:id` — обновление страны. */
export const updateCountry = async (
  id: number,
  payload: TUpdateCountryRequest
): Promise<TCountryAdminItemResponse> => {
  const { data } = await apiClient.patch<TCountryAdminItemResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id),
    payload
  );
  return data;
};

/** DELETE `/admin/countries/:id` (409, если страна привязана к фильмам). */
export const deleteCountry = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id));
};
