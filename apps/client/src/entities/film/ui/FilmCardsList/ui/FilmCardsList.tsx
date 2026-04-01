import type { TFilmCardsListProps } from './types';

import styles from './FilmCardsList.module.scss';
import { FilmCard, FilmCardSkeleton } from '../../FilmCard';

const SKELETON_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => i);

/**
 * Сетка карточек фильмов: ошибка, скелетоны при загрузке, пусто, либо список.
 */
export const FilmCardsList = ({ films, loading, error }: TFilmCardsListProps) => {
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (loading && films.length === 0) {
    return (
      <div className={styles.filmsGrid}>
        {SKELETON_PLACEHOLDERS.map((index) => (
          <FilmCardSkeleton key={index} showIcons={true} />
        ))}
      </div>
    );
  }

  if (films.length === 0) {
    return <div className={styles.noFilms}>Фильмы не найдены</div>;
  }

  return (
    <div className={styles.filmsGrid}>
      {films.map((film) => (
        <FilmCard key={film.id} film={film} showIcons={true} />
      ))}
    </div>
  );
};
