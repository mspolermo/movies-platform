import React from 'react';
import { ActiveFilters, DEFAULT_ACTIVE_FILTERS } from '../../types/filters';
import styles from './ResetFiltersButton.module.scss';

interface ResetFiltersButtonProps {
  selectedFilters: ActiveFilters;
  setSelectedFilters: (filters: ActiveFilters) => void;
}

export const ResetFiltersButton: React.FC<ResetFiltersButtonProps> = ({
  selectedFilters,
  setSelectedFilters
}) => {
  const isEmptyFilters = JSON.stringify(selectedFilters) === JSON.stringify(DEFAULT_ACTIVE_FILTERS);

  const handleReset = () => {
    setSelectedFilters(DEFAULT_ACTIVE_FILTERS);
  };

  return (
    <div className={styles.resetFiltersButton}>
      {/* Desktop version */}
      <div className={styles.desktop}>
        <div 
          className={`${styles.resetButton} ${isEmptyFilters ? styles.resetButtonDisabled : ''}`}
          onClick={handleReset}
        >
          <div className={styles.content}>
            <div className={styles.icon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.text}>
              Сбросить фильтры
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className={styles.mobile}>
        <button 
          className={`${styles.resetButtonMobile} ${isEmptyFilters ? styles.resetButtonMobileDisabled : ''}`}
          onClick={handleReset}
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};

