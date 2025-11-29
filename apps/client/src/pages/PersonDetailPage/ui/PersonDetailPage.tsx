'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { personsService } from '@/shared/api/services';
import { TFilmBased, TPersonFullWithPagination } from '@common/types';
import { PersonHeader, Professions } from '@/entities/person';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { BackArrowIcon } from '@/shared/assets/svg-icons';
import Loader from '@/shared/ui/Loader/Loader';
import { InfiniteScroll } from '@/shared/ui';
import styles from './PersonDetailPage.module.scss';
import { Filmography } from '@/entities/film';

const FILMS_PAGE_SIZE = 10;

export const PersonDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const personId = Number(params?.id);

  const [person, setPerson] = useState<TPersonFullWithPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [films, setFilms] = useState<TFilmBased[]>([]);
  const [filmsTotal, setFilmsTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreFilms, setHasMoreFilms] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        setError(null);
        const personData = await personsService.getPersonById(personId, {
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

  const handleBackClick = () => {
    router.back();
  };

  const handleLoadMore = useCallback(async () => {
    if (!person || isLoadingMore || !hasMoreFilms) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextData = await personsService.getPersonById(person.id, {
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

  if (loading) {
    return (
      <Layout>
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error || !person) {
    return (
      <Layout>
        <div className={styles.errorWrapper}>
          <div className={styles.errorMessage}>
            {error || 'Персона не найдена'}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackClick}
            aria-label="Вернуться назад"
          >
            <SvgIcon
              icon={BackArrowIcon}
              size={40}
              className={styles.backIcon}
            />
            <span className={styles.backText}>Назад</span>
          </button>

          <div className={styles.content}>
            <PersonHeader person={person} />

            {person.professions && person.professions.length > 0 && (
              <Professions professions={person.professions} />
            )}

            <Filmography
              filmsTotal={filmsTotal}
              films={films}
              onLoadMore={handleLoadMore}
              isLoading={isLoadingMore}
              hasMoreFilms={hasMoreFilms}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
