import React, { useState } from 'react';
import { SortOption, SORT_OPTIONS } from '../../types/filters';
import styles from './Sorting.module.scss';

interface SortingProps {
  sortValue: SortOption;
  setSortValue: (value: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  popularity: 'По популярности',
  rating: 'По рейтингу',
  novelty: 'По новизне',
  alphabet: 'По алфавиту'
};

export const Sorting: React.FC<SortingProps> = ({ sortValue, setSortValue }) => {
  const [active, setActive] = useState(false);

  const handleOptionClick = (option: SortOption) => {
    setActive(false);
    setSortValue(option);
  };

  return (
    <div className={styles.sorting}>
      <div className={styles.content}>
        <div className={styles.block}>
          <div 
            className={styles.select}
            onClick={() => setActive(!active)}
          >
            <div className={styles.active}>
              <div className={styles.icon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10.5 6H5.5L8 1Z" fill="currentColor"/>
                  <path d="M8 15L5.5 10H10.5L8 15Z" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.title}>
                {sortLabels[sortValue]}
              </div>
              <div className={`${styles.arrow} ${active ? styles.arrowUp : styles.arrowDown}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {active && (
              <>
                <div 
                  className={styles.closeBlock}
                  onClick={() => setActive(false)}
                />
                <div className={styles.value}>
                  <div className={styles.subtitle}>
                    Сортировка
                  </div>
                  {SORT_OPTIONS.map((option: SortOption) => (
                    <div 
                      key={option}
                      className={`${styles.option} ${sortValue === option ? styles.optionActive : ''}`}
                      onClick={() => handleOptionClick(option)}
                    >
                      {sortLabels[option]}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
