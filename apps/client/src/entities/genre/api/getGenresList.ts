import apiClient from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { TCountryBased, TGenreBased } from "@common/types";

/**
  * Получить список всех жанров
*/ 
export const getGenresList = async (): Promise<TGenreBased[]> => {
  const response = await apiClient.get<TGenreBased[]>(API_ENDPOINTS.GENRES.LIST);

  return response.data
} 