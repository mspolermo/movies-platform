'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import styles from './FilmDetailPage.module.scss';
import { FilmDetail, FilmDetailSkeleton } from '@/entities/film';
import { FilmCreatorsViewer } from '@/widgets/FilmCreatorsViewer';
import { useFilmDetails } from '@/features/getFilmDetails';

export const FilmDetailPage = () => {
  const params = useParams();
  const filmId = Number(params?.id);

  const { loading, error, film } = useFilmDetails(filmId)

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
