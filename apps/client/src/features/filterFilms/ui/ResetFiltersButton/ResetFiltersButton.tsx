import type { TFilmsFilters } from '../../types';

import cn from 'classnames';
import { useCallback } from 'react';

import styles from './ResetFiltersButton.module.scss';
import { areFiltersDefault } from '../../lib';
import { DEFAULT_FILTERS } from '../../types';

interface ResetFiltersButtonProps {
  selectedFilters: TFilmsFilters;
  setSelectedFilters: (filters: TFilmsFilters) => void;
}

export const ResetFiltersButton = ({
  selectedFilters,
  setSelectedFilters,
}: ResetFiltersButtonProps) => {
  const isDisabled = areFiltersDefault(selectedFilters);

  const handleReset = useCallback(() => {
    setSelectedFilters(DEFAULT_FILTERS);
  }, [setSelectedFilters]);

  return (
    <div className={styles.root}>
      {/* Desktop */}
      <button
        className={cn(styles.button, styles.desktop)}
        disabled={isDisabled}
        type="button"
        onClick={handleReset}
      >
        <span className={styles.icon}>
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </span>

        <span className={styles.text}>Сбросить фильтры</span>
      </button>

      {/* Mobile */}
      <button
        className={cn(styles.button, styles.mobile)}
        disabled={isDisabled}
        type="button"
        onClick={handleReset}
      >
        Сбросить фильтры
      </button>
    </div>
  );
};
