import type { TPaginatedItemsResponse } from '@common/types';

/** Конфиг постраничной подгрузки. */
export type UsePaginatedResourceOptions<TItem> = {
  /** Загрузка страницы `page` (meta — с бэка). */
  fetchPage: (page: number) => Promise<TPaginatedItemsResponse<TItem>>;
  /** Смена любого значения → clear + fetch page 1. */
  resetDeps?: readonly unknown[];
  /** `false` → clear, без запросов. */
  enabled?: boolean;
  /** Стартовая страница (по умолчанию 1). */
  initialPage?: number;
  /** RSC/SSR seed: в state сразу, первый client-fetch пропускаем. */
  initialData?: TPaginatedItemsResponse<TItem>;
  /** Текст ошибки, если API не вернул `message`. */
  errorFallback?: string;
};

/** Публичное API хука. */
export type UsePaginatedResourceReturn<TItem> = {
  items: TItem[];
  total: number | undefined;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  /** Append следующей страницы. */
  loadMore: () => Promise<void>;
  /** Clear + replace с `initialPage`. */
  refetch: () => Promise<void>;
};
