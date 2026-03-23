'use client';

import type { TGenresPageProps } from './types';

import { GenreCard } from '@/entities/genre';
import { Skeleton } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './GenresPage.module.scss';

export const GenresPage = ({ isLoading, genresList }: TGenresPageProps) => {
  if (isLoading)
    return (
      <Page title="Жанры">
        <div className={styles.genresGrid}>
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} height={70} width={220} />
          ))}
        </div>
      </Page>
    );

  return (
    <Page title="Жанры">
      <div className={styles.genresGrid}>
        {genresList.map((genre, id) => (
          <GenreCard key={`${genre.nameRu}-${id}`} genre={genre} />
        ))}
      </div>
    </Page>
  );
};
