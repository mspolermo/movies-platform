/** Поля сортировки для запросов списка фильмов. */
export type TFilmSortBy = "rating" | "novelty" | "alphabet" | "popularity" ;

/** Query-параметры для поиска и фильтрации фильмов. */
export type TSearchFilmsParams = {
  page?: number;
  perPage?: number;
  years?: number[];
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: TFilmSortBy;
};

/** Параметры запроса профессий фильма. */
export type TGetFilmProfessionsRequest = {
  filmId: number;
};

/** Параметры запроса персон фильма по профессии с пагинацией. */
export type TGetFilmPersonsByProfessionRequest = {
  filmId: number;
  profession: string;
  page?: number;
  limit?: number;
};
