import type { TFilmFiltersProps } from '../../model';

import { PersonSearching, RangeSlider, ShortCheckboxList, WideCheckboxList } from './ui';

export const FiltersFields = ({
  allFilters,
  selectedFilters,
  onUpdateFilters,
}: TFilmFiltersProps) => {
  return (
    <>
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

      <RangeSlider selectedValue={selectedFilters.grade} type="grade" onChange={onUpdateFilters} />

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
    </>
  );
};
