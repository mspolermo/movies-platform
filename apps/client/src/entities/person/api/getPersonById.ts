import type {
  TGetPersonByIdRequest,
  TPersonDetailsResponse,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/**
 * Получить персону по ID
 */
export const getPersonById = async (
  id: number,
  params: Omit<TGetPersonByIdRequest, 'id'> = {}
): Promise<TPersonDetailsResponse> => {
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
