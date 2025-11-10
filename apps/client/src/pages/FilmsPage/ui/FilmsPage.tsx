'use client';

import { useState } from 'react';
import { Layout } from '@/widgets/Layout';
import { FilmCard, FilmCardSkeleton } from '@/entities/film';
import { FilmsInfiniteScroll } from '@/features/films/infinite-scroll/ui/FilmsInfiniteScroll';
import { Filters, SortFilter, useFilters } from '@/features/films/filters';
import { SortOption } from '@/features/films/filters/types/filters';
import { SearchFilmsParams } from '@/shared/api/services';
import styles from './FilmsPage.module.scss';

export const FilmsPage = () => {
  const {
    allFilters,
    selectedFilters,
    sortValue,
    isEmptyFilters,
    setSortValue,
    updateFilters,
    getFilterParams,
    buildFilterParams
  } = useFilters();

  const [currentParams, setCurrentParams] = useState<SearchFilmsParams>({});

  const handleParamsChange = (params: SearchFilmsParams) => {
    setCurrentParams(params);
  };

  const handleSortChange = (newSort: string) => {
    const nextSort = newSort as SortOption;
    setSortValue(nextSort);
    const newParams: SearchFilmsParams = buildFilterParams(selectedFilters, 1, 20, nextSort);
    setCurrentParams(newParams);
  };

  const handleFiltersUpdate = (nextFilters: typeof selectedFilters) => {
    const newParams: SearchFilmsParams = buildFilterParams(nextFilters, 1, 20);
    setCurrentParams(newParams);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Фильмы</h1>
          
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
              <SortFilter sortValue={sortValue} setSortValue={handleSortChange} />
            </div>
          </div>

          {/* Mobile filters */}
          <div className={styles.mobileFilters}>
            <div className={styles.mobileHeader}>
              <div className={styles.mobileTitle}>
                <h1>Фильмы</h1>
                <div className={styles.mobileSubtitle}>
                  {!selectedFilters.genres.length ? 'Все жанры, ' : `${selectedFilters.genres.join(', ')}, `}
                  {!selectedFilters.countries.length ? 'все страны, ' : `${selectedFilters.countries.join(', ')}, `}
                  {!selectedFilters.years ? 'все годы' : selectedFilters.years}
                </div>
              </div>
              <div className={styles.mobileControls}>
                <button 
                  className={styles.mobileFilterButton}
                  onClick={() => {/* TODO: открыть модальное окно с фильтрами */}}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7H21M9 12H21M17 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Фильтры
                  {!isEmptyFilters && <div className={styles.filterIndicator} />}
                </button>
              </div>
            </div>
            
            <div className={styles.mobileSorting}>
              <SortFilter sortValue={sortValue} setSortValue={handleSortChange} />
            </div>
          </div>
        </div>

        <FilmsInfiniteScroll
          initialParams={currentParams}
          threshold={200}
          className={styles.filmsContainer}
          onParamsChange={handleParamsChange}
          loadingComponent={
            <div className={styles.filmsGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={`skeleton-${index}`} className={styles.filmCard}>
                  <FilmCardSkeleton showIcons={true} />
                </div>
              ))}
            </div>
          }
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
                    <div key={`skeleton-${index}`} className={styles.filmCard}>
                      <FilmCardSkeleton showIcons={true} />
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className={styles.filmsGrid}>
                {films && films.length > 0 ? (
                  films.map((film) => (
                    <div key={film.id} className={styles.filmCard}>
                      <FilmCard film={film} showIcons={true} />
                    </div>
                  ))
                ) : (
                  <div className={styles.noFilms}>Фильмы не найдены</div>
                )}
              </div>
            );
          }}
        </FilmsInfiniteScroll>
      </div>
    </Layout>
  );
};
