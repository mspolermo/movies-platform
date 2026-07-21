'use client';

import type { UsePaginatedResourceOptions, UsePaginatedResourceReturn } from './types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getApiErrorMessage } from '../../utils';

const DEFAULT_ERROR = 'Ошибка загрузки';

/**
 * Постраничная подгрузка: replace / append / отмена устаревших ответов.
 * Optimistic updates списка — снаружи, в feature.
 */
export const usePaginatedResource = <TItem>({
  fetchPage,
  resetDeps = [],
  enabled = true,
  initialPage = 1,
  initialData,
  errorFallback = DEFAULT_ERROR,
}: UsePaginatedResourceOptions<TItem>): UsePaginatedResourceReturn<TItem> => {
  const [items, setItems] = useState<TItem[]>(() => initialData?.items ?? []);
  const [total, setTotal] = useState<number | undefined>(() => initialData?.total);
  const [loading, setLoading] = useState(() => enabled && !initialData);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(() => initialData?.hasMore ?? false);
  const [currentPage, setCurrentPage] = useState(() => initialData?.page ?? initialPage);

  const requestIdRef = useRef(0);
  const inFlightRef = useRef(false);
  /** Один раз пропустить fetch (когда есть `initialData`). */
  const skipFirstFetchRef = useRef(Boolean(initialData));

  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;

  const errorFallbackRef = useRef(errorFallback);
  errorFallbackRef.current = errorFallback;

  const cancelInFlight = () => {
    requestIdRef.current += 1;
    inFlightRef.current = false;
  };

  const clearList = useCallback(
    (page = initialPage) => {
      setItems([]);
      setCurrentPage(page);
      setHasMore(false);
      setError(null);
      setTotal(undefined);
    },
    [initialPage]
  );

  const loadPage = useCallback(async (page: number, replace: boolean) => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchPageRef.current(page);

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (replace) {
        setItems(response.items);
      } else {
        setItems((prev) => [...prev, ...response.items]);
      }

      setHasMore(response.hasMore);
      setCurrentPage(response.page);
      setTotal(response.total);
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      // Append fail: список не трогаем, hasMore остаётся → retry через loadMore.
      // Replace fail: фатальная ошибка первой страницы.
      if (replace) {
        setError(getApiErrorMessage(err, errorFallbackRef.current));
        setHasMore(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!enabled || !hasMore || loading || inFlightRef.current) {
      return;
    }

    await loadPage(currentPage + 1, false);
  }, [currentPage, enabled, hasMore, loadPage, loading]);

  const refetch = useCallback(async () => {
    if (!enabled) {
      return;
    }

    cancelInFlight();
    clearList();
    await loadPage(initialPage, true);
  }, [clearList, enabled, initialPage, loadPage]);

  useEffect(() => {
    if (!enabled) {
      cancelInFlight();
      clearList();
      setLoading(false);
      // Seed уже невалиден после clear — при re-enable нужен fetch.
      skipFirstFetchRef.current = false;
      return;
    }

    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }

    cancelInFlight();
    clearList();
    void loadPage(initialPage, true);

    return () => {
      cancelInFlight();
    };
    // resetDeps — явный контракт сброса; fetchPage через ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, initialPage, ...resetDeps]);

  return {
    items,
    total,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};
