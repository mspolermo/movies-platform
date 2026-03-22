import type { ActiveFilters, AllFilters } from '../../types';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useCallback, useEffect, useRef } from 'react';

import styles from './Filters.module.scss';
import { parseFiltersFromURL } from '../../lib';
import { FilterCheckboxList } from '../FilterCheckboxList';
import { FilterDropdown } from '../FilterDropdown';
import { PersonSearchFilter } from '../PersonSearchFilter';
import { RangeFilter } from '../RangeFilter';
import { ResetFiltersButton } from '../ResetFiltersButton';
import { YearFilter } from '../YearFilter';

interface FiltersProps {
  allFilters: AllFilters;
  selectedFilters: ActiveFilters;
  setSelectedFilters: (filters: ActiveFilters) => void;
}

const firstCharUp = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const languageFilters = (selectedValues: string[]) => {
  return selectedValues.map((value) => {
    return firstCharUp(value);
  });
};

export const Filters = ({
  allFilters,
  selectedFilters,
  setSelectedFilters,
}: FiltersProps) => {
  const [activeBlock, setActiveBlock] = useState<string[]>([]);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);

  // Функция для обновления URL с фильтрами
  const updateURL = useCallback(
    (filters: ActiveFilters) => {
      const params = new URLSearchParams();

      if (filters.genres.length > 0) {
        params.set('genres', filters.genres.join(','));
      }

      if (filters.countries.length > 0) {
        params.set('countries', filters.countries.join(','));
      }

      if (filters.years) {
        params.set('year', String(filters.years));
      }

      if (filters.rating > 0) {
        params.set('rating', String(filters.rating));
      }

      if (filters.grade > 0) {
        params.set('grade', String(filters.grade));
      }

      if (filters.producer) {
        params.set('producer', filters.producer);
      }

      if (filters.actor) {
        params.set('actor', filters.actor);
      }

      const currentPath = pathname || window.location.pathname;
      const newUrl = params.toString()
        ? `${currentPath}?${params.toString()}`
        : currentPath;
      isUpdatingFromURL.current = true;
      router.replace(newUrl, { scroll: false });
    },
    [router, pathname]
  );

  // Фильтры из URL теперь инициализируются в useFilters, здесь только синхронизация URL при изменении фильтров
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // Синхронизация фильтров при изменении URL извне (навигация назад/вперед)
  useEffect(() => {
    if (isInitialMount.current || isUpdatingFromURL.current) {
      if (isUpdatingFromURL.current) {
        isUpdatingFromURL.current = false;
      }
      return;
    }

    const urlFilters = parseFiltersFromURL(searchParams);
    const currentFiltersStr = JSON.stringify(selectedFilters);
    const urlFiltersStr = JSON.stringify(urlFilters);

    // Обновляем фильтры только если они отличаются от текущих
    if (currentFiltersStr !== urlFiltersStr) {
      setSelectedFilters(urlFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setActiveBlock([]);
      }
    };

    if (activeBlock.length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeBlock]);

  // Обертка для setSelectedFilters с обновлением URL
  const setSelectedFiltersWithURL = useCallback(
    (filters: ActiveFilters) => {
      setSelectedFilters(filters);
      updateURL(filters);
    },
    [setSelectedFilters, updateURL]
  );

  const updateFilters = useCallback(
    (updates: Partial<ActiveFilters>) => {
      const newFilters = { ...selectedFilters, ...updates };
      setSelectedFiltersWithURL(newFilters);
    },
    [selectedFilters, setSelectedFiltersWithURL]
  );

  const selectedGenres = useCallback(
    (genre: string) => {
      const arrGenres = selectedFilters.genres;
      if (arrGenres.includes(genre)) {
        updateFilters({ genres: arrGenres.filter((g) => g !== genre) });
      } else {
        updateFilters({ genres: [...arrGenres, genre] });
      }
    },
    [selectedFilters.genres, updateFilters]
  );

  const selectedCountries = useCallback(
    (country: string) => {
      const arrCountries = selectedFilters.countries;
      if (arrCountries.includes(country)) {
        updateFilters({ countries: arrCountries.filter((c) => c !== country) });
      } else {
        updateFilters({ countries: [...arrCountries, country] });
      }
    },
    [selectedFilters.countries, updateFilters]
  );

  const selectedYears = useCallback(
    (year: number | null) => {
      updateFilters({ years: year });
    },
    [updateFilters]
  );

  const selectedProducer = useCallback(
    (producer: string) => {
      updateFilters({ producer });
    },
    [updateFilters]
  );

  const selectedActor = useCallback(
    (actor: string) => {
      updateFilters({ actor });
    },
    [updateFilters]
  );

  const selectedRating = useCallback(
    (rating: number) => {
      updateFilters({ rating });
    },
    [updateFilters]
  );

  const selectedGrade = useCallback(
    (grade: number) => {
      updateFilters({ grade });
    },
    [updateFilters]
  );

  return (
    <div ref={filtersRef} className={styles.filters}>
      <div className={styles.content}>
        <div className={styles.blocks}>
          <FilterDropdown
            activeBlock={activeBlock}
            blockName="genre"
            filterName="Жанры"
            isWideMenu={true}
            selectedFiltersBy={languageFilters(selectedFilters.genres).join(
              ', '
            )}
            setActiveBlock={setActiveBlock}
          >
            <FilterCheckboxList
              allValues={allFilters.genres}
              selectedValues={selectedFilters.genres}
              onChange={selectedGenres}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="country"
            filterName="Страны"
            isWideMenu={true}
            selectedFiltersBy={languageFilters(selectedFilters.countries).join(
              ', '
            )}
            setActiveBlock={setActiveBlock}
          >
            <FilterCheckboxList
              allValues={allFilters.countries}
              selectedValues={selectedFilters.countries}
              onChange={selectedCountries}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="years"
            filterName="Год"
            selectedFiltersBy={
              selectedFilters.years ? String(selectedFilters.years) : ''
            }
            setActiveBlock={setActiveBlock}
          >
            <YearFilter
              allValues={allFilters.years}
              selectValue={
                typeof selectedFilters.years === 'number'
                  ? selectedFilters.years
                  : null
              }
              onChange={selectedYears}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="rating"
            filterName="Рейтинг"
            selectedFiltersBy={
              selectedFilters.rating === 0 ? '' : selectedFilters.rating
            }
            setActiveBlock={setActiveBlock}
          >
            <RangeFilter
              blockName="rating"
              handleChangeFilter={selectedRating}
              initialValue={selectedFilters.rating}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="grade"
            filterName="Оценки"
            selectedFiltersBy={
              selectedFilters.grade === 0 ? '' : selectedFilters.grade
            }
            setActiveBlock={setActiveBlock}
          >
            <RangeFilter
              blockName="grade"
              handleChangeFilter={selectedGrade}
              initialValue={selectedFilters.grade}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="producer"
            filterName="Режиссер"
            selectedFiltersBy={selectedFilters.producer}
            setActiveBlock={setActiveBlock}
          >
            <PersonSearchFilter
              professionId={2}
              setActiveBlock={setActiveBlock}
              onChangeFilter={selectedProducer}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="actor"
            filterName="Актер"
            selectedFiltersBy={selectedFilters.actor}
            setActiveBlock={setActiveBlock}
          >
            <PersonSearchFilter
              professionId={1}
              setActiveBlock={setActiveBlock}
              onChangeFilter={selectedActor}
            />
          </FilterDropdown>
        </div>

        <div className={styles.button}>
          <ResetFiltersButton
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFiltersWithURL}
          />
        </div>
      </div>
    </div>
  );
};
