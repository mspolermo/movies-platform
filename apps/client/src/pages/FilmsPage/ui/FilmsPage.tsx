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
              <div className={styles.filmPoster}>
                {film.posterUrl ? (
                  <img src={film.posterUrl} alt={film.filmNameRu} className={styles.poster} />
                ) : (
                  <div className={styles.posterPlaceholder}>
                    {film.filmNameRu.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className={styles.filmInfo}>
                <h3 className={styles.filmTitle}>{film.filmNameRu}</h3>
                {film.filmNameEn && film.filmNameEn !== film.filmNameRu && (
                  <p className={styles.filmTitleEn}>{film.filmNameEn}</p>
                )}
                
                <div className={styles.filmMeta}>
                  {film.year && (
                    <span className={styles.filmYear}>{film.year}</span>
                  )}
                  {film.duration && (
                    <span className={styles.filmDuration}>{film.duration} мин</span>
                  )}
                </div>
                
                {film.description && (
                  <p className={styles.filmDescription}>
                    {film.description.length > 150 
                      ? `${film.description.substring(0, 150)}...` 
                      : film.description
                    }
                  </p>
                )}
                
                <div className={styles.filmRatings}>
                  {film.ratingKp && (
                    <div className={styles.rating}>
                      <span className={styles.ratingLabel}>КиноПоиск</span>
                      <span className={styles.ratingValue}>{film.ratingKp}</span>
                      {film.votesKp && (
                        <span className={styles.ratingVotes}>({film.votesKp})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
