'use client';

import type { SortOption } from '@/features/filterFilms';
import type { TSearchFilmsParams } from '@common/types';

import { useMemo } from 'react';

import { FilmCard, FilmCardSkeleton } from '@/entities/film';
import { Filters, SortFilter, useFilters } from '@/features/filterFilms';
import { LoadMoreFilms } from '@/features/loadMoreFilms';
import { Page } from '@/widgets/Layout';

import styles from './FilmsPage.module.scss';

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

  // Вычисляем параметры на основе selectedFilters и sortValue
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

  const handleFiltersUpdate = (nextFilters: typeof selectedFilters) => {
    // Параметры обновляются автоматически через useMemo при изменении selectedFilters
    updateFilters(nextFilters);
  };

  //TODO: мобильные фильтры не работают, разобраться со стилями

  return (
    <Page title="Фильмы">
      {/* Desktop filters */}
      <div className={styles.filtersBlock}>
        <div className={styles.filtersContainer}>
          <Filters
            allFilters={allFilters}
            selectedFilters={selectedFilters}
            setSelectedFilters={(filters) => {
              updateFilters(filters);
              handleFiltersUpdate(filters);
            }}
          />
        </div>
        <div className={styles.sortingContainer}>
          <SortFilter setSortValue={handleSortChange} sortValue={sortValue} />
        </div>
      </div>

      {/* Mobile filters */}
      <div className={styles.mobileFilters}>
        <div className={styles.mobileHeader}>
          <div className={styles.mobileTitle}>
            <h1>Фильмы</h1>
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
          <div className={styles.mobileControls}>
            <button
              className={styles.mobileFilterButton}
              onClick={() => {
                /* TODO: открыть модальное окно с фильтрами */
              }}
            >
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
                <path
                  d="M3 7H21M9 12H21M17 17H21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
              Фильтры
              {!isEmptyFilters && <div className={styles.filterIndicator} />}
            </button>
          </div>
        </div>

        <div className={styles.mobileSorting}>
          <SortFilter setSortValue={handleSortChange} sortValue={sortValue} />
        </div>
      </div>

      <LoadMoreFilms
        initialParams={currentParams}
        loadingComponent={
          <div className={styles.filmsGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <FilmCardSkeleton key={`skeleton-${index}`} showIcons={true} />
            ))}
          </div>
        }
        onParamsChange={handleParamsChange}
      >
        {(films, loading, error) => {
          if (error) {
            return <div className={styles.error}>{error}</div>;
          }

          // Показываем скелетоны во время первой загрузки
          if (loading && films.length === 0) {
            return (
              <div className={styles.filmsGrid}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <FilmCardSkeleton key={`skeleton-${index}`} showIcons={true} />
                ))}
              </div>
            );
          }

          return (
            <div className={styles.filmsGrid}>
              {films && films.length > 0 ? (
                films.map((film) => <FilmCard key={film.id} film={film} showIcons={true} />)
              ) : (
                <div className={styles.noFilms}>Фильмы не найдены</div>
              )}
            </div>
          );
        }}
      </LoadMoreFilms>
    </Page>
  );
};
