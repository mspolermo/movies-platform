/** Метаданные пагинации для списков */
export type TPaginationMeta = {
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
};