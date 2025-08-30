'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { Film } from '@/shared/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './FilmsPage.module.scss';

export const FilmsPage = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.FILMS.SEARCH);
        setFilms(response.data);
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
          {films.map((film) => (
            <div key={film.id} className={styles.filmCard}>
              <h3 className={styles.filmTitle}>{film.name}</h3>
              {film.year && (
                <p className={styles.filmYear}>{film.year}</p>
              )}
              {film.description && (
                <p className={styles.filmDescription}>{film.description}</p>
              )}
              {film.rating && (
                <div className={styles.filmRating}>
                  Рейтинг: {film.rating}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
