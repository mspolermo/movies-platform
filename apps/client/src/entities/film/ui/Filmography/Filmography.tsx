import type { TFilmBased } from '@common/types';

import React from 'react';

import { LoadMoreSection } from '@/shared/ui';

import styles from './Filmography.module.scss';
import { getFilmsWord } from '../../lib';
import { ShortFilmCard } from '../ShortFilmCard';

interface FilmographyProps {
  films: TFilmBased[];
  filmsTotal: number;
  hasMoreFilms: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}

export const Filmography = (props: FilmographyProps) => {
  const { films, filmsTotal, onLoadMore, isLoading, hasMoreFilms } = props;
  return (
    <section className={styles.container}>
      <div className={styles.filmography}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.title}>Фильмография</div>
            <div className={styles.subtitle}>
              {filmsTotal} {getFilmsWord(filmsTotal)}
            </div>
          </div>

          <div className={styles.lists}>
            <div className={styles.role}>
              <div className={styles.roleActive}>Фильмы</div>
            </div>
          </div>
        </div>
      </div>

      <LoadMoreSection
        className={styles.filmsScroll}
        hasMore={hasMoreFilms}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
      >
        <ul className={styles.filmsList}>
          {films.map((film) => (
            <li key={`${film.id}-${film.year}`}>
              <ShortFilmCard film={film} />
            </li>
          ))}
        </ul>
      </LoadMoreSection>
    </section>
  );
};
