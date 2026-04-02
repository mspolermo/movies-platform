import type { TFilmFiltersProps, TFilmsFilters } from '../../types';

import { useState, useCallback, useEffect, useRef } from 'react';

import styles from './Filters.module.scss';
import { FilterCheckboxList } from '../FilterCheckboxList';
import { FilterDropdown } from '../FilterDropdown';
import { PersonSearchFilter } from '../PersonSearchFilter';
import { RangeFilter } from '../RangeFilter';
import { ResetFiltersButton } from '../ResetFiltersButton';
import { YearFilter } from '../YearFilter';

const firstCharUp = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const languageFilters = (selectedValues: string[]) => {
  return selectedValues.map((value) => {
    return firstCharUp(value);
  });
};

export const Filters = ({ allFilters, selectedFilters, onUpdateFilters }: TFilmFiltersProps) => {
  const [activeBlock, setActiveBlock] = useState<string[]>([]);
  const filtersRef = useRef<HTMLDivElement>(null);

  const updateFilters = useCallback(
    (updates: Partial<TFilmsFilters>) => {
      const newFilters = { ...selectedFilters, ...updates };
      onUpdateFilters(newFilters);
    },
    [selectedFilters, onUpdateFilters]
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
      updateFilters({ year });
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

  return (
    <div ref={filtersRef} className={styles.filters}>
      <div className={styles.content}>
        <div className={styles.blocks}>
          <FilterDropdown
            activeBlock={activeBlock}
            blockName="genre"
            filterName="Жанры"
            isWideMenu={true}
            selectedFiltersBy={languageFilters(selectedFilters.genres).join(', ')}
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
            selectedFiltersBy={languageFilters(selectedFilters.countries).join(', ')}
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
            selectedFiltersBy={selectedFilters.year !== null ? String(selectedFilters.year) : ''}
            setActiveBlock={setActiveBlock}
          >
            <YearFilter
              allValues={allFilters.years}
              selectValue={selectedFilters.year}
              onChange={selectedYears}
            />
          </FilterDropdown>

          <FilterDropdown
            activeBlock={activeBlock}
            blockName="rating"
            filterName="Рейтинг"
            selectedFiltersBy={selectedFilters.rating === 0 ? '' : selectedFilters.rating}
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
            selectedFiltersBy={selectedFilters.grade === 0 ? '' : selectedFilters.grade}
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
            setSelectedFilters={onUpdateFilters}
          />
        </div>
      </div>
    </div>
  );
};
