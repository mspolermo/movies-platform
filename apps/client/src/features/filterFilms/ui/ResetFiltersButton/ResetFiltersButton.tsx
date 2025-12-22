import { useCallback } from 'react';
import cn from 'classnames';

import { ActiveFilters, DEFAULT_ACTIVE_FILTERS } from '../../types';
import { areFiltersDefault } from '../../lib';

import styles from './ResetFiltersButton.module.scss';

interface ResetFiltersButtonProps {
  selectedFilters: ActiveFilters;
  setSelectedFilters: (filters: ActiveFilters) => void;
}

export const ResetFiltersButton = ({
  selectedFilters,
  setSelectedFilters,
}: ResetFiltersButtonProps) => {
  const isDisabled = areFiltersDefault(selectedFilters);

  const handleReset = useCallback(() => {
    setSelectedFilters(DEFAULT_ACTIVE_FILTERS);
  }, [setSelectedFilters]);

  return (
    <div className={styles.root}>
      {/* Desktop */}
      <button
        type="button"
        className={cn(styles.button, styles.desktop)}
        onClick={handleReset}
        disabled={isDisabled}
      >
        <span className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <span className={styles.text}>Сбросить фильтры</span>
      </button>

      {/* Mobile */}
      <button
        type="button"
        className={cn(styles.button, styles.mobile)}
        onClick={handleReset}
        disabled={isDisabled}
      >
        Сбросить фильтры
      </button>
    </div>
  );
};
