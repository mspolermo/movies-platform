import type { TCountryItemResponse } from "./country";
import type { TGenreItemResponse } from "./genre";

/** Ответ API для фильтров (полные списки). */
export type TFiltersResponse = {
  genres: TGenreItemResponse[];
  countries: TCountryItemResponse[];
  years: number[];
};

/** Урезанный вариант TFiltersResponse для quick-фильтров в хедере. */
export type TQuickFiltersResponse = TFiltersResponse;
