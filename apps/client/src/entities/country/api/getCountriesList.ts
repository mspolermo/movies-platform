'use server';

import type { TCountriesListResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех стран
 */
export const getCountriesList = async (): Promise<TCountriesListResponse> => {
  const response = await apiClient.get<TCountriesListResponse>(API_ENDPOINTS.COUNTRIES.LIST);

  return response.data;
};
