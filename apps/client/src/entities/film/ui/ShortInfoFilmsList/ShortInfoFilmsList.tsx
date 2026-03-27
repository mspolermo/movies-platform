import type { TShortInfoFilmsListProps } from './types';

import React from 'react';

import { Skeleton } from '@/shared/ui';

import styles from './ShortInfoFilmsList.module.scss';
import { ShortFilmCard } from '../ShortFilmCard';

export const ShortInfoFilmsList = ({ films, isLoading }: TShortInfoFilmsListProps) => {
  if (isLoading) {
    return (
      <div className={styles.filmsList}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height={120} />
        ))}
      </div>
    );
  }

  if (films.length === 0) {
    return <div className={styles.emptyState}>Фильмы не найдены</div>;
  }

  return (
    <ul className={styles.filmsList}>
      {films.map((film) => (
        <li key={`${film.id}-${film.year}`}>
          <ShortFilmCard film={film} />
        </li>
      ))}
    </ul>
  );
};
