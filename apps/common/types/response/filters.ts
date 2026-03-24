import type { TCountryItemResponse } from "./country";
import type { TGenreItemResponse } from "./genre";

/** Ответ API для фильтров. */
export interface TFiltersResponse {
  genres: TGenreItemResponse[];
  countries: TCountryItemResponse[];
  years: number[];
}

/** Ответ API для быстрых фильтров (жанры, страны, годы). */
export interface TQuickFiltersResponse {
  genres: TGenreItemResponse[];
  countries: TCountryItemResponse[];
  years: number[];
}
