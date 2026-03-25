import type { TCountryItemResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех стран
 */
export const getCountriesList = async (): Promise<TCountryItemResponse[]> => {
  const response = await apiClient.get<TCountryItemResponse[]>(API_ENDPOINTS.COUNTRIES.LIST);

  return response.data;
};
