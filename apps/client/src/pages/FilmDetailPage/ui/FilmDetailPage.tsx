'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { TFilmWithProfessions } from '@common/types';
import styles from './FilmDetailPage.module.scss';
import { FilmDetail, FilmDetailSkeleton, getFilmById } from '@/entities/film';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';

export const FilmDetailPage: React.FC = () => {
  const params = useParams();
  const filmId = Number(params?.id);

  const [film, setFilm] = useState<TFilmWithProfessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        setLoading(true);
        setError(null);
        const filmData = await getFilmById(filmId);
        setFilm(filmData);
      } catch (err) {
        console.error('Error fetching film:', err);
        setError('Ошибка загрузки фильма');
      } finally {
        setLoading(false);
      }
    };

    if (filmId) {
      fetchFilm();
    } else {
      setError('ID фильма не найден');
      setLoading(false);
    }
  }, [filmId]);

  if (loading) {
    return (
      <Layout>
        <FilmDetailSkeleton />
      </Layout>
    );
  }

  if (error || !film) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Фильм не найден'}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <FilmDetail
        film={film}
        creatorsViewer={<FilmCreatorsViewer professions={film.professions} />}
      />
    </Layout>
  );
};
