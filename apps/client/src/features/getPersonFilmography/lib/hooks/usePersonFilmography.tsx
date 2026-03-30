import type { TPersonFilmsListResponse } from '@common/types';

import { useCallback, useEffect, useState } from 'react';

import { getPersonFilms } from '@/entities/film';

const DEFAULT_LIMIT = 10;

/** Фильмография персоны: первая страница, догрузка, флаги загрузки. */
export const usePersonFilmography = (personId: number | null) => {
  const [films, setFilms] = useState<TPersonFilmsListResponse>([]);
  const [filmsTotal, setFilmsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreFilms, setHasMoreFilms] = useState(false);

  useEffect(() => {
    if (personId == null) {
      setFilms([]);
      setFilmsTotal(0);
      setHasMoreFilms(false);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchFirstPage = async () => {
      try {
        setLoading(true);
        setError(null);
        setFilms([]);
        setFilmsTotal(0);
        setHasMoreFilms(false);
        const data = await getPersonFilms({
          id: personId,
          limit: DEFAULT_LIMIT,
          offset: 0,
        });
        const initialFilms = data.items || [];
        const total = data.total ?? initialFilms.length;
        setFilms(initialFilms);
        setFilmsTotal(total);
        setHasMoreFilms(data.hasMore);
      } catch (err) {
        console.error('Error fetching person filmography:', err);
        setError('Ошибка загрузки фильмографии');
      } finally {
        setLoading(false);
      }
    };

    void fetchFirstPage();
  }, [personId]);

  const handleLoadMore = useCallback(async () => {
    if (personId == null || isLoadingMore || !hasMoreFilms) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextData = await getPersonFilms({
        id: personId,
        limit: DEFAULT_LIMIT,
        offset: films.length,
      });
      const nextFilms = nextData.items || [];
      if (nextFilms.length === 0) {
        setHasMoreFilms(false);
        return;
      }

      setFilms((prev) => {
        const updated = [...prev, ...nextFilms];
        const total = nextData.total ?? filmsTotal ?? updated.length;
        setFilmsTotal(total);
        setHasMoreFilms(nextData.hasMore);
        return updated;
      });
    } catch (err) {
      console.error('Error loading more films:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [films.length, filmsTotal, hasMoreFilms, isLoadingMore, personId]);

  return {
    loading,
    error,
    filmsTotal,
    films,
    handleLoadMore,
    isLoadingMore,
    hasMoreFilms,
  };
};
