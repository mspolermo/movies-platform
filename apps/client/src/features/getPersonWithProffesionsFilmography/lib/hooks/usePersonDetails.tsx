import type {
  TPersonDetailsResponse,
  TPersonFilmographyItemResponse,
} from '@common/types';

import { useCallback, useEffect, useState } from 'react';

import { getPersonById } from '@/entities/person';

const FILMS_PAGE_SIZE = 10;

export const usePersonDetails = (personId: number) => {
  const [person, setPerson] = useState<TPersonDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [films, setFilms] = useState<TPersonFilmographyItemResponse[]>([]);
  const [filmsTotal, setFilmsTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreFilms, setHasMoreFilms] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        setError(null);
        const personData = await getPersonById({
          id: personId,
          filmsLimit: FILMS_PAGE_SIZE,
          filmsOffset: 0,
        });
        setPerson(personData);
        const initialFilms = personData.films || [];
        const total = personData.filmsTotal ?? initialFilms.length;
        setFilms(initialFilms);
        setFilmsTotal(total);
        setHasMoreFilms(initialFilms.length < total);
      } catch (err) {
        console.error('Error fetching person:', err);
        setError('Ошибка загрузки данных персоны');
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPerson();
    } else {
      setError('ID персоны не найден');
      setLoading(false);
    }
  }, [personId]);

  const handleLoadMore = useCallback(async () => {
    if (!person || isLoadingMore || !hasMoreFilms) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextData = await getPersonById({
        id: person.id,
        filmsLimit: FILMS_PAGE_SIZE,
        filmsOffset: films.length,
      });
      const nextFilms = nextData.films || [];
      if (nextFilms.length === 0) {
        setHasMoreFilms(false);
        return;
      }

      setFilms((prev) => {
        const updated = [...prev, ...nextFilms];
        const total = nextData.filmsTotal ?? filmsTotal ?? updated.length;
        setFilmsTotal(total);
        setHasMoreFilms(updated.length < total);
        return updated;
      });

      setPerson((prev) =>
        prev
          ? {
              ...prev,
              filmsTotal: nextData.filmsTotal ?? prev.filmsTotal,
            }
          : prev
      );
    } catch (err) {
      console.error('Error loading more films:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [films.length, filmsTotal, hasMoreFilms, isLoadingMore, person]);

  return {
    loading,
    error,
    person,
    filmsTotal,
    films,
    handleLoadMore,
    isLoadingMore,
    hasMoreFilms,
  };
};
