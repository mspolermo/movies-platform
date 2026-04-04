'use client';

import type { TFilmsListToolbarProps } from '../../model';

import cn from 'classnames';
import { useMemo, useState } from 'react';

import { Button, SortFilter, SvgIcon } from '@/shared/ui';

import { areFiltersDefault, getMobileFilmsSelectionSummary } from '../../lib';
import { Filters } from '../Filters';
import styles from './FilmsListToolbar.module.scss';

/**
 * Фильтры и сортировка страницы «Фильмы»: laptop и мобильная вёрстка (брейкпойнты в SCSS).
 */
export const FilmsListToolbar = ({
  allFilters,
  selectedFilters,
  onUpdateFilters,
  selectedSort,
  onUpdateSort,
}: TFilmsListToolbarProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const hasActiveFilters = useMemo(() => !areFiltersDefault(selectedFilters), [selectedFilters]);

  const selectionSummary = useMemo(
    () => getMobileFilmsSelectionSummary(selectedFilters),
    [selectedFilters]
  );

  return (
    <div className={cn(styles.root, isFiltersOpen && styles.root_filtersOpen)}>
      <header className={styles.mobileTopBar}>
        <div className={styles.lead}>
          <h1 className={styles.pageTitle}>Фильмы</h1>
          <p className={styles.selectionSummary}>{selectionSummary}</p>
        </div>
        <Button
          aria-expanded={isFiltersOpen}
          className={cn(styles.filtersToggle, hasActiveFilters && styles.filtersToggle_active)}
          icon={
            <SvgIcon
              aria-hidden
              className={cn(
                styles.filtersToggleIcon,
                hasActiveFilters && styles.filtersToggleIcon_active
              )}
              name="filters"
              size={24}
            />
          }
          size="medium"
          type="button"
          variant="outline"
          onClick={() => setIsFiltersOpen((open) => !open)}
        >
          Фильтры
        </Button>
      </header>

      <section aria-label="Фильтры" className={styles.filtersRegion}>
        <Filters
          allFilters={allFilters}
          selectedFilters={selectedFilters}
          onUpdateFilters={onUpdateFilters}
        />
      </section>

      <div className={styles.sort}>
        <SortFilter selectedSort={selectedSort} onUpdateSort={onUpdateSort} />
      </div>
    </div>
  );
};
