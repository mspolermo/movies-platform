import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TAdminCountryItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listCountries = async (
  params: TAdminListRequest = {}
): Promise<TAdminCountriesListResponse> => {
  const { data } = await apiClient.get<TAdminCountriesListResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.LIST,
    { params }
  );
  return data;
};

export const createCountry = async (
  payload: TCreateCountryRequest
): Promise<TAdminCountryItemResponse> => {
  const { data } = await apiClient.post<TAdminCountryItemResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.LIST,
    payload
  );
  return data;
};

export const updateCountry = async (
  id: number,
  payload: TUpdateCountryRequest
): Promise<TAdminCountryItemResponse> => {
  const { data } = await apiClient.patch<TAdminCountryItemResponse>(
    API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id),
    payload
  );
  return data;
};

export const deleteCountry = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id));
};
