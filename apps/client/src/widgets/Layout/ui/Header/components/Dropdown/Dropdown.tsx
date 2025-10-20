'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dropdown.module.scss';

interface HeaderDropdownProps {
  isClosing: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
}

export const Dropdown: React.FC<HeaderDropdownProps> = ({
  isClosing,
  onClose,
  onMouseEnter,
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
            <p
              className={styles.item}
              onClick={() => handleGenreClick('боевик')}
            >
              Боевик
            </p>
          </div>
          <div className={styles.column}>
            <p
              className={styles.item}
              onClick={() => handleGenreClick('детектив')}
            >
              Детектив
            </p>
          </div>
        </div>
      </div>

      <div className={styles.column}>
        <h3 className={styles.heading}>Страны</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p
              className={styles.item}
              onClick={() => handleGenreClick('Россия')}
            >
              Россия
            </p>
          </div>
        </div>

        <h3 className={styles.heading}>Годы</h3>
        <div className={styles.list}>
          <div className={styles.column}>
            <p className={styles.item} onClick={() => handleYearClick('2024')}>
              2024
            </p>
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
      {renderFilmsDropdown()}
    </div>
  );
};
