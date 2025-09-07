import { useState, useEffect, useCallback, useRef } from 'react';
import { TFilmBased } from '@common/types';
import { filmsService, SearchFilmsParams, FilmsResponse } from '@/shared/api/services';

interface UseFilmsInfiniteScrollOptions {
  initialParams?: SearchFilmsParams;
  threshold?: number;
}

interface UseFilmsInfiniteScrollReturn {
  films: TFilmBased[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useFilmsInfiniteScroll = ({
  initialParams = {},
  threshold = 200,
}: UseFilmsInfiniteScrollOptions = {}): UseFilmsInfiniteScrollReturn => {
  const [films, setFilms] = useState<TFilmBased[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState<SearchFilmsParams>(initialParams);
  
  const isLoadingRef = useRef(false);

  const loadFilms = useCallback(async (page: number, reset = false) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response: FilmsResponse = await filmsService.searchFilms({
        ...params,
        page,
        perPage: 20,
      });

      if (reset) {
        setFilms(response.films);
      } else {
        setFilms(prev => [...prev, ...response.films]);
      }
      
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка загрузки фильмов');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [params]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadFilms(currentPage + 1, false);
  }, [hasMore, loading, currentPage, loadFilms]);

  const reset = useCallback(() => {
    setFilms([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    loadFilms(1, true);
  }, [loadFilms]);

  // Загрузка при изменении параметров
  useEffect(() => {
    reset();
  }, [params]);

  return {
    films,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};
