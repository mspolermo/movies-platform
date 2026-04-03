import type { TFilmFiltersProps } from '../../model';

import styles from './Filters.module.scss';
import {
  PersonSearching,
  RangeSlider,
  ResetFiltersButton,
  ShortCheckboxList,
  WideCheckboxList,
} from './ui';
import { FiltersDropdownProvider } from '../../model';

export const Filters = ({ allFilters, selectedFilters, onUpdateFilters }: TFilmFiltersProps) => {
  return (
    <FiltersDropdownProvider>
      <div className={styles.content}>
        <div className={styles.blocks}>
          <WideCheckboxList
            allValues={allFilters.genres}
            selectedValues={selectedFilters.genres}
            type="genres"
            onChange={onUpdateFilters}
          />

          <WideCheckboxList
            allValues={allFilters.countries}
            selectedValues={selectedFilters.countries}
            type="countries"
            onChange={onUpdateFilters}
          />

          <ShortCheckboxList
            allValues={allFilters.years}
            selectedValues={selectedFilters.years}
            type="years"
            onChange={onUpdateFilters}
          />

          <RangeSlider
            selectedValue={selectedFilters.rating}
            type="rating"
            onChange={onUpdateFilters}
          />

          <RangeSlider
            selectedValue={selectedFilters.grade}
            type="grade"
            onChange={onUpdateFilters}
          />

          <PersonSearching
            selectedValue={selectedFilters.producer}
            type="producer"
            onChange={onUpdateFilters}
          />

          <PersonSearching
            selectedValue={selectedFilters.actor}
            type="actor"
            onChange={onUpdateFilters}
          />
        </div>

        <div className={styles.button}>
          <ResetFiltersButton selectedFilters={selectedFilters} onChange={onUpdateFilters} />
        </div>
      </div>
    </FiltersDropdownProvider>
  );
};
