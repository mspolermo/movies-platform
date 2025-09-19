'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeaderDropdown.module.scss';

interface HeaderDropdownProps {
  activeDropdown: string | null;
  isClosing: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  activeDropdown,
  isClosing,
  onClose,
  onMouseEnter
}) => {
  const router = useRouter();

  const handleGenreClick = (genre: string) => {
    router.push(`/films/genre/${genre}`);
    onClose();
  };

  const handleYearClick = (year: string) => {
    router.push(`/films/year/${year}`);
    onClose();
  };

  const renderFilmsDropdown = () => (
    <div className={styles.content}>
      <div className={styles.column}>
        <h3 className={styles.heading}>Жанры</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleGenreClick('боевик')}>Боевик</p>
            <p className={styles.item} onClick={() => handleGenreClick('драма')}>Драма</p>
            <p className={styles.item} onClick={() => handleGenreClick('комедия')}>Комедия</p>
            <p className={styles.item} onClick={() => handleGenreClick('триллер')}>Триллер</p>
            <p className={styles.item} onClick={() => handleGenreClick('ужасы')}>Ужасы</p>
            <p className={styles.item} onClick={() => handleGenreClick('фантастика')}>Фантастика</p>
          </div>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleGenreClick('детектив')}>Детектив</p>
            <p className={styles.item} onClick={() => handleGenreClick('мелодрама')}>Мелодрама</p>
            <p className={styles.item} onClick={() => handleGenreClick('приключения')}>Приключения</p>
            <p className={styles.item} onClick={() => handleGenreClick('семейный')}>Семейный</p>
            <p className={styles.item} onClick={() => handleGenreClick('спорт')}>Спорт</p>
            <p className={styles.item} onClick={() => handleGenreClick('военный')}>Военный</p>
          </div>
        </div>
      </div>

      <div className={styles.column}>
        <h3 className={styles.heading}>Страны</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleGenreClick('Россия')}>Россия</p>
            <p className={styles.item} onClick={() => handleGenreClick('СССР')}>СССР</p>
            <p className={styles.item} onClick={() => handleGenreClick('США')}>США</p>
          </div>
        </div>

        <h3 className={styles.heading}>Годы</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleYearClick('2024')}>2024</p>
            <p className={styles.item} onClick={() => handleYearClick('2023')}>2023</p>
            <p className={styles.item} onClick={() => handleYearClick('2022')}>2022</p>
            <p className={styles.item} onClick={() => handleYearClick('2021')}>2021</p>
            <p className={styles.item} onClick={() => handleYearClick('2020')}>2020</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCartoonsDropdown = () => (
    <div className={styles.content}>
      <div className={styles.column}>
        <h3 className={styles.heading}>Типы</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleGenreClick('мультфильм')}>Мультфильмы</p>
            <p className={styles.item} onClick={() => handleGenreClick('аниме')}>Аниме</p>
            <p className={styles.item} onClick={() => handleGenreClick('детский')}>Детские</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={`${styles.dropdown} ${isClosing ? styles.closing : ''}`}
      onMouseLeave={onClose}
      onMouseEnter={onMouseEnter}
    >
      {activeDropdown === 'films' && renderFilmsDropdown()}
      {activeDropdown === 'cartoons' && renderCartoonsDropdown()}
    </div>
  );
};
