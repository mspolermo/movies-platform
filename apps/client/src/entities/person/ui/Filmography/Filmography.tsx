import React from 'react';
import styles from './Filmography.module.scss';

interface FilmographyProps {
  moviesCount: number;
}

const getFilmsWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'фильмов';
  }

  if (lastDigit === 1) {
    return 'фильм';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'фильма';
  }

  return 'фильмов';
};

export const Filmography: React.FC<FilmographyProps> = ({ moviesCount }) => {
  return (
    <div className={styles.filmography}>
      <div className={styles.filmography__content}>
        <div className={styles.filmography__header}>
          <div className={styles.filmography__title}>Фильмография</div>
          <div className={styles.filmography__subtitle}>
            {moviesCount} {getFilmsWord(moviesCount)}
          </div>
        </div>

        <div className={styles.filmography__lists}>
          <div className={styles.filmography__role}>
            <div className={styles.filmography__role_active}>Фильмы</div>
          </div>
        </div>
      </div>
    </div>
  );
};

