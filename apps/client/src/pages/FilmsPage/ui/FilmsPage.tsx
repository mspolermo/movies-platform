'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { FilmCard } from '@/entities/film';
import { filmsService } from '@/shared/api/services';
import { TFilmBased } from '@common/types';
import styles from './FilmsPage.module.scss';

export const FilmsPage = () => {
  const [films, setFilms] = useState<TFilmBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await filmsService.searchFilms();
        setFilms(response.films);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки фильмов');
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Загрузка...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.error}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Фильмы</h1>
        
        <div className={styles.filmsGrid}>
          {films && films.length > 0 ? (
            films.map((film) => (
              <FilmCard 
                key={film.id} 
                film={film} 
                showIcons={true}
              />
            ))
          ) : (
            <div className={styles.noFilms}>
              Фильмы не найдены
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
