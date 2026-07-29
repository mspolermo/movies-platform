import type { TPaginatedItemsResponse } from "@common/types";

/** Собирает единый `{ items } & TPaginationMeta`. */
export function toPaginatedItemsResponse<TItem>(
  items: TItem[],
  total: number,
  page: number,
  perPage: number
): TPaginatedItemsResponse<TItem> {
  return {
    items,
    total,
    page,
    perPage,
    hasMore: (page - 1) * perPage + items.length < total,
  };
}
