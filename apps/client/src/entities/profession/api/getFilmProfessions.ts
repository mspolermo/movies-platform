import type {
  TGetFilmProfessionsRequest,
  TProfessionItemResponse,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

/** Получить профессии фильма */
export const getFilmProfessions = async (
  params: TGetFilmProfessionsRequest
): Promise<TProfessionItemResponse[]> => {
  const response = await apiClient.get<TProfessionItemResponse[]>(
    API_ENDPOINTS.FILMS.PROFESSIONS(params.filmId)
  );
  return Array.isArray(response.data) ? response.data : [];
};
