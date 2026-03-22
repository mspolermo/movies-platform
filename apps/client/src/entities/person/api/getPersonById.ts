import type { TPersonFullWithPagination } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

interface PersonFilmsParams {
  filmsLimit?: number;
  filmsOffset?: number;
}

/**
 * Получить персону по ID
 */
export const getPersonById = async (
  id: number,
  params: PersonFilmsParams = {}
): Promise<TPersonFullWithPagination> => {
  const queryParams: Record<string, number> = {};
  if (typeof params.filmsLimit === 'number') {
    queryParams.filmsLimit = params.filmsLimit;
  }
  if (typeof params.filmsOffset === 'number') {
    queryParams.filmsOffset = params.filmsOffset;
  }

  const response = await apiClient.get(API_ENDPOINTS.PERSONS.BY_ID(id), {
    params: queryParams,
  });
  return response.data;
};
