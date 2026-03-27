import type { TPersonDetailLoadedProps } from './types';

import { ShortInfoFilmsList } from '@/entities/film';
import { LoadMoreSection } from '@/shared/ui';

import styles from './PersonFilmography.module.scss';
import { getFilmsWord, usePersonFilmography } from '../lib';

export const PersonFilmography = ({ personId }: TPersonDetailLoadedProps) => {
  const {
    loading,
    error,
    filmsTotal,
    films,
    handleLoadMore,
    isLoadingMore,
    hasMoreFilms,
  } = usePersonFilmography(personId);

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>Фильмография</div>
          {Boolean(filmsTotal) && <div className={styles.subtitle}>
            {filmsTotal} {getFilmsWord(filmsTotal)}
          </div>}
        </div>

        <div className={styles.role}>
          <div className={styles.roleActive}>Фильмы</div>
        </div>
      </div>

      <LoadMoreSection
        className={styles.filmsScroll}
        hasMore={hasMoreFilms}
        isLoading={isLoadingMore}
        loadingComponent={<ShortInfoFilmsList films={[]} isLoading={true} />}
        onLoadMore={handleLoadMore}
      >
        <ShortInfoFilmsList films={films} isLoading={loading} />
      </LoadMoreSection>
    </>
  );
};
