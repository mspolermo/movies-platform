import type { TCountryBased } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить список всех стран
 */
export const getCountriesList = async (): Promise<TCountryBased[]> => {
  const response = await apiClient.get<TCountryBased[]>(
    API_ENDPOINTS.COUNTRIES.LIST
  );

  return response.data;
};
