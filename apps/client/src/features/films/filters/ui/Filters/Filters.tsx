import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ActiveFilters, AllFilters } from '../../types/filters';
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

  const updateFilters = useCallback((updates: Partial<ActiveFilters>) => {
    setSelectedFilters({ ...selectedFilters, ...updates });
  }, [selectedFilters, setSelectedFilters]);

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
              selectValues={selectedFilters.genres}
              handleChangeFilter={selectedGenres}
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
              selectValues={selectedFilters.countries}
              handleChangeFilter={selectedCountries}
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
              selectValues={selectedFilters.years}
              handleChangeFilter={selectedYears}
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
              handleChangeFilter={selectedProducer}
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
              handleChangeFilter={selectedActor}
              professionId={1}
              setActiveBlock={setActiveBlock}
            />
          </FilterDropdown>
        </div>

        <div className={styles.button}>
          <ResetFiltersButton
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        </div>
      </div>
    </div>
  );
};