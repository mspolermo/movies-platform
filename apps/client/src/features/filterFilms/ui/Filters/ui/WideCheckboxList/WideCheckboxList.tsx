'use client';

import type { TFilterCheckboxListProps } from '../../../../model';

import { useCallback, useMemo } from 'react';

import { MOBILE_BREAKPOINT } from '@/shared/constants';
import { capitalizeFirst, useMediaQuery } from '@/shared/lib';

import { LaptopWideCheckboxList } from './LaptopWideCheckboxList';
import { MobileWideCheckboxList } from './MobileWideCheckboxList';
import { FilterDropdown } from '../../../FilterDropdown';

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

/**
 * Фильтр по жанрам или странам: широкое выпадающее меню с мультивыбором.
 *
 * На узком экране — горизонтальный ряд чипов; на широком — сетка кнопок с галочкой.
 */
export const WideCheckboxList = <T extends 'genres' | 'countries'>({
  type,
  allValues,
  selectedValues,
  onChange,
}: TFilterCheckboxListProps<T>) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const entries = useMemo(
    () =>
      allValues.map((value, i) => ({
        key: `${value}-${i}`,
        value,
        label: capitalizeFirst(value),
      })),
    [allValues]
  );

  const isSelected = useCallback(
    (value: string) => selectedValues.includes(value),
    [selectedValues]
  );

  const onToggle = useCallback(
    (value: string) => {
      const next = selectedValues.includes(value)
        ? selectedValues.filter((x) => x !== value)
        : [...selectedValues, value];

      onChange({
        [type]: next,
      });
    },
    [onChange, selectedValues, type]
  );

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'genres' ? 'Жанры' : 'Страны'}
      isWideMenu={true}
      selectedFiltersBy={selectedValues.map((value) => capitalizeFirst(value)).join(', ')}
    >
      {isMobile ? (
        <MobileWideCheckboxList entries={entries} isSelected={isSelected} onToggle={onToggle} />
      ) : (
        <LaptopWideCheckboxList entries={entries} isSelected={isSelected} onToggle={onToggle} />
      )}
    </FilterDropdown>
  );
};
