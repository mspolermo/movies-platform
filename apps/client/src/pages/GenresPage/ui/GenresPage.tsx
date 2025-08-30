'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { Genre } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './GenresPage.module.scss';

export const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GENRES.LIST);
        setGenres(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки жанров');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
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
        <h1 className={styles.title}>Жанры</h1>
        
        <div className={styles.genresGrid}>
          {genres.map((genre) => (
            <div key={genre.id} className={styles.genreCard}>
              <h3 className={styles.genreName}>{genre.nameRu}</h3>
              <p className={styles.genreDescription}>{genre.nameEn}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
