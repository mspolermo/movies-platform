'use client';

import type { TGenresPageProps } from './types';

import { GenreCard } from '@/entities/genre';
import { Skeleton } from '@/shared/ui';
import { Layout } from '@/widgets/Layout';

import styles from './GenresPage.module.scss';

export const GenresPage = ({ isLoading, genresList }: TGenresPageProps) => {
  if (isLoading)
    return (
      <Layout title="Жанры">
        <div className={styles.genresGrid}>
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} height={70} width={220} />
          ))}
        </div>
      </Layout>
    );

  return (
    <Layout title="Жанры">
      <div className={styles.genresGrid}>
        {genresList.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </Layout>
  );
};
