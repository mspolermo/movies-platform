import type { TGenresListProps } from './types';

import { Skeleton } from '@/shared/ui';

import styles from './GenresList.module.scss';
import { GenreCard } from '../../GenreCard';

/**
 * Список жанров. Отображает список жанров, загрузку и пустое состояние.
 */
export const GenresList = ({ isLoading, genresList }: TGenresListProps) => {
  if (isLoading) {
    return (
      <div className={styles.genresGrid}>
        {[...Array(20)].map((_, i) => (
          <Skeleton key={i} height={70} width={220} />
        ))}
      </div>
    );
  }

  if (genresList.length === 0)
    return (
      <div className={styles.countriesGrid}>
        <div className={styles.emptyState}>Жанры не найдены</div>
      </div>
    );

  return (
    <div className={styles.genresGrid}>
      {genresList.map((genre, id) => (
        <GenreCard key={`${genre.nameRu}-${id}`} genre={genre} />
      ))}
    </div>
  );
};
