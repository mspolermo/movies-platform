/** Локаль подписей в ответах GET /filters и GET /filters/quick. */
export type TFiltersLocale = "ru" | "en";

/** Query GET /filters и GET /filters/quick. */
export type TGetFiltersQuery = {
  locale?: TFiltersLocale;
};
