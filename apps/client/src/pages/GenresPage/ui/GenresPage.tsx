'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { TGenreBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { Loader, FilterCardButton } from '@/shared/ui';
import styles from './GenresPage.module.scss';

export const GenresPage = () => {
  const router = useRouter();
  const [genres, setGenres] = useState<TGenreBased[]>([]);
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

  const handleGenreClick = (genreNameRu: string) => {
    const params = new URLSearchParams();
    params.set('genres', genreNameRu);
    router.push(`/films?${params.toString()}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loaderWrapper}>
          <Loader size="small" />
        </div>
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
            <FilterCardButton
              key={genre.id}
              onClick={() => handleGenreClick(genre.nameRu)}
              ariaLabel={`Открыть фильмы жанра ${genre.nameRu}`}
            >
              <h3 className={styles.genreName}>{genre.nameRu}</h3>
              {genre.nameEn && (
                <p className={styles.genreDescription}>{genre.nameEn}</p>
              )}
            </FilterCardButton>
          ))}
        </div>
      </div>
    </Layout>
  );
};
