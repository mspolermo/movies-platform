import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { TGenreBased, TCountryBased } from '@common/types';

export interface DropdownFilters {
  genres: TGenreBased[];
  countries: TCountryBased[];
  years: number[];
}

export async function getDropdownFilters(): Promise<DropdownFilters> {
  const [genresRes, countriesRes, filtersRes] = await Promise.all([
    apiClient.get(API_ENDPOINTS.GENRES.LIST),
    apiClient.get(API_ENDPOINTS.COUNTRIES.LIST),
    apiClient.get(API_ENDPOINTS.FILTERS.ROOT),
  ]);

  const years = filtersRes.data?.years || [];

  return {
    genres: Array.isArray(genresRes.data) ? genresRes.data : [],
    countries: Array.isArray(countriesRes.data) ? countriesRes.data : [],
    years: [...years].sort((a, b) => b - a).slice(0, 10),
  };
}