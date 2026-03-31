'use client';

import type { SortOption } from '@/features/filterFilms';
import type { TSearchFilmsParams } from '@common/types';

import cn from 'classnames';
import { useMemo, type ReactNode } from 'react';

import { FilmCard, FilmCardSkeleton } from '@/entities/film';
import { Filters, SortFilter, useFilters } from '@/features/filterFilms';
import { LoadMoreFilms } from '@/features/loadMoreFilms';
import { Page } from '@/widgets/Layout';

import styles from './FilmsPage.module.scss';

const FilmsGrid = ({ children }: { children: ReactNode }) => (
  <div className={cn(styles.filmsGrid)}>{children}</div>
);

const SKELETON_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => i);

export const FilmsPage = () => {
  const {
    allFilters,
    selectedFilters,
    sortValue,
    isEmptyFilters,
    setSortValue,
    updateFilters,
    buildFilterParams,
  } = useFilters();

  const currentParams = useMemo(() => {
    return buildFilterParams(selectedFilters, 1, 20, sortValue);
  }, [selectedFilters, sortValue, buildFilterParams]);

  const handleParamsChange = (_params: TSearchFilmsParams) => {
    // Параметры обновляются автоматически через useMemo
  };

  const handleSortChange = (newSort: string) => {
    const nextSort = newSort as SortOption;
    setSortValue(nextSort);
  };

  const skeletonGrid = (
    <FilmsGrid>
      {SKELETON_PLACEHOLDERS.map((index) => (
        <FilmCardSkeleton key={index} showIcons={true} />
      ))}
    </FilmsGrid>
  );

  //TODO: мобильные фильтры не работают, разобраться со стилями

  return (
    <Page title="Фильмы">
      <div className={styles.desktopWrap}>
        <Filters
          allFilters={allFilters}
          selectedFilters={selectedFilters}
          setSelectedFilters={updateFilters}
        />
        <div className={styles.desktopSort}>
          <SortFilter setSortValue={handleSortChange} sortValue={sortValue} />
        </div>
      </div>

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
              {!selectedFilters.years ? 'все годы' : selectedFilters.years}
            </div>
          </div>
          <button
            className={cn(styles.mobileFilterBtn, !isEmptyFilters && styles.mobileFilterBtnActive)}
            type="button"
            onClick={() => {
              /* TODO: открыть модальное окно с фильтрами */
            }}
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
            {!isEmptyFilters && <span aria-hidden className={styles.filterDot} />}
          </button>
        </div>

        <div className={styles.mobileSortRow}>
          <SortFilter setSortValue={handleSortChange} sortValue={sortValue} />
        </div>
      </div>

      <LoadMoreFilms
        initialParams={currentParams}
        loadingComponent={skeletonGrid}
        onParamsChange={handleParamsChange}
      >
        {(films, loading, error) => {
          if (error) {
            return <div className={styles.error}>{error}</div>;
          }

          if (loading && films.length === 0) {
            return skeletonGrid;
          }

          return (
            <FilmsGrid>
              {films && films.length > 0 ? (
                films.map((film) => <FilmCard key={film.id} film={film} showIcons={true} />)
              ) : (
                <div className={styles.noFilms}>Фильмы не найдены</div>
              )}
            </FilmsGrid>
          );
        }}
      </LoadMoreFilms>
    </Page>
  );
};
