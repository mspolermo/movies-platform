import type { TPersonDetailLoadedProps } from './types';

import { Filmography } from '@/entities/film';

import styles from './PersonFilmography.module.scss';
import { usePersonFilmography } from '../lib';

export const PersonFilmography = ({ personId }: TPersonDetailLoadedProps) => {
  const {
    loading: filmsLoading,
    error: filmsError,
    filmsTotal,
    films,
    handleLoadMore,
    isLoadingMore,
    hasMoreFilms,
  } = usePersonFilmography(personId);

  if (filmsError) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>{filmsError}</div>
      </div>
    );
  }

  return (
    <Filmography
      films={films}
      filmsTotal={filmsTotal}
      hasMoreFilms={hasMoreFilms}
      isLoading={filmsLoading || isLoadingMore}
      onLoadMore={handleLoadMore}
    />
  );
};
