import type { TGetPersonByIdRequest, TPersonDetailsResponse } from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

//TODO: параметры запроса из common/request - сделать на эндпойнте также

/**
 * Получить персону по ID
 */
export const getPersonById = async (
  params: TGetPersonByIdRequest
): Promise<TPersonDetailsResponse> => {
  const queryParams: Record<string, number> = {};
  if (typeof params.filmsLimit === 'number') {
    queryParams.filmsLimit = params.filmsLimit;
  }
  if (typeof params.filmsOffset === 'number') {
    queryParams.filmsOffset = params.filmsOffset;
  }

  const response = await apiClient.get<TPersonDetailsResponse>(
    API_ENDPOINTS.PERSONS.BY_ID(params.id),
    {
      params: queryParams,
    }
  );
  return response.data;
};
