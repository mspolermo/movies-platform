import React from 'react';
import styles from './Filmography.module.scss';
import { InfiniteScroll } from '@/shared/ui';
import { ShortFilmCard } from '../ShortFilmCard';
import { TFilmBased } from '@common/types';
import { getFilmsWord } from '../../lib';

interface FilmographyProps {
  films: TFilmBased[]
  filmsTotal: number;
  hasMoreFilms: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>
}

export const Filmography = (props: FilmographyProps) => {
  const { films, filmsTotal, onLoadMore, isLoading, hasMoreFilms } = props
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

      <InfiniteScroll
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        hasMore={hasMoreFilms}
        className={styles.filmsScroll}
      >
        <ul className={styles.filmsList}>
          {films.map((film) => (
            <li key={`${film.id}-${film.year}`}>
              <ShortFilmCard film={film} />
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </section>
  );
};

