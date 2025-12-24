import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ActiveFilters, AllFilters, DEFAULT_ACTIVE_FILTERS } from '../../types/filters';
import { FilterDropdown } from '../FilterDropdown/FilterDropdown';
import { FilterCheckboxList } from '../FilterCheckboxList/FilterCheckboxList';
import { YearFilter } from '../YearFilter/YearFilter';
import { RangeFilter } from '../RangeFilter/RangeFilter';
import { PersonSearchFilter } from '../PersonSearchFilter/PersonSearchFilter';
import { ResetFiltersButton } from '../ResetFiltersButton/ResetFiltersButton';
import styles from './Filters.module.scss';

interface FiltersProps {
  allFilters: AllFilters;
  selectedFilters: ActiveFilters;
  setSelectedFilters: (filters: ActiveFilters) => void;
}

const firstCharUp = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const languageFilters = (selectedValues: string[], allValues: { nameRu: string; nameEn: string }[], language: string) => {
  return selectedValues.map(value => {
    const item = allValues.find(item => item.nameRu === value);
    if (item) {
      return language === 'en' ? firstCharUp(item.nameEn) : firstCharUp(item.nameRu);
    }
    return firstCharUp(value);
  });
};

export const Filters: React.FC<FiltersProps> = ({
  allFilters,
  selectedFilters,
  setSelectedFilters
}) => {
  const [activeBlock, setActiveBlock] = useState<string[]>([]);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const isUpdatingFromURL = useRef(false);

  // Функция для парсинга фильтров из URL
  const parseFiltersFromURL = useCallback((): ActiveFilters => {
    const filters: ActiveFilters = { ...DEFAULT_ACTIVE_FILTERS };
    
    if (!searchParams) return filters;
    
    const genres = searchParams.get('genres');
    if (genres) {
      filters.genres = genres.split(',').filter(Boolean);
    }
    
    const countries = searchParams.get('countries');
    if (countries) {
      filters.countries = countries.split(',').filter(Boolean);
    }
    
    const year = searchParams.get('year');
    if (year) {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        filters.years = yearNum;
      }
    }
    
    const rating = searchParams.get('rating');
    if (rating) {
      const ratingNum = parseFloat(rating);
      if (!isNaN(ratingNum)) {
        filters.rating = ratingNum;
      }
    }
    
    const grade = searchParams.get('grade');
    if (grade) {
      const gradeNum = parseFloat(grade);
      if (!isNaN(gradeNum)) {
        filters.grade = gradeNum;
      }
    }
    
    const producer = searchParams.get('producer');
    if (producer) {
      filters.producer = producer;
    }
    
    const actor = searchParams.get('actor');
    if (actor) {
      filters.actor = actor;
    }
    
    return filters;
  }, [searchParams]);

  // Функция для обновления URL с фильтрами
  const updateURL = useCallback((filters: ActiveFilters) => {
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
    const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
    isUpdatingFromURL.current = true;
    router.replace(newUrl, { scroll: false });
  }, [router, pathname]);

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
    
    const urlFilters = parseFiltersFromURL();
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
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
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
  const setSelectedFiltersWithURL = useCallback((filters: ActiveFilters) => {
    setSelectedFilters(filters);
    updateURL(filters);
  }, [setSelectedFilters, updateURL]);

  const updateFilters = useCallback((updates: Partial<ActiveFilters>) => {
    const newFilters = { ...selectedFilters, ...updates };
    setSelectedFiltersWithURL(newFilters);
  }, [selectedFilters, setSelectedFiltersWithURL]);

  const selectedGenres = useCallback((genre: string) => {
    const arrGenres = selectedFilters.genres;
    if (arrGenres.includes(genre)) {
      updateFilters({ genres: arrGenres.filter(g => g !== genre) });
    } else {
      updateFilters({ genres: [...arrGenres, genre] });
    }
  }, [selectedFilters.genres, updateFilters]);

  const selectedCountries = useCallback((country: string) => {
    const arrCountries = selectedFilters.countries;
    if (arrCountries.includes(country)) {
      updateFilters({ countries: arrCountries.filter(c => c !== country) });
    } else {
      updateFilters({ countries: [...arrCountries, country] });
    }
  }, [selectedFilters.countries, updateFilters]);

  const selectedYears = useCallback((year: number | null) => {
    updateFilters({ years: year });
  }, [updateFilters]);

  const selectedProducer = useCallback((producer: string) => {
    updateFilters({ producer });
  }, [updateFilters]);

  const selectedActor = useCallback((actor: string) => {
    updateFilters({ actor });
  }, [updateFilters]);

  const selectedRating = useCallback((rating: number) => {
    updateFilters({ rating });
  }, [updateFilters]);

  const selectedGrade = useCallback((grade: number) => {
    updateFilters({ grade });
  }, [updateFilters]);

  return (
    <div className={styles.filters} ref={filtersRef}>
      <div className={styles.content}>
        <div className={styles.blocks}>

          <FilterDropdown
            filterName="Жанры"
            selectedFiltersBy={languageFilters(selectedFilters.genres, allFilters.genres, 'ru').join(', ')}
            activeBlock={activeBlock}
            blockName="genre"
            setActiveBlock={setActiveBlock}
            isWideMenu={true}
          >
            <FilterCheckboxList
              allValues={allFilters.genres}
              selectedValues={selectedFilters.genres}
              onChange={selectedGenres}
            />
          </FilterDropdown>

          <FilterDropdown
            filterName="Страны"
            selectedFiltersBy={languageFilters(selectedFilters.countries, allFilters.countries, 'ru').join(', ')}
            activeBlock={activeBlock}
            blockName="country"
            setActiveBlock={setActiveBlock}
            isWideMenu={true}
          >
            <FilterCheckboxList
              allValues={allFilters.countries}
              selectedValues={selectedFilters.countries}
              onChange={selectedCountries}
            />
          </FilterDropdown>

          <FilterDropdown
            filterName="Год"
            selectedFiltersBy={selectedFilters.years ? String(selectedFilters.years) : ''}
            activeBlock={activeBlock}
            blockName="years"
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
            filterName="Рейтинг"
            selectedFiltersBy={selectedFilters.rating === 0 ? '' : selectedFilters.rating}
            activeBlock={activeBlock}
            blockName="rating"
            setActiveBlock={setActiveBlock}
          >
            <RangeFilter
              handleChangeFilter={selectedRating}
              blockName="rating"
              initialValue={selectedFilters.rating}
            />
          </FilterDropdown>

          <FilterDropdown
            filterName="Оценки"
            selectedFiltersBy={selectedFilters.grade === 0 ? '' : selectedFilters.grade}
            activeBlock={activeBlock}
            blockName="grade"
            setActiveBlock={setActiveBlock}
          >
            <RangeFilter
              handleChangeFilter={selectedGrade}
              blockName="grade"
              initialValue={selectedFilters.grade}
            />
          </FilterDropdown>

          <FilterDropdown
            filterName="Режиссер"
            selectedFiltersBy={selectedFilters.producer}
            activeBlock={activeBlock}
            blockName="producer"
            setActiveBlock={setActiveBlock}
          >
            <PersonSearchFilter
              onChangeFilter={selectedProducer}
              professionId={2}
              setActiveBlock={setActiveBlock}
            />
          </FilterDropdown>

          <FilterDropdown
            filterName="Актер"
            selectedFiltersBy={selectedFilters.actor}
            activeBlock={activeBlock}
            blockName="actor"
            setActiveBlock={setActiveBlock}
          >
            <PersonSearchFilter
              onChangeFilter={selectedActor}
              professionId={1}
              setActiveBlock={setActiveBlock}
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