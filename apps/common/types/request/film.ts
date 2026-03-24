/** Поля сортировки для запросов списка фильмов. */
export type TFilmSortBy = "rating" | "novelty" | "alphabet" | "popularity";

/** Query-параметры для поиска и фильтрации фильмов. */
export interface TSearchFilmsParams {
  page?: number;
  perPage?: number;
  year?: number;
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: TFilmSortBy;
}
