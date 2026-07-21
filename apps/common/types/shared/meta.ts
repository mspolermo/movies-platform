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
