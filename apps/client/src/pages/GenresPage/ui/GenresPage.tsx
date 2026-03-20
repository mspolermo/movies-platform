'use client';

import { GenreCard } from '@/entities/genre';
import { Layout } from '@/widgets/Layout';
import { Skeleton } from '@/shared/ui';
import { TGenresPageProps } from './types';
import styles from './GenresPage.module.scss';

export const GenresPage = ({ isLoading, genresList}: TGenresPageProps) => {

  if (isLoading) return (
    <Layout title='Жанры'>
      <div className={styles.genresGrid}>
        {[...Array(20)].map((_, i) => (
          <Skeleton key={i} width={220} height={70} />
        ))}
      </div>
    </Layout>
  )

  return (
    <Layout title='Жанры'>
      <div className={styles.genresGrid}>
        {genresList.map((genre) => (
          <GenreCard
            key={genre.id}
            genre={genre}
          />
        ))}
      </div>
    </Layout>
  );
};
