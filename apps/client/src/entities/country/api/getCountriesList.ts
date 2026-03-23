import type { TCountryListResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех стран
 */
export const getCountriesList = async (): Promise<TCountryListResponse> => {
  const response = await apiClient.get<TCountryListResponse>(
    API_ENDPOINTS.COUNTRIES.LIST
  );

  return response.data;
};
