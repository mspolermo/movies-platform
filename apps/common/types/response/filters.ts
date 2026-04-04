/**
 * Ответ API для фильтров: подписи жанров и стран в запрошенной локали (`locale` query).
 * `years` — по убыванию (новые первыми); на `/filters/quick` дополнительно обрезается лимитом.
 */
export type TFiltersResponse = {
  genres: string[];
  countries: string[];
  years: number[];
};

/** Урезанный вариант TFiltersResponse для quick-фильтров в хедере. */
export type TQuickFiltersResponse = TFiltersResponse;
