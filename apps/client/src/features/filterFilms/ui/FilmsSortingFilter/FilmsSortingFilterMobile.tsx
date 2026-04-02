import type { TFilmsSortingFilterProps } from '../../types';

import cn from 'classnames';
import { useCallback, useState } from 'react';

import { SortFilter } from '@/shared/ui';

import styles from './FilmsSortingFilter.module.scss';
import { DEFAULT_FILTERS } from '../../types';
import { Filters } from '../Filters';

export const FilmsSortingFilterMobile = ({
  allFilters,
  selectedFilters,
  onUpdateFilters,
  selectedSort,
  onUpdateSort,
}: TFilmsSortingFilterProps) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const isEmptyFilters = useCallback(() => {
    return JSON.stringify(selectedFilters) === JSON.stringify(DEFAULT_FILTERS);
  }, [selectedFilters]);

  const handleToggleFilters = useCallback(() => {
    setIsFiltersExpanded((open) => !open);
  }, []);

  return (
    <div className={styles.mobileWrap}>
      <div className={styles.mobileHeader}>
        <div className={styles.mobileTitleBlock}>
          <h1 className={styles.mobileHeading}>Фильмы</h1>
          <div className={styles.mobileSubtitle}>
            {!selectedFilters.genres.length
              ? 'Все жанры, '
              : `${selectedFilters.genres.join(', ')}, `}
            {!selectedFilters.countries.length
              ? 'все страны, '
              : `${selectedFilters.countries.join(', ')}, `}
            {selectedFilters.year === null ? 'все годы' : selectedFilters.year}
          </div>
        </div>
        <button
          aria-expanded={isFiltersExpanded}
          className={cn(styles.mobileFilterBtn, !isEmptyFilters() && styles.mobileFilterBtnActive)}
          type="button"
          onClick={handleToggleFilters}
        >
          <svg
            aria-hidden
            className={styles.mobileFilterIcon}
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M3 7H21M9 12H21M17 17H21"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
          Фильтры
          {!isEmptyFilters() && <span aria-hidden className={styles.filterDot} />}
        </button>
      </div>

      {isFiltersExpanded && (
        <div className={styles.mobileFiltersPanel}>
          <Filters
            allFilters={allFilters}
            selectedFilters={selectedFilters}
            onUpdateFilters={onUpdateFilters}
          />
        </div>
      )}

      <div className={styles.mobileSortRow}>
        <SortFilter selectedSort={selectedSort} onUpdateSort={onUpdateSort} />
      </div>
    </div>
  );
};
