import type { TFilterCheckboxListProps } from '../../../../model';

import cn from 'classnames';

import { capitalizeFirst } from '@/shared/lib';

import styles from './WideCheckboxList.module.scss';
import { getCheckboxLabel } from '../../../../lib';
import { FilterDropdown } from '../FilterDropdown';

export const WideCheckboxList = <T extends 'genres' | 'countries'>({
  type,
  allValues,
  selectedValues,
  onChange,
}: TFilterCheckboxListProps<T>) => {
  const isSelected = (value: string) => selectedValues.includes(value);

  const handleToggle = (value: string) => {
    const next = selectedValues.includes(value)
      ? selectedValues.filter((x) => x !== value)
      : [...selectedValues, value];

    onChange({
      [type]: next,
    });
  };

  return (
    <FilterDropdown
      blockName={type}
      filterName={type === 'genres' ? 'Жанры' : 'Страны'}
      isWideMenu={true}
      selectedFiltersBy={selectedValues.map((value) => capitalizeFirst(value)).join(', ')}
    >
      <div className={styles.root}>
        {/* Desktop */}
        <div className={styles.desktop}>
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
            <div className={styles.list}>
              {allValues.map((item) => {
                const label = getCheckboxLabel(item);
                const active = isSelected(label);

                return (
                  <button
                    key={label}
                    className={cn(styles.item, {
                      [styles.itemActive]: active,
                    })}
                    type="button"
                    onClick={() => handleToggle(label)}
                  >
                    <span className={styles.label}>{capitalizeFirst(label)}</span>

                    <span
                      className={cn(styles.checkmark, {
                        [styles.checkmarkVisible]: active,
                      })}
                    >
                      <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                        <path
                          d="M13.5 4.5L6 12L2.5 8.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.mobile}>
          <div className={styles.mobileList}>
            {allValues.map((item) => {
              const label = getCheckboxLabel(item);
              const active = isSelected(label);

              return (
                <button
                  key={label}
                  className={cn(styles.chip, {
                    [styles.chipActive]: active,
                  })}
                  type="button"
                  onClick={() => handleToggle(label)}
                >
                  {capitalizeFirst(label)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FilterDropdown>
  );
};
