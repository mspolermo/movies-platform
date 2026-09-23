/** Метаданные пагинации для списков */
export type TPaginationMeta = {
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
};

/** Пагинированный список с `items` + meta. */
export type TPaginatedItemsResponse<T> = {
  items: T[];
} & TPaginationMeta;

/** Пагинированный Нормализованные список с опциональным поиском для list-запросов. */
export type TListParams = {
  page: number;
  perPage: number;
  offset: number;
  q?: string;
};