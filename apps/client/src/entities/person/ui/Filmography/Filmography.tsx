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
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>Фильмография</div>
          <div className={styles.subtitle}>
            {moviesCount} {getFilmsWord(moviesCount)}
          </div>
        </div>

        <div className={styles.lists}>
          <div className={styles.role}>
            <div className={styles.roleActive}>Фильмы</div>
          </div>
        </div>
      </div>
    </div>
  );
};

